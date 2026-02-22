import { fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';

import AmountModal from '../src/components/AmountModal';

describe('AmountModal', () => {
  const setup = (
    props?: Partial<ComponentProps<typeof AmountModal>>,
    baseProps: ComponentProps<typeof AmountModal> = {
      title: 'Add Income',
      ctaText: 'Add Income',
      open: true,
      onClose: vi.fn(),
      onSubmit: vi.fn(),
    },
  ) => {
    const merged = { ...baseProps, ...props };
    const view = render(<AmountModal {...merged} />);
    return {
      ...view,
      onClose: merged.onClose as unknown as ReturnType<typeof vi.fn>,
      onSubmit: merged.onSubmit as unknown as ReturnType<typeof vi.fn>,
    };
  };

  it('renders dialog semantics + visual structure (title, close button, inputs, CTA)', () => {
    setup();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'amount-modal-heading');

    expect(screen.getByRole('heading', { name: /add income/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /close modal/i })).toBeVisible();

    // Accessibility/appearance: the inputs exist and are visible.
    expect(
      screen.getByLabelText('Amount', { selector: 'input' }),
    ).toBeVisible();
    expect(
      screen.getByLabelText('Description', { selector: 'input' }),
    ).toBeVisible();

    expect(screen.getByRole('button', { name: /add income/i })).toBeVisible();
  });

  it('disables CTA when amount is invalid and enables when valid', () => {
    setup();

    const submit = screen.getByRole('button', { name: /add income/i });
    expect(submit).toBeDisabled();

    const amountInput = screen.getByLabelText('Amount', { selector: 'input' });
    fireEvent.change(amountInput, { target: { value: '0' } });
    expect(submit).toBeDisabled();

    fireEvent.change(amountInput, { target: { value: '12.34' } });
    expect(submit).not.toBeDisabled();
  });

  it('shows validation error on submit when amount is empty (and sets invalid a11y attributes)', () => {
    const { onSubmit } = setup();

    // Force submission even while disabled.
    fireEvent.submit(screen.getByRole('form'));

    expect(onSubmit).not.toHaveBeenCalled();

    const amountInput = screen.getByLabelText('Amount', { selector: 'input' });
    expect(amountInput).toHaveAttribute('aria-invalid', 'true');
    expect(amountInput).toHaveAttribute('aria-describedby', 'amount-error');
    expect(screen.getByText(/amount is required/i)).toBeVisible();
  });

  it('shows validation error on submit when amount is not a number (type=number can still report empty/invalid in tests)', () => {
    const { onSubmit } = setup();
    const amountInput = screen.getByLabelText('Amount', { selector: 'input' });

    // Some DOMs coerce invalid input for type="number"; using a clearly invalid string still
    // exercises our parseFloat/Number.isFinite guard in a stable way.
    fireEvent.change(amountInput, { target: { value: 'abc' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/enter a valid number/i)).toBeVisible();
  });

  it('shows validation error on submit when amount is <= 0', () => {
    const { onSubmit } = setup();
    const amountInput = screen.getByLabelText('Amount', { selector: 'input' });

    fireEvent.change(amountInput, { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/greater than 0/i)).toBeVisible();
  });

  it('submits valid amount', () => {
    const { onSubmit } = setup();
    const input = screen.getByLabelText('Amount', { selector: 'input' });
    fireEvent.change(input, { target: { value: '123.45' } });
    const submit = screen.getByRole('button', { name: /add income/i });
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith({
      amount: 123.45,
      description: '',
      mode: 'single',
      savingsAmount: 0,
    });
  });

  it('submits valid amount + description', () => {
    const { onSubmit } = setup();
    const amountInput = screen.getByLabelText('Amount', { selector: 'input' });
    const descriptionInput = screen.getByLabelText('Description', {
      selector: 'input',
    });

    fireEvent.change(amountInput, { target: { value: '10' } });
    fireEvent.change(descriptionInput, { target: { value: 'Paycheck' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(onSubmit).toHaveBeenCalledWith({
      amount: 10,
      description: 'Paycheck',
      mode: 'single',
      savingsAmount: 0,
    });
  });

  it('closes on ESC', () => {
    const { onClose } = setup();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('close button click closes', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('backdrop click closes', () => {
    const { onClose } = setup();
    const backdrop = screen.getByRole('button', { hidden: true });
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('focuses the first focusable element when opened (close button)', () => {
    setup();
    expect(screen.getByRole('button', { name: /close modal/i })).toHaveFocus();
  });

  it('traps focus with Tab / Shift+Tab within the modal while open', () => {
    setup();

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    const submit = screen.getByRole('button', { name: /add income/i });
    expect(closeBtn).toHaveFocus();

    // Shift+Tab from first should wrap to last.
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(submit).toHaveFocus();

    // Tab from last should wrap to first.
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(closeBtn).toHaveFocus();
  });

  it('closed then opened again resets fields and clears errors', () => {
    const baseProps: ComponentProps<typeof AmountModal> = {
      title: 'Add Income',
      ctaText: 'Add Income',
      open: false,
      onClose: vi.fn(),
      onSubmit: vi.fn(),
      initialAmount: 50,
      initialDescription: 'Initial',
    };

    const { rerender } = setup(undefined, baseProps);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open
    rerender(<AmountModal {...baseProps} open={true} />);

    const amountInput = screen.getByLabelText('Amount', { selector: 'input' });
    const descriptionInput = screen.getByLabelText('Description', {
      selector: 'input',
    });

    expect(amountInput).toHaveValue(50);
    expect(descriptionInput).toHaveValue('Initial');

    // Introduce an error + different values.
    fireEvent.change(amountInput, { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(screen.getByText(/greater than 0/i)).toBeVisible();

    fireEvent.change(descriptionInput, { target: { value: 'Changed' } });

    // Close (component typically unmounts when parent toggles open)
    rerender(<AmountModal {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Re-open should reset to initial props and clear validation UI.
    rerender(<AmountModal {...baseProps} open={true} />);
    expect(screen.queryByText(/greater than 0/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Amount', { selector: 'input' })).toHaveValue(
      50,
    );
    expect(
      screen.getByLabelText('Description', { selector: 'input' }),
    ).toHaveValue('Initial');
  });

  it('opened then closed removes dialog from the DOM (parent controls open/close)', () => {
    const baseProps: ComponentProps<typeof AmountModal> = {
      title: 'Add Income',
      ctaText: 'Add Income',
      open: true,
      onClose: vi.fn(),
      onSubmit: vi.fn(),
    };

    const { rerender } = setup(undefined, baseProps);
    expect(screen.getByRole('dialog')).toBeVisible();

    rerender(<AmountModal {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
