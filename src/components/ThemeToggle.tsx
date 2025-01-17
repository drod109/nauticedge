import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme, setTheme } from '../lib/theme';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
      aria-label="Toggle theme"
    >
      {currentTheme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;