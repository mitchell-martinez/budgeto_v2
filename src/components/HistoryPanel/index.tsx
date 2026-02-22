import { useEffect, useRef } from 'react';

import type { BudgetEntry } from '@hooks/useBudgetEntries';

import styles from './styles.module.scss';

type HistoryPanelProps = {
  title: string;
  entries: BudgetEntry[];
  open: boolean;
  onClose: () => void;
  onEdit: (entry: BudgetEntry) => void;
  onDelete: (id: string) => void;
};

const PencilIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <path d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' />
  </svg>
);

const TrashIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <polyline points='3 6 5 6 21 6' />
    <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
    <line x1='10' y1='11' x2='10' y2='17' />
    <line x1='14' y1='11' x2='14' y2='17' />
  </svg>
);

const HistoryPanel = ({
  title,
  entries,
  open,
  onClose,
  onEdit,
  onDelete,
}: HistoryPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap & escape key
  useEffect(() => {
    if (!open) {
      return;
    }

    const node = panelRef.current;
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
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, entries]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role='dialog'
      aria-modal='true'
      aria-label={title}
    >
      <div className={styles.panel} ref={panelRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeBtn}
            aria-label='Close history'
            onClick={onClose}
            type='button'
          >
            &times;
          </button>
        </div>

        <div className={styles.tableWrap}>
          {entries.length === 0 ? (
            <p className={styles.emptyState}>No entries yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope='col'>Amount</th>
                  <th scope='col'>Description</th>
                  <th scope='col'>
                    <span className={styles.srOnly}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className={styles.amountCell}>
                      $
                      {entry.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className={styles.descriptionCell}>
                      {entry.description ? (
                        entry.description
                      ) : (
                        <span className={styles.noDescription}>None</span>
                      )}
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.iconBtn}
                        aria-label={`Edit entry of $${entry.amount}`}
                        onClick={() => onEdit(entry)}
                        type='button'
                      >
                        <PencilIcon />
                      </button>
                      <button
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        aria-label={`Delete entry of $${entry.amount}`}
                        onClick={() => onDelete(entry.id)}
                        type='button'
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <button
        className={styles.backdrop}
        aria-hidden={true}
        tabIndex={-1}
        onClick={onClose}
        type='button'
      />
    </div>
  );
};

export default HistoryPanel;
