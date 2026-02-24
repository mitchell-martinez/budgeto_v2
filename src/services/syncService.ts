import type { BudgetEntry } from '@hooks/useBudgetEntries';

import {
  clearSyncQueue,
  getSyncQueue,
  removeSyncQueueItem,
  replaceAllEntries,
} from './budgetStorage';

/* ── API base URL — configure when backend is ready ───── */
const API_BASE: string | null = null; // e.g. '/api/budget'

/**
 * Whether the backend API is configured and available.
 * Until `API_BASE` is set this is always false, meaning all
 * sync operations are no-ops (queue just accumulates locally).
 */
const isApiAvailable = (): boolean => API_BASE !== null;

/* ── Replay queued mutations to the server ────────────── */

/**
 * Read all queued operations from IndexedDB and POST them
 * individually to the API in chronological order.
 *
 * After the queue is drained, fetch the full server dataset
 * (snapshot as of the latest write) and overwrite local
 * IndexedDB entries to resolve any conflicts.
 *
 * This is a no-op stub until `API_BASE` is configured.
 */
export const replayQueue = async (): Promise<void> => {
  if (!isApiAvailable()) {
    return;
  }

  const queue = await getSyncQueue();
  if (queue.length === 0) {
    return;
  }

  for (const op of queue) {
    try {
      const response = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(op),
      });

      if (!response.ok) {
        // Stop replaying on first failure — retry later
        break;
      }

      await removeSyncQueueItem(op.id);
    } catch {
      // Network error — stop and retry on next sync
      break;
    }
  }

  // After draining the queue, snapshot from server to resolve conflicts
  await snapshotFromServer();
};

/**
 * Fetch the full dataset from the server and overwrite local entries.
 * This resolves conflicts using the "last-write-wins then snapshot" strategy:
 * after all queued individual operations are replayed, the server's view
 * of the data is the source of truth.
 */
const snapshotFromServer = async (): Promise<void> => {
  if (!isApiAvailable()) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/entries`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return;
    }

    const entries: BudgetEntry[] = await response.json();
    await replaceAllEntries(entries);
  } catch {
    // Network error — local data is stale but usable
  }
};

/* ── Public sync trigger ──────────────────────────────── */

/**
 * Attempt to sync local changes with the server.
 * Called from:
 * 1. The `online` event listener in entry.client.tsx
 * 2. The service worker's background sync handler
 *
 * No-op until the backend API is configured.
 */
export const startSync = async (): Promise<void> => {
  if (!isApiAvailable()) {
    return;
  }

  await replayQueue();
};

/**
 * Discard the entire sync queue without replaying.
 * Useful after a full server snapshot or manual conflict resolution.
 */
export const discardQueue = async (): Promise<void> => {
  await clearSyncQueue();
};
