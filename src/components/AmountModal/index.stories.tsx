import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

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
      onSubmit={() => setOpen(false)}
    />
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
