import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { notificationService } from '../lib/notifications';

interface AutoLogoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onLogout?: () => void;
}

export function useAutoLogout({
  timeoutMinutes = 15,
  warningMinutes = 1,
  onLogout
}: AutoLogoutOptions = {}) {
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningTimeoutRef = useRef<NodeJS.Timeout>();
  const warningDisplayed = useRef(false);

  const handleLogout = async () => {
    try {
      // Log the auto-logout event
      logger.info('Auto-logout triggered due to inactivity');

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Call optional onLogout callback
      onLogout?.();

      // Show notification
      notificationService.info({
        title: 'Session Expired',
        message: 'You have been logged out due to inactivity'
      });

      // Redirect to login using window.location
      window.location.href = '/login';
    } catch (error) {
      logger.error('Error during auto-logout:', error);
    }
  };

  const resetTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Hide warning if it was shown
    if (warningDisplayed.current) {
      setShowWarning(false);
      warningDisplayed.current = false;
    }

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      warningDisplayed.current = true;

      // Set final timeout after warning
      timeoutRef.current = setTimeout(handleLogout, warningMinutes * 60 * 1000);
    }, (timeoutMinutes - warningMinutes) * 60 * 1000);
  };

  useEffect(() => {
    const events = [
      'mousedown',
      'keydown',
      'touchstart',
      'mousemove',
      'scroll',
      'wheel'
    ];

    // Throttled event handler
    let lastActivity = Date.now();
    const THROTTLE_MS = 1000; // Only process events every second

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivity > THROTTLE_MS) {
        lastActivity = now;
        resetTimers();
      }
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timer setup
    resetTimers();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [timeoutMinutes, warningMinutes, onLogout]);

  return { showWarning, setShowWarning };
}