import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import type { AmountModalData } from '.';
import AmountModal from '.';

const meta: Meta<typeof AmountModal> = {
  title: 'Components/AmountModal',
  component: AmountModal,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof AmountModal>;

const Wrapper = (args: React.ComponentProps<typeof AmountModal>) => {
  const [open, setOpen] = useState(true);
  return (
    <AmountModal
      {...args}
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={({ mode }) => {
        if (mode === 'single') {
          setOpen(false);
        }
      }}
    />
  );
};

/** Demonstrates Multi mode: submit adds to the running total without closing. */
const MultiWrapper = (args: React.ComponentProps<typeof AmountModal>) => {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState<AmountModalData[]>([]);

  const handleSubmit = (data: AmountModalData) => {
    setItems((prev) => [...prev, data]);
  };

  const total = items.reduce((sum, i) => sum + i.amount, 0);

  return (
    <>
      <AmountModal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
      {items.length > 0 && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <strong>
            Added {items.length} item(s) — Total: ${total.toFixed(2)}
          </strong>
        </div>
      )}
    </>
  );
};

export const AddIncome: Story = {
  render: (args) => <Wrapper {...args} />,
  args: { title: 'Add Income', ctaText: 'Add Income' },
};

export const AddExpenditure: Story = {
  render: (args) => <Wrapper {...args} />,
  args: { title: 'Add Expenditure', ctaText: 'Add Expenditure' },
};

export const EditIncome: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    title: 'Edit Income',
    ctaText: 'Save changes',
    initialAmount: 250,
    initialDescription: 'Side gig',
  },
};

export const EditExpenditure: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    title: 'Edit Expenditure',
    ctaText: 'Save changes',
    initialAmount: 75,
    initialDescription: 'Coffee + snacks',
  },
};

export const MultiMode: Story = {
  render: (args) => <MultiWrapper {...args} />,
  args: {
    title: 'Add Income',
    ctaText: 'Add Income',
  },
};
