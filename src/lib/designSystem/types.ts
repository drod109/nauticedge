import { DivideIcon as LucideIcon } from 'lucide-react';

// Common Props
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// Icon Props
export interface IconProps extends BaseProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// Animation Props
export interface AnimationProps {
  animate?: boolean;
  duration?: number;
  delay?: number;
  timing?: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorScheme = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

export type Spacing = {
  [key: string]: string;
};

export type Typography = {
  fonts: {
    [key: string]: string[];
  };
  sizes: {
    [key: string]: [string, { lineHeight: string }];
  };
  weights: {
    [key: string]: string;
  };
};