import { useState, useEffect } from 'react';
import { theme } from '../theme';

interface AnimationOptions {
  duration?: number;
  delay?: number;
  timing?: keyof typeof theme.animation.timings;
  onComplete?: () => void;
}

export function useAnimation(options: AnimationOptions = {}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const {
    duration = 300,
    delay = 0,
    timing = 'ease',
    onComplete
  } = options;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
        setHasCompleted(true);
        onComplete?.();
      }, duration + delay);
    };

    startAnimation();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration, delay, onComplete]);

  const getStyle = () => ({
    transition: `all ${duration}ms ${theme.animation.timings[timing]} ${delay}ms`
  });

  return {
    isAnimating,
    hasCompleted,
    style: getStyle(),
    reset: () => {
      setIsAnimating(false);
      setHasCompleted(false);
    }
  };
}