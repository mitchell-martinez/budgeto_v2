import styles from './styles.module.scss';

type DonutProps = {
  value: number;
  total: number;
  color: string;
  label: string;
};

const Donut = ({ value, total, color, label }: DonutProps) => {
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
};

export default Donut;
