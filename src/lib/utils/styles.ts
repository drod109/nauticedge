import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button Variants
export const buttonVariants = {
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  },
  variants: {
    primary: 'relative overflow-hidden text-white before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 before:to-blue-400 hover:before:from-blue-400 hover:before:to-blue-600',
    secondary: 'bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-600',
    outline: 'border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-900 dark:hover:text-white',
    danger: 'relative overflow-hidden text-white before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-600 before:to-red-400 hover:before:from-red-400 hover:before:to-red-600'
  }
};

// Input Variants
export const inputVariants = {
  base: 'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  },
  variants: {
    default: 'border-gray-300 dark:border-dark-600',
    error: 'border-error-300 dark:border-error-700 focus:ring-error-500',
    success: 'border-success-300 dark:border-success-700 focus:ring-success-500'
  }
};

// Card Variants
export const cardVariants = {
  base: 'rounded-xl border transition-all duration-300',
  variants: {
    default: 'bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border-gray-200/50 dark:border-dark-700/50',
    elevated: 'bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border-gray-200/50 dark:border-dark-700/50 shadow-sm hover:shadow-xl',
    outline: 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'
  }
};

// Typography Variants
export const typographyVariants = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  p: 'text-base text-gray-600 dark:text-gray-400',
  small: 'text-sm text-gray-500 dark:text-gray-400'
};