import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import Toggle, { type ToggleOption } from '.';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Toggle>;

/* ── Dual: Single / Multi ──────────────────────────────── */

type EntryMode = 'single' | 'multi';

const entryModeOptions: [ToggleOption<EntryMode>, ToggleOption<EntryMode>] = [
  { label: 'Single', value: 'single' },
  { label: 'Multi', value: 'multi' },
];

const EntryModeWrapper = () => {
  const [value, setValue] = useState<EntryMode>('single');
  return (
    <Toggle
      variant='dual'
      options={entryModeOptions}
      value={value}
      onChange={setValue}
      ariaLabel='Entry mode'
    />
  );
};

export const DualEntryMode: Story = {
  name: 'Dual — Single / Multi',
  render: () => <EntryModeWrapper />,
};

/* ── Dual: Theme toggle ────────────────────────────────── */

type Theme = 'light' | 'dark';

const themeOptions: [ToggleOption<Theme>, ToggleOption<Theme>] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const ThemeWrapper = () => {
  const [value, setValue] = useState<Theme>('dark');
  return (
    <Toggle
      variant='dual'
      options={themeOptions}
      value={value}
      onChange={setValue}
      ariaLabel='Theme preference'
    />
  );
};

export const DualTheme: Story = {
  name: 'Dual — Light / Dark',
  render: () => <ThemeWrapper />,
};

/* ── Switch: Notifications ─────────────────────────────── */

const NotificationsWrapper = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Toggle
      variant='switch'
      checked={checked}
      onChange={setChecked}
      label='Notifications'
    />
  );
};

export const SwitchNotifications: Story = {
  name: 'Switch — Notifications',
  render: () => <NotificationsWrapper />,
};

/* ── Switch: Dark Mode setting ─────────────────────────── */

const DarkModeWrapper = () => {
  const [checked, setChecked] = useState(true);
  return (
    <Toggle
      variant='switch'
      checked={checked}
      onChange={setChecked}
      label='Dark Mode'
    />
  );
};

export const SwitchDarkMode: Story = {
  name: 'Switch — Dark Mode (initially on)',
  render: () => <DarkModeWrapper />,
};

/* ── Multiple switches (settings page preview) ─────────── */

const SettingsPageWrapper = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle
        variant='switch'
        checked={notifications}
        onChange={setNotifications}
        label='Notifications'
      />
      <Toggle
        variant='switch'
        checked={darkMode}
        onChange={setDarkMode}
        label='Dark Mode'
      />
      <Toggle
        variant='switch'
        checked={autoSave}
        onChange={setAutoSave}
        label='Auto-save'
      />
    </div>
  );
};

export const SettingsPage: Story = {
  name: 'Switch — Settings page preview',
  render: () => <SettingsPageWrapper />,
};
