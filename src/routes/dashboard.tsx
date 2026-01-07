import { useRef, useState } from 'react';

import AmountModal from '@components/AmountModal';
import Button from '@components/Button';
import Donut from '@components/Donut';

import styles from './dashboard.module.scss';

/* Swap this with real data later */
const TOTAL_BUDGET = 2000;
const INITIAL_SPENT = 1200;

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

export const Dashboard = () => {
  const [spent, setSpent] = useState(INITIAL_SPENT);
  const [income, setIncome] = useState(TOTAL_BUDGET);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIncome, setOpenIncome] = useState(false);
  const [openExpenditure, setOpenExpenditure] = useState(false);
  const swiperRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const element = swiperRef.current;
    if (!element) {
      return;
    }
    const index = Math.round(element.scrollLeft / element.clientWidth);
    setActiveIndex(Math.max(0, Math.min(1, index)));
  };

  const scrollToIndex = (index: number) => {
    const element = swiperRef.current;
    if (!element) {
      return;
    }
    element.scrollTo({ left: index * element.clientWidth, behavior: 'smooth' });
  };

  const leftover = Math.max(0, income - spent);

  return (
    <main className={styles.dashboard}>
      <AmountModal
        title='Add Income'
        ctaText='Add Income'
        open={openIncome}
        onClose={() => setOpenIncome(false)}
        onSubmit={({ amount }) => {
          setIncome((i) => i + amount);
          setOpenIncome(false);
        }}
      />
      <AmountModal
        title='Add Expenditure'
        ctaText='Add Expenditure'
        open={openExpenditure}
        onClose={() => setOpenExpenditure(false)}
        onSubmit={({ amount }) => {
          setSpent((s) => Math.max(0, s + amount));
          setOpenExpenditure(false);
        }}
      />
      <div className={styles.swipeWrap} aria-label='Budget swiper controls'>
        <Button
          variant='icon'
          size='sm'
          className={`${styles.arrow} ${styles.left} ${activeIndex === 0 ? styles.arrowHidden : ''}`}
          onClick={() => scrollToIndex(0)}
          aria-label='Show spent'
          tabIndex={activeIndex === 0 ? -1 : 0}
        >
          &lt;
        </Button>
        <div
          className={styles.swiper}
          aria-label='Swipe horizontally to view spent and leftover'
          ref={swiperRef}
          onScroll={handleScroll}
          role='button'
          onClick={() => console.log('Clicked')}
          tabIndex={0}
          aria-live='polite'
        >
          <section className={styles.swipeCol} aria-label='Spent'>
            <Donut value={spent} total={income} color='#f87171' label='Spent' />
          </section>
          <section className={styles.swipeCol} aria-label='Leftover'>
            <Donut
              value={leftover}
              total={income}
              color='#4ade80'
              label='Leftover'
            />
          </section>
        </div>
        <Button
          variant='icon'
          size='sm'
          className={`${styles.arrow} ${styles.right} ${activeIndex === 1 ? styles.arrowHidden : ''}`}
          onClick={() => scrollToIndex(1)}
          aria-label='Show leftover'
          tabIndex={activeIndex === 1 ? -1 : 0}
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
