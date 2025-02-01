import React from 'react';
import { theme } from '../../theme';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'light';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const variants = {
    primary: 'border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500',
    secondary: 'border-gray-200 dark:border-gray-800 border-t-gray-600 dark:border-t-gray-500',
    light: 'border-white/30 border-t-white'
  };

  return (
    <div
      className={`
        ${sizes[size]}
        border-4
        rounded-full
        animate-spin
        ${variants[variant]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};