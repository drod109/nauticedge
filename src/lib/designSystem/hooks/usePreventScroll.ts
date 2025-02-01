import { useEffect, useCallback } from 'react';

export const usePreventScroll = (isOpen: boolean) => {
  const lockScroll = useCallback(() => {
    // Store current scroll position
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const scrollPosition = window.scrollY;

    // Add styles to prevent scroll while maintaining position
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
  }, []);

  const unlockScroll = useCallback(() => {
    // Get scroll position from body top
    const scrollPosition = Math.abs(parseInt(document.body.style.top || '0'));
    
    // Remove styles
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  }, []);

  useEffect(() => {
    if (isOpen) {
      lockScroll();
    }
    
    return () => {
      if (isOpen) {
        unlockScroll();
      }
    };
  }, [isOpen, lockScroll, unlockScroll]);
};