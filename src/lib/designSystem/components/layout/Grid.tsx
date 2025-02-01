import React from 'react';
import { cn } from '../../utils/styles';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number | { base: number; sm?: number; md?: number; lg?: number; xl?: number; '2xl'?: number };
  gap?: number;
  items?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export const Grid: React.FC<GridProps> = ({
  cols = 1,
  gap = 4,
  items = 'stretch',
  justify = 'start',
  className,
  children,
  ...props
}) => {
  const getColsClass = () => {
    if (typeof cols === 'number') {
      return `grid-cols-${cols}`;
    }

    return [
      `grid-cols-${cols.base}`,
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`,
      cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`
    ].filter(Boolean).join(' ');
  };

  return (
    <div
      className={cn(
        'grid',
        getColsClass(),
        `gap-${gap}`,
        `items-${items}`,
        `justify-${justify}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};