import { theme } from '../theme';

// Combine multiple class names and remove duplicates
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Convert px to rem
export function pxToRem(px: number) {
  return `${px / 16}rem`;
}

// Get responsive value based on breakpoint
export function getResponsiveValue<T>(
  values: { base: T } & { [key: string]: T },
  breakpoint: string | null
): T {
  if (!breakpoint) return values.base;
  return values[breakpoint] || values.base;
}

// Get theme color with opacity
export function getColorWithOpacity(color: string, opacity: number) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Generate box shadow with color
export function generateBoxShadow(
  color: string,
  { x = 0, y = 4, blur = 6, spread = -1 } = {}
) {
  return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}