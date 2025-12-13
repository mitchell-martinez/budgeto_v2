import * as React from 'react';
import styles from './dashboard.module.scss';

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
	const [spent, setSpent] = React.useState(INITIAL_SPENT);
	const [income, setIncome] = React.useState(TOTAL_BUDGET);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const swiperRef = React.useRef<HTMLDivElement | null>(null);

	const handleScroll = () => {
		const el = swiperRef.current;
		if (!el) return;
		const idx = Math.round(el.scrollLeft / el.clientWidth);
		setActiveIndex(Math.max(0, Math.min(1, idx)));
	};

	const scrollToIndex = (idx: number) => {
		const el = swiperRef.current;
		if (!el) return;
		el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
	};

	const leftover = Math.max(0, income - spent);
	const spentPercent = Math.min(100, (spent / income) * 100);
	const leftPercent = Math.max(0, 100 - spentPercent);

	// Donut chart SVG generator
	function Donut({
		value,
		total,
		color,
		label,
	}: {
		value: number;
		total: number;
		color: string;
		label: string;
	}) {
		// Mobile values as base; desktop scales down via CSS-only
		const radius = 120;
		const stroke = 16;
		const normalizedRadius = radius - stroke / 2;
		const circumference = normalizedRadius * 2 * Math.PI;
		const percent = Math.min(100, (value / total) * 100);
		const dash = (percent / 100) * circumference;
		return (
			<div className={styles.donutContainer} aria-label={label}>
				<svg width={radius * 2} height={radius * 2}>
					<circle
						cx={radius}
						cy={radius}
						r={normalizedRadius}
						fill='none'
						stroke='#23232b'
						strokeWidth={stroke}
						className={styles.ring}
					/>
					<circle
						cx={radius}
						cy={radius}
						r={normalizedRadius}
						fill='none'
						stroke={color}
						strokeWidth={stroke}
						className={styles.ring}
						strokeDasharray={`${dash} ${circumference - dash}`}
						strokeLinecap='round'
						transform={`rotate(-90 ${radius} ${radius})`}
					/>
					<text
						x='50%'
						y='50%'
						textAnchor='middle'
						dominantBaseline='central'
						className={styles.donutValue}
						fill='#fff'
						fontWeight='bold'
					>
						${value.toLocaleString()}
					</text>
				</svg>
				<div className={styles.donutLabel}>{label}</div>
			</div>
		);
	}

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
