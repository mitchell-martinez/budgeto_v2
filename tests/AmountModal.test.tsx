import AmountModal from '@components/AmountModal';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('AmountModal', () => {
  const setup = (props?: Partial<ComponentProps<typeof AmountModal>>) => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(
      <AmountModal
        title='Add Income'
        ctaText='Add Income'
        open={true}
        onClose={onClose}
        onSubmit={onSubmit}
        {...props}
      />,
    );
    return { onClose, onSubmit };
  };

  it('renders title and CTA', () => {
    setup();
    expect(screen.getByRole('heading', { name: /add income/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /add income/i })).toBeVisible();
  });

  it('validates amount and blocks submission', () => {
    const { onSubmit } = setup();
    const submit = screen.getByRole('button', { name: /add income/i });
    fireEvent.click(submit);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/amount is required/i)).toBeVisible();
  });

  it('submits valid amount', () => {
    const { onSubmit } = setup();
    const input = screen.getByLabelText('Amount', { selector: 'input' });
    fireEvent.change(input, { target: { value: '123.45' } });
    const submit = screen.getByRole('button', { name: /add income/i });
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith({ amount: 123.45, description: '' });
  });

  it('closes on ESC', () => {
    const { onClose } = setup();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('backdrop click closes', () => {
    const { onClose } = setup();
    const backdrop = screen.getByRole('button', { hidden: true });
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});
