import { Theme } from '@radix-ui/themes';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeContextValue = {
  isLight: boolean;
  toggle: () => void;
  setLight: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'light') {
        return true;
      }
      if (stored === 'dark') {
        return false;
      }
    } catch {
      /* ignore storage errors */
    }
    return (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: light)').matches
    );
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('theme', isLight ? 'light' : 'dark');
    } catch {
      /* ignore storage errors */
    }
  }, [isLight]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isLight,
      toggle: () => setIsLight((v) => !v),
      setLight: setIsLight,
    }),
    [isLight],
  );

  return (
    <ThemeContext.Provider value={value}>
      <Theme
        appearance={isLight ? 'light' : 'dark'}
        accentColor='jade'
        radius='large'
      >
        <div className={isLight ? 'light' : undefined}>{children}</div>
      </Theme>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
