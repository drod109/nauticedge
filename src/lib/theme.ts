export type Theme = 'light' | 'dark';

// Get theme from localStorage or system preference
export const getInitialTheme = (): Theme => {
  // Check if theme was previously set
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) {
    return savedTheme;
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

// Update theme in localStorage and document
export const setTheme = (theme: Theme) => {
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Initialize theme
export const initializeTheme = () => {
  const theme = getInitialTheme();
  setTheme(theme);
};