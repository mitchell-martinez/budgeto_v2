import { useRef, useState } from 'react';

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
      <div className={styles.swipeWrap} aria-label='Budget swiper controls'>
        <button
          type='button'
          className={`${styles.arrow} ${styles.left} ${activeIndex === 0 ? styles.arrowHidden : ''}`}
          onClick={() => scrollToIndex(0)}
          aria-label='Show spent'
          aria-hidden={activeIndex === 0}
          tabIndex={activeIndex === 0 ? -1 : 0}
        >
          &lt;
        </button>
        <div
          className={styles.swiper}
          aria-label='Swipe horizontally to view spent and leftover'
          ref={swiperRef}
          onScroll={handleScroll}
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
        <button
          type='button'
          className={`${styles.arrow} ${styles.right} ${activeIndex === 1 ? styles.arrowHidden : ''}`}
          onClick={() => scrollToIndex(1)}
          aria-label='Show leftover'
          aria-hidden={activeIndex === 1}
          tabIndex={activeIndex === 1 ? -1 : 0}
        >
          &gt;
        </button>
      </div>
      <div className={styles.buttonRow}>
        <button
          className={styles.actionBtn}
          onClick={() => setIncome((i) => i + 100)}
          aria-label='Add income'
        >
          Add Income
        </button>
        <button
          className={styles.actionBtn}
          onClick={() => setSpent((s) => Math.max(0, s + 50))}
          aria-label='Add expenditure'
        >
          Add Expenditure
        </button>
      </div>
      <div className={styles.swipeHint} aria-hidden='true'>
        Swipe left/right to see spent/leftover
      </div>
    </main>
  );
};

export default Dashboard;
