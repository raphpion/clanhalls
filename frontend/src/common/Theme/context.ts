import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  actualTheme: Theme;
  setTheme: (theme: Theme) => void;
};

export const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const initialState: ThemeProviderState = {
  theme: 'system',
  actualTheme: getSystemTheme(),
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
