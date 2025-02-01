import React from 'react';
import { cn } from '../../utils/styles';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  hoverable?: boolean;
  clickable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  hoverable = false,
  clickable = false,
  className,
  children,
  ...props
}) => {
  const variants = {
    elevated: 'bg-white dark:bg-dark-800 shadow-sm',
    outlined: 'border border-gray-200 dark:border-dark-700',
    filled: 'bg-gray-50 dark:bg-dark-700'
  };

  return (
    <div
      className={cn(
        'rounded-xl',
        variants[variant],
        hoverable && 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
        clickable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};