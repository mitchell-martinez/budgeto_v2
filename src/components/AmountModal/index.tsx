import { useEffect, useRef, useState } from 'react';

import Button from '@components/Button';

import styles from './styles.module.scss';

export type AmountModalData = {
  amount: number;
  description: string;
};

export type AmountModalProps = {
  title: string;
  ctaText: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AmountModalData) => void;
  initialAmount?: number;
  initialDescription?: string;
};

const AmountModal = ({
  title,
  ctaText,
  open,
  onClose,
  onSubmit,
  initialAmount = 0,
  initialDescription = '',
}: AmountModalProps) => {
  const [amount, setAmount] = useState<string>(
    initialAmount ? String(initialAmount) : '',
  );
  const [description, setDescription] = useState<string>(initialDescription);
  const [error, setError] = useState<string>('');
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setAmount(initialAmount ? String(initialAmount) : '');
      setDescription(initialDescription);
      setError('');
    }
  }, [open, initialAmount, initialDescription]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const node = dialogRef.current;
    const focusable = node?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const first = focusable?.[0];
    const last = focusable && focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab' && focusable && focusable.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement)?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement)?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const headingId = 'amount-modal-heading';
  const errorId = 'amount-error';

  const validate = (value: string) => {
    const parsed = parseFloat(value);
    if (!value) {
      return 'Amount is required';
    }
    if (!Number.isFinite(parsed)) {
      return 'Enter a valid number';
    }
    if (parsed <= 0) {
      return 'Amount must be greater than 0';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validate(amount);
    if (err) {
      setError(err);
      return;
    }
    const parsed = parseFloat(amount);
    onSubmit({ amount: parsed, description });
  };

  const onAmountChange = (value: string) => {
    setAmount(value);
    if (error) {
      setError(validate(value));
    }
  };

  return (
    <div
      className={styles.overlay}
      role='dialog'
      aria-modal='true'
      aria-labelledby={headingId}
    >
      <div className={styles.modal} ref={dialogRef}>
        <Button
          variant='icon'
          size='sm'
          className={styles.closeBtn}
          aria-label='Close modal'
          onClick={onClose}
        >
          &times;
        </Button>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.srOnly} htmlFor='amount-modal-amount'>
            Amount
          </label>
          <input
            id='amount-modal-amount'
            className={styles.input}
            type='number'
            inputMode='decimal'
            min={0}
            step='0.01'
            placeholder='Amount'
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            required
          />
          {error && (
            <div id={errorId} className={styles.error} aria-live='polite'>
              {error}
            </div>
          )}

          <label className={styles.srOnly} htmlFor='amount-modal-description'>
            Description
          </label>
          <input
            id='amount-modal-description'
            className={styles.input}
            type='text'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            className={styles.cta}
            type='submit'
            disabled={!!validate(amount)}
            fullWidth
            size='lg'
          >
            {ctaText}
          </Button>
        </form>
      </div>
      <button
        className={styles.backdrop}
        aria-hidden={true}
        tabIndex={-1}
        onClick={onClose}
      />
    </div>
  );
};

export default AmountModal;
