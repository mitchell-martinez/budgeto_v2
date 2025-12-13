import { type Meta, type StoryObj } from '@storybook/react';

import Button from '@components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Click me',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
  },
};
