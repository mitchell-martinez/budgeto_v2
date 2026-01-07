import { forwardRef } from 'react';

import styles from './styles.module.scss';

type ButtonOwnProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};

export type ButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      className,
      type = 'button',
      children,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.button,
      variant && styles[variant],
      size && styles[`size_${size}`],
      fullWidth ? styles.fullWidth : undefined,
      loading ? styles.loading : undefined,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
