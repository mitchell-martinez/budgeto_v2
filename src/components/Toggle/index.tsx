import { useId } from 'react';

import styles from './styles.module.scss';

export type ToggleOption<T extends string = string> = {
  label: string;
  value: T;
};

type ToggleDualProps<T extends string = string> = {
  variant: 'dual';
  options: [ToggleOption<T>, ToggleOption<T>];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

type ToggleSwitchProps = {
  variant: 'switch';
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
};

export type ToggleProps<T extends string = string> =
  | ToggleDualProps<T>
  | ToggleSwitchProps;

const Toggle = <T extends string = string>(props: ToggleProps<T>) => {
  const id = useId();

  if (props.variant === 'switch') {
    const { checked, onChange, label, className } = props;
    const classes = [styles.switch, className].filter(Boolean).join(' ');
    const labelId = `${id}-switch-label`;

    return (
      <div className={classes}>
        <span id={labelId} className={styles.switchLabel}>
          {label}
        </span>
        <button
          type='button'
          role='switch'
          aria-checked={checked}
          aria-labelledby={labelId}
          className={`${styles.switchButton} ${checked ? styles.switchButtonChecked : ''}`}
          onClick={() => onChange(!checked)}
        >
          <span className={styles.switchTrack}>
            <span className={styles.switchThumb} />
          </span>
        </button>
      </div>
    );
  }

  const { options, value, onChange, ariaLabel, className } = props;
  const classes = [styles.dual, className].filter(Boolean).join(' ');

  return (
    <div className={classes} role='radiogroup' aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type='button'
          role='radio'
          aria-checked={value === option.value}
          className={`${styles.dualOption} ${value === option.value ? styles.dualOptionActive : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
