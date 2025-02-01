import { useState, useEffect } from 'react';
import { theme } from '../theme';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

  useEffect(() => {
    const updateTheme = (theme: Theme) => {
      const isDark = theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', theme);
    };

    updateTheme(currentTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (currentTheme === 'system') {
        updateTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  return {
    theme: currentTheme,
    setTheme: setCurrentTheme,
    isDark: currentTheme === 'dark' || 
      (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    colors: theme.colors,
    spacing: theme.spacing,
    typography: theme.typography
  };
}