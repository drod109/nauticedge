import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          // Redirect to login if no session exists
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          return;
        }

        // Check if user has completed registration
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', session?.user.id)
          .single();

        // If no company name is set and not already on registration page
        if (!profile?.company_name && window.location.pathname !== '/registration') {
          window.location.href = '/registration';
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        window.location.href = '/login';
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/login';
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