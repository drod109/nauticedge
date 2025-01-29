import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { logger } from '../../lib/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.user) {
          if (error?.message.includes('refresh_token_not_found')) {
            // Clear any invalid auth state
            await supabase.auth.signOut();
          }
          // Redirect to login with return path
          if (!window.location.pathname.includes('/login')) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          }
          return;
        }

        // Check if user has completed registration
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', session?.user.id)
          .single();

        // Redirect to registration if needed
        if (!profile?.company_name && window.location.pathname !== '/registration') {
          window.location.href = '/registration';
          return;
        }
        
        setLoading(false);
      } catch (error) {
        logger.error('Auth error:', error);
        // Clear auth state on error
        await supabase.auth.signOut();
        // Redirect if not on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;