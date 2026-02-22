import { useCallback, useRef, useState } from 'react';

import AmountModal from '@components/AmountModal';
import Button from '@components/Button';
import Donut from '@components/Donut';
import HistoryPanel from '@components/HistoryPanel';
import type { BudgetEntry } from '@hooks/useBudgetEntries';
import useBudgetEntries from '@hooks/useBudgetEntries';

import styles from './dashboard.module.scss';

export function meta() {
  return [
    { title: 'Budgeto – Modern Budgeting for Techies' },
    {
      name: 'description',
      content:
        'Take control of your finances with Budgeto. Modern, private, and free!',
    },
  ];
}

type HistoryView = 'income' | 'expense' | 'savings' | null;

export const Dashboard = () => {
  const {
    incomeEntries,
    expenseEntries,
    savingsEntries,
    totalIncome,
    totalExpenses,
    totalSavings,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useBudgetEntries();

  const [activeIndex, setActiveIndex] = useState(0);
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpenditure, setOpenExpenditure] = useState(false);
  const [historyView, setHistoryView] = useState<HistoryView>(null);
  const [editingEntry, setEditingEntry] = useState<BudgetEntry | null>(null);
  const swiperRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const element = swiperRef.current;
    if (!element) {
      return;
    }
    const index = Math.round(element.scrollLeft / element.clientWidth);
    setActiveIndex(Math.max(0, Math.min(2, index)));
  };

  const scrollToIndex = (index: number) => {
    const element = swiperRef.current;
    if (!element) {
      return;
    }
    element.scrollTo({ left: index * element.clientWidth, behavior: 'smooth' });
  };

  const leftover = Math.max(0, totalIncome - totalExpenses - totalSavings);
  const savedAmount = Math.max(0, totalSavings);

  /* ── History panel handlers ──────────────────────────── */
  const handleEdit = useCallback((entry: BudgetEntry) => {
    setEditingEntry(entry);
  }, []);

  const handleEditSubmit = useCallback(
    ({ amount, description }: { amount: number; description: string }) => {
      if (!editingEntry) {
        return;
      }
      updateEntry(editingEntry.id, amount, description);
      setEditingEntry(null);
    },
    [editingEntry, updateEntry],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteEntry(id);
    },
    [deleteEntry],
  );

  return (
    <main className={styles.dashboard}>
      {/* ── Add Income modal ──────────────────────────────── */}
      <AmountModal
        title='Add Income'
        ctaText='Add Income'
        open={openIncome}
        onClose={() => setOpenIncome(false)}
        savingsToggleLabel='Savings?'
        onSubmit={({ amount, description, mode, savingsAmount }) => {
          addEntry('income', amount, description);
          if (savingsAmount > 0) {
            addEntry(
              'savings_deposit',
              savingsAmount,
              `Savings from: ${description || 'Income'}`,
            );
          }
          if (mode === 'single') {
            setOpenIncome(false);
          }
        }}
      />

      {/* ── Add Expenditure modal ─────────────────────────── */}
      <AmountModal
        title='Add Expenditure'
        ctaText='Add Expenditure'
        open={openExpenditure}
        onClose={() => setOpenExpenditure(false)}
        savingsToggleLabel='From Savings?'
        onSubmit={({ amount, description, mode, savingsAmount }) => {
          addEntry('expense', amount, description);
          if (savingsAmount > 0) {
            addEntry(
              'savings_withdrawal',
              savingsAmount,
              `Savings used for: ${description || 'Expense'}`,
            );
          }
          if (mode === 'single') {
            setOpenExpenditure(false);
          }
        }}
      />

      {/* ── Edit modal (from history) ─────────────────────── */}
      <AmountModal
        title='Edit Entry'
        ctaText='Save Changes'
        open={editingEntry !== null}
        onClose={() => setEditingEntry(null)}
        onSubmit={handleEditSubmit}
        initialAmount={editingEntry?.amount}
        initialDescription={editingEntry?.description}
      />

      {/* ── History panels ────────────────────────────────── */}
      <HistoryPanel
        title='Income History'
        entries={incomeEntries}
        open={historyView === 'income'}
        onClose={() => setHistoryView(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <HistoryPanel
        title='Expense History'
        entries={expenseEntries}
        open={historyView === 'expense'}
        onClose={() => setHistoryView(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <HistoryPanel
        title='Savings History'
        entries={savingsEntries}
        open={historyView === 'savings'}
        onClose={() => setHistoryView(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ── Donut swiper ──────────────────────────────────── */}
      <div className={styles.swipeWrap} aria-label='Budget swiper controls'>
        <Button
          variant='icon'
          size='sm'
          className={`${styles.arrow} ${styles.left} ${activeIndex === 0 ? styles.arrowHidden : ''}`}
          onClick={() => scrollToIndex(activeIndex - 1)}
          aria-label='Previous panel'
          tabIndex={activeIndex === 0 ? -1 : 0}
        >
          &lt;
        </Button>
        <div
          className={styles.swiper}
          aria-label='Swipe horizontally to view spent, leftover, and saved'
          ref={swiperRef}
          onScroll={handleScroll}
          aria-live='polite'
        >
          <section className={styles.swipeCol} aria-label='Spent'>
            <Donut
              value={totalExpenses}
              total={totalIncome || 1}
              color='#f87171'
              label='Spent'
              onClick={() => setHistoryView('expense')}
            />
          </section>
          <section className={styles.swipeCol} aria-label='Leftover'>
            <Donut
              value={leftover}
              total={totalIncome || 1}
              color='#4ade80'
              label='Leftover'
              onClick={() => setHistoryView('income')}
            />
          </section>
          <section className={styles.swipeCol} aria-label='Saved'>
            <Donut
              value={savedAmount}
              total={totalIncome || 1}
              color='#facc15'
              label='Saved'
              onClick={() => setHistoryView('savings')}
            />
          </section>
        </div>
        <Button
          variant='icon'
          size='sm'
          className={`${styles.arrow} ${styles.right} ${activeIndex === 2 ? styles.arrowHidden : ''}`}
          onClick={() => scrollToIndex(activeIndex + 1)}
          aria-label='Next panel'
          tabIndex={activeIndex === 2 ? -1 : 0}
        >
          &gt;
        </Button>
      </div>
      <div className={styles.buttonRow}>
        <Button
          className={styles.actionBtn}
          onClick={() => setOpenIncome(true)}
          aria-label='Add income'
        >
          Add Income
        </Button>
        <Button
          className={styles.actionBtn}
          onClick={() => setOpenExpenditure(true)}
          aria-label='Add expenditure'
        >
          Add Expenditure
        </Button>
      </div>
    </main>
  );
};

export default Dashboard;
