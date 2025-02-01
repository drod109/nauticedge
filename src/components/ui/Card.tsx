import React from 'react';
import { cn } from '../../lib/utils/styles';
import { cardVariants } from '../../lib/utils/styles';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline';
  hoverable?: boolean;
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  hoverable = false,
  clickable = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        cardVariants.base,
        cardVariants.variants[variant],
        hoverable && 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
        clickable && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});