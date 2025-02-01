import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { theme } from '../../theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const variants = {
      primary: `
        relative overflow-hidden
        text-white
        before:absolute before:inset-0
        before:bg-gradient-to-r before:from-blue-600 before:to-blue-400
        hover:before:from-blue-400 hover:before:to-blue-600
        dark:before:from-blue-500 dark:before:to-blue-300
        dark:hover:before:from-blue-300 dark:hover:before:to-blue-500
      `,
      secondary: `
        bg-gray-100 dark:bg-dark-700
        text-gray-900 dark:text-white
        hover:bg-gray-200 dark:hover:bg-dark-600
      `,
      outline: `
        border border-gray-300 dark:border-dark-600
        text-gray-700 dark:text-gray-300
        hover:bg-gray-50 dark:hover:bg-dark-700
        hover:text-gray-900 dark:hover:text-white
      `,
      ghost: `
        text-gray-600 dark:text-gray-400
        hover:bg-gray-100 dark:hover:bg-dark-700
        hover:text-gray-900 dark:hover:text-white
      `,
      danger: `
        relative overflow-hidden
        text-white
        before:absolute before:inset-0
        before:bg-gradient-to-r before:from-red-600 before:to-red-400
        hover:before:from-red-400 hover:before:to-red-600
        dark:before:from-red-500 dark:before:to-red-300
        dark:hover:before:from-red-300 dark:hover:before:to-red-500
      `
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const baseClasses = `
      relative
      inline-flex items-center justify-center
      font-medium
      rounded-lg
      transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseClasses}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        <span className="relative flex items-center justify-center space-x-2">
          {loading ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {Icon && iconPosition === 'left' && (
                <Icon className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
              )}
              {children}
              {Icon && iconPosition === 'right' && (
                <Icon className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
              )}
            </>
          )}
        </span>
      </button>
    );
  }
);