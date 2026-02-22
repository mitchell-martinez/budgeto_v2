import { type Meta, type StoryObj } from '@storybook/react-vite';

import Donut from '.';

const meta: Meta<typeof Donut> = {
  title: 'Components/Donut',
  component: Donut,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: { type: 'number', min: 0 } },
    total: { control: { type: 'number', min: 1 } },
    color: { control: 'color' },
    label: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Donut>;

export const Income: Story = {
  args: {
    value: 12000,
    total: 20000,
    color: '#34c759',
    label: 'Income',
  },
};

export const Expenses: Story = {
  args: {
    value: 8000,
    total: 20000,
    color: '#ff3b30',
    label: 'Expenses',
  },
};

export const FullCircle: Story = {
  args: {
    value: 100,
    total: 100,
    color: '#0a84ff',
    label: '100% Achieved',
  },
};
