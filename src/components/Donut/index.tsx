import styles from './styles.module.scss';

type DonutProps = {
  value: number;
  total: number;
  color: string;
  label: string;
};

const Donut = ({ value, total, color, label }: DonutProps) => {
  const radius = 140;
  const stroke = 20;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.min(100, (value / total) * 100);
  const dash = (percent / 100) * circumference;
  return (
    <div className={styles.donutContainer} aria-label={label}>
      <div className={styles.svgWrap}>
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
        </svg>
        <h2 className={styles.valueHeading} aria-live='polite'>
          ${value.toLocaleString()}
        </h2>
      </div>
      <div className={styles.donutLabel}>{label}</div>
    </div>
  );
};

export default Donut;
