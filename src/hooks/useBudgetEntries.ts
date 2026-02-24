import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  addEntry as dbAddEntry,
  getAllEntries,
  migrateFromLocalStorage,
  removeEntry as dbRemoveEntry,
  updateEntry as dbUpdateEntry,
} from '../services/budgetStorage';

export type BudgetEntryType =
  | 'income'
  | 'expense'
  | 'savings_deposit'
  | 'savings_withdrawal';

export type BudgetEntry = {
  id: string;
  amount: number;
  description: string;
  type: BudgetEntryType;
  createdAt: string;
};

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const useBudgetEntries = () => {
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const initRef = useRef(false);

  // Initialise from IndexedDB (with localStorage migration on first run)
  useEffect(() => {
    if (typeof window === 'undefined' || initRef.current) {
      return;
    }
    initRef.current = true;

    const init = async () => {
      // Migrate any existing localStorage data into IndexedDB
      const migrated = await migrateFromLocalStorage();
      if (migrated.length > 0) {
        setEntries(migrated);
      } else {
        const stored = await getAllEntries();
        setEntries(stored);
      }
      setIsLoaded(true);
    };

    void init();
  }, []);

  const addEntry = useCallback(
    (type: BudgetEntryType, amount: number, description: string) => {
      const entry: BudgetEntry = {
        id: generateId(),
        amount,
        description,
        type,
        createdAt: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, entry]);
      void dbAddEntry(entry);
    },
    [],
  );

  const updateEntry = useCallback(
    (id: string, amount: number, description: string) => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, amount, description } : entry,
        ),
      );
      void dbUpdateEntry(id, amount, description);
    },
    [],
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    void dbRemoveEntry(id);
  }, []);

  const incomeEntries = useMemo(
    () => entries.filter((e) => e.type === 'income'),
    [entries],
  );
  const expenseEntries = useMemo(
    () => entries.filter((e) => e.type === 'expense'),
    [entries],
  );
  const savingsEntries = useMemo(
    () =>
      entries.filter(
        (e) => e.type === 'savings_deposit' || e.type === 'savings_withdrawal',
      ),
    [entries],
  );

  const totalIncome = useMemo(
    () => incomeEntries.reduce((sum, e) => sum + e.amount, 0),
    [incomeEntries],
  );
  const totalExpenses = useMemo(
    () => expenseEntries.reduce((sum, e) => sum + e.amount, 0),
    [expenseEntries],
  );
  const totalSavings = useMemo(() => {
    const deposits = savingsEntries
      .filter((e) => e.type === 'savings_deposit')
      .reduce((sum, e) => sum + e.amount, 0);
    const withdrawals = savingsEntries
      .filter((e) => e.type === 'savings_withdrawal')
      .reduce((sum, e) => sum + e.amount, 0);
    return deposits - withdrawals;
  }, [savingsEntries]);

  return {
    entries,
    isLoaded,
    incomeEntries,
    expenseEntries,
    savingsEntries,
    totalIncome,
    totalExpenses,
    totalSavings,
    addEntry,
    updateEntry,
    deleteEntry,
  } as const;
};

export default useBudgetEntries;
