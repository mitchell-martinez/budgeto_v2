import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Toggle, { type ToggleOption } from '@components/Toggle';

describe('Toggle', () => {
  // ── Dual variant ────────────────────────────────────────────────

  describe('variant="dual"', () => {
    type Mode = 'single' | 'multi';

    const options: [ToggleOption<Mode>, ToggleOption<Mode>] = [
      { label: 'Single', value: 'single' },
      { label: 'Multi', value: 'multi' },
    ];

    const setupDual = (value: Mode = 'single', onChange = vi.fn()) => {
      const view = render(
        <Toggle
          variant='dual'
          options={options}
          value={value}
          onChange={onChange}
          ariaLabel='Entry mode'
        />,
      );
      return { ...view, onChange };
    };

    it('renders a radiogroup with the correct aria-label', () => {
      setupDual();
      const group = screen.getByRole('radiogroup', { name: /entry mode/i });
      expect(group).toBeVisible();
    });

    it('renders both options as radio buttons', () => {
      setupDual();
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
      expect(screen.getByRole('radio', { name: /single/i })).toBeVisible();
      expect(screen.getByRole('radio', { name: /multi/i })).toBeVisible();
    });

    it('marks the active option with aria-checked="true"', () => {
      setupDual('single');
      expect(screen.getByRole('radio', { name: /single/i })).toHaveAttribute(
        'aria-checked',
        'true',
      );
      expect(screen.getByRole('radio', { name: /multi/i })).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });

    it('marks the second option as active when value matches', () => {
      setupDual('multi');
      expect(screen.getByRole('radio', { name: /single/i })).toHaveAttribute(
        'aria-checked',
        'false',
      );
      expect(screen.getByRole('radio', { name: /multi/i })).toHaveAttribute(
        'aria-checked',
        'true',
      );
    });

    it('calls onChange with the option value when clicked', () => {
      const onChange = vi.fn();
      setupDual('single', onChange);

      fireEvent.click(screen.getByRole('radio', { name: /multi/i }));
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith('multi');
    });

    it('calls onChange when clicking the already-active option', () => {
      const onChange = vi.fn();
      setupDual('single', onChange);

      fireEvent.click(screen.getByRole('radio', { name: /single/i }));
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith('single');
    });

    it('applies a custom className when provided', () => {
      const { container } = render(
        <Toggle
          variant='dual'
          options={options}
          value='single'
          onChange={vi.fn()}
          ariaLabel='Entry mode'
          className='custom-class'
        />,
      );
      const group = container.firstChild as HTMLElement;
      expect(group.className).toContain('custom-class');
    });

    it('does not apply undefined to className when no custom class is provided', () => {
      const { container } = render(
        <Toggle
          variant='dual'
          options={options}
          value='single'
          onChange={vi.fn()}
          ariaLabel='Entry mode'
        />,
      );
      const group = container.firstChild as HTMLElement;
      expect(group.className).not.toContain('undefined');
    });

    it('works with different generic value types', () => {
      type Theme = 'light' | 'dark';

      const themeOptions: [ToggleOption<Theme>, ToggleOption<Theme>] = [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ];
      const onChange = vi.fn();

      render(
        <Toggle
          variant='dual'
          options={themeOptions}
          value='dark'
          onChange={onChange}
          ariaLabel='Theme'
        />,
      );

      expect(screen.getByRole('radio', { name: /dark/i })).toHaveAttribute(
        'aria-checked',
        'true',
      );

      fireEvent.click(screen.getByRole('radio', { name: /light/i }));
      expect(onChange).toHaveBeenCalledWith('light');
    });

    it('all radio buttons have type="button" to prevent form submission', () => {
      setupDual();
      const radios = screen.getAllByRole('radio');
      for (const radio of radios) {
        expect(radio).toHaveAttribute('type', 'button');
      }
    });
  });

  // ── Switch variant ──────────────────────────────────────────────

  describe('variant="switch"', () => {
    const setupSwitch = (checked = false, onChange = vi.fn()) => {
      const view = render(
        <Toggle
          variant='switch'
          checked={checked}
          onChange={onChange}
          label='Notifications'
        />,
      );
      return { ...view, onChange };
    };

    it('renders a switch role button', () => {
      setupSwitch();
      expect(screen.getByRole('switch')).toBeVisible();
    });

    it('displays the visible label', () => {
      setupSwitch();
      expect(screen.getByText('Notifications')).toBeVisible();
    });

    it('is accessible by its visible label text', () => {
      setupSwitch();
      expect(
        screen.getByRole('switch', { name: /notifications/i }),
      ).toBeVisible();
    });

    it('sets aria-checked="false" when unchecked', () => {
      setupSwitch(false);
      expect(screen.getByRole('switch')).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });

    it('sets aria-checked="true" when checked', () => {
      setupSwitch(true);
      expect(screen.getByRole('switch')).toHaveAttribute(
        'aria-checked',
        'true',
      );
    });

    it('calls onChange with true when clicking an unchecked switch', () => {
      const onChange = vi.fn();
      setupSwitch(false, onChange);

      fireEvent.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when clicking a checked switch', () => {
      const onChange = vi.fn();
      setupSwitch(true, onChange);

      fireEvent.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('has type="button" to prevent form submission', () => {
      setupSwitch();
      expect(screen.getByRole('switch')).toHaveAttribute('type', 'button');
    });

    it('applies a custom className when provided', () => {
      const { container } = render(
        <Toggle
          variant='switch'
          checked={false}
          onChange={vi.fn()}
          label='Test'
          className='custom-class'
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('custom-class');
    });

    it('does not apply undefined to className when no custom class is provided', () => {
      const { container } = render(
        <Toggle
          variant='switch'
          checked={false}
          onChange={vi.fn()}
          label='Test'
        />,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).not.toContain('undefined');
    });
  });
});
