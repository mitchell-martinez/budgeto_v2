import { useCallback, useEffect, useState } from 'react';

export type BudgetEntryType = 'income' | 'expense';

export type BudgetEntry = {
  id: string;
  amount: number;
  description: string;
  type: BudgetEntryType;
  createdAt: string;
};

const STORAGE_KEY = 'budgeto_entries';

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const readFromStorage = (): BudgetEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as BudgetEntry[];
  } catch {
    return [];
  }
};

const writeToStorage = (entries: BudgetEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const useBudgetEntries = () => {
  const [entries, setEntries] = useState<BudgetEntry[]>(readFromStorage);

  // Sync to localStorage whenever entries change
  useEffect(() => {
    writeToStorage(entries);
  }, [entries]);

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
    },
    [],
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const incomeEntries = entries.filter((e) => e.type === 'income');
  const expenseEntries = entries.filter((e) => e.type === 'expense');

  const totalIncome = incomeEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenseEntries.reduce((sum, e) => sum + e.amount, 0);

  return {
    entries,
    incomeEntries,
    expenseEntries,
    totalIncome,
    totalExpenses,
    addEntry,
    updateEntry,
    deleteEntry,
  } as const;
};

export default useBudgetEntries;
