import { useState, useEffect } from 'react';
import { theme } from '../theme';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const getBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= parseInt(theme.breakpoints['2xl'])) return '2xl';
      if (width >= parseInt(theme.breakpoints.xl)) return 'xl';
      if (width >= parseInt(theme.breakpoints.lg)) return 'lg';
      if (width >= parseInt(theme.breakpoints.md)) return 'md';
      if (width >= parseInt(theme.breakpoints.sm)) return 'sm';
      return null;
    };

    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}