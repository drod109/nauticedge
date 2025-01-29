import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (error.message.includes('refresh_token_not_found')) {
            // Clear any invalid auth state
            await supabase.auth.signOut();
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
              navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            }
            return;
          }
          throw error;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        logger.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        logger.info('Auth token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        // Clear any stored auth data
        localStorage.removeItem('supabase.auth.token');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          navigate('/login');
        }
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      // Cleanup subscription
      subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    user,
    session,
    loading,
    signOut: async () => {
      try {
        await supabase.auth.signOut();
        navigate('/login');
      } catch (error) {
        logger.error('Error signing out:', error);
      }
    }
  };
}