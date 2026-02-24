import { type DBSchema, type IDBPDatabase, openDB } from 'idb';

import type { BudgetEntry, BudgetEntryType } from '@hooks/useBudgetEntries';

/* ── Sync queue operation types ───────────────────────── */
export type SyncOperation = {
  id: number;
  type: 'add' | 'update' | 'delete';
  payload: {
    entryId: string;
    amount?: number;
    description?: string;
    entryType?: BudgetEntryType;
    createdAt?: string;
  };
  timestamp: number;
};

/* ── IndexedDB schema ─────────────────────────────────── */
interface BudgetoDB extends DBSchema {
  entries: {
    key: string;
    value: BudgetEntry;
    indexes: { 'by-type': BudgetEntryType; 'by-created': string };
  };
  syncQueue: {
    key: number;
    value: SyncOperation;
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'budgeto';
const DB_VERSION = 1;
const LOCAL_STORAGE_KEY = 'budgeto_entries';

let dbPromise: Promise<IDBPDatabase<BudgetoDB>> | null = null;

/**
 * Open (or return cached) IndexedDB connection.
 * Safe to call multiple times — only one connection is ever opened.
 */
const getDb = (): Promise<IDBPDatabase<BudgetoDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<BudgetoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        /* entries store */
        const entryStore = db.createObjectStore('entries', { keyPath: 'id' });
        entryStore.createIndex('by-type', 'type');
        entryStore.createIndex('by-created', 'createdAt');

        /* sync queue (auto-increment for ordering) */
        const syncStore = db.createObjectStore('syncQueue', {
          keyPath: 'id',
          autoIncrement: true,
        });
        syncStore.createIndex('by-timestamp', 'timestamp');
      },
    });
  }
  return dbPromise;
};

/* ── Migration from localStorage ──────────────────────── */

/**
 * One-time migration: read existing budgeto_entries from localStorage,
 * write them into IndexedDB, then remove the localStorage key.
 * Returns the migrated entries (or empty array if nothing to migrate).
 */
export const migrateFromLocalStorage = async (): Promise<BudgetEntry[]> => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }

    const entries = parsed as BudgetEntry[];
    const db = await getDb();
    const tx = db.transaction('entries', 'readwrite');

    await Promise.all([
      ...entries.map((entry) => tx.store.put(entry)),
      tx.done,
    ]);

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return entries;
  } catch {
    return [];
  }
};

/* ── CRUD operations ──────────────────────────────────── */

export const getAllEntries = async (): Promise<BudgetEntry[]> => {
  const db = await getDb();
  return db.getAll('entries');
};

export const addEntry = async (entry: BudgetEntry): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(['entries', 'syncQueue'], 'readwrite');

  await tx.objectStore('entries').put(entry);
  await tx.objectStore('syncQueue').add({
    type: 'add',
    payload: {
      entryId: entry.id,
      amount: entry.amount,
      description: entry.description,
      entryType: entry.type,
      createdAt: entry.createdAt,
    },
    timestamp: Date.now(),
  } as SyncOperation);

  await tx.done;
};

export const updateEntry = async (
  id: string,
  amount: number,
  description: string,
): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(['entries', 'syncQueue'], 'readwrite');

  const existing = await tx.objectStore('entries').get(id);
  if (existing) {
    await tx.objectStore('entries').put({ ...existing, amount, description });
  }

  await tx.objectStore('syncQueue').add({
    type: 'update',
    payload: { entryId: id, amount, description },
    timestamp: Date.now(),
  } as SyncOperation);

  await tx.done;
};

export const removeEntry = async (id: string): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction(['entries', 'syncQueue'], 'readwrite');

  await tx.objectStore('entries').delete(id);
  await tx.objectStore('syncQueue').add({
    type: 'delete',
    payload: { entryId: id },
    timestamp: Date.now(),
  } as SyncOperation);

  await tx.done;
};

/* ── Sync queue helpers (consumed by syncService) ─────── */

export const getSyncQueue = async (): Promise<SyncOperation[]> => {
  const db = await getDb();
  return db.getAllFromIndex('syncQueue', 'by-timestamp');
};

export const removeSyncQueueItem = async (id: number): Promise<void> => {
  const db = await getDb();
  await db.delete('syncQueue', id);
};

export const clearSyncQueue = async (): Promise<void> => {
  const db = await getDb();
  await db.clear('syncQueue');
};

/**
 * Overwrite local entries with a server snapshot (conflict resolution).
 * Clears all local entries and replaces with the provided array.
 */
export const replaceAllEntries = async (
  entries: BudgetEntry[],
): Promise<void> => {
  const db = await getDb();
  const tx = db.transaction('entries', 'readwrite');
  await tx.store.clear();
  await Promise.all([...entries.map((e) => tx.store.put(e)), tx.done]);
};
