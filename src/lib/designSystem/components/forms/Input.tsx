import React from 'react';
import { DivideIcon } from 'lucide-react';
import { theme } from '../../theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: typeof DivideIcon;
  error?: string;
  label?: string;
  helpText?: string;
  loading?: boolean;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon, error, label, helpText, loading, rightElement, className = '', ...props }, ref) => {
    const baseClasses = `
      w-full px-4 py-2.5 
      border rounded-lg
      bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm 
      text-gray-900 dark:text-white 
      placeholder-gray-400 dark:placeholder-gray-500
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
      transition-all duration-300
      hover:bg-white dark:hover:bg-dark-800
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const iconClasses = Icon ? 'pl-10' : '';
    const errorClasses = error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-dark-600';
    const loadingClasses = loading ? 'pr-10' : '';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Icon className="h-5 w-5" />
            </div>
          )}

          <input
            ref={ref}
            className={`${baseClasses} ${iconClasses} ${errorClasses} ${loadingClasses} ${className}`}
            {...props}
          />

          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-5 w-5 border-2 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {helpText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helpText}</p>
        )}
        
        {rightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);