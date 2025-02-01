import React from 'react';
import { cn } from '../../lib/utils/styles';
import { buttonVariants } from '../../lib/utils/styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    className = '',
    children,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants.base,
          buttonVariants.sizes[size],
          buttonVariants.variants[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        <span className="relative flex items-center justify-center space-x-2">
          {loading ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {icon && iconPosition === 'left' && (
                <span className="mr-2">{icon}</span>
              )}
              {children}
              {icon && iconPosition === 'right' && (
                <span className="ml-2">{icon}</span>
              )}
            </>
          )}
        </span>
      </button>
    );
  }
);