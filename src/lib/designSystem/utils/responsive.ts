import { theme } from '../theme';

type Breakpoint = keyof typeof theme.breakpoints;

// Convert breakpoint to media query
export function getBreakpointQuery(breakpoint: Breakpoint) {
  return `@media (min-width: ${theme.breakpoints[breakpoint]})`;
}

// Get value for current breakpoint
export function getResponsiveValue<T>(
  values: { base: T } & { [key in Breakpoint]?: T },
  currentBreakpoint: Breakpoint | null
): T {
  if (!currentBreakpoint) return values.base;

  const breakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm'];
  
  // Find the first matching breakpoint value, falling back to larger breakpoints
  for (const bp of breakpoints) {
    if (values[bp] !== undefined && currentBreakpoint === bp) {
      return values[bp] as T;
    }
  }

  return values.base;
}

// Check if viewport matches breakpoint
export function matchesBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(min-width: ${theme.breakpoints[breakpoint]})`).matches;
}