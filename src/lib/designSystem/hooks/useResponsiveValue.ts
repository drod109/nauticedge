import { useBreakpoint } from './useBreakpoint';

type ResponsiveValue<T> = {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

export function useResponsiveValue<T>(values: ResponsiveValue<T>): T {
  const breakpoint = useBreakpoint();

  if (!breakpoint) return values.base;

  const breakpoints: (keyof ResponsiveValue<T>)[] = ['2xl', 'xl', 'lg', 'md', 'sm'];
  
  // Find the first matching breakpoint value, falling back to larger breakpoints
  for (const bp of breakpoints) {
    if (values[bp] !== undefined && breakpoint === bp) {
      return values[bp] as T;
    }
  }

  return values.base;
}