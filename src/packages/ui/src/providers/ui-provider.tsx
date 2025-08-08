import { ReactNode } from 'react';

import { ThemeProvider } from './theme-provider';

import '../index.css';

interface RepoUiProviderProps {
  children: ReactNode;
  defaultTheme?: 'dark' | 'light' | 'system';
  storageKey?: string;
}

export const RepoUiProvider = ({
  children,
  defaultTheme = 'dark',
  storageKey = 'theme',
}: RepoUiProviderProps) => {
  return (
    <ThemeProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </ThemeProvider>
  );
};
