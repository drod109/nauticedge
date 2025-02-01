import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProfilePhoto from '../profile/ProfilePhoto.tsx';
import { cn } from '../../lib/utils/styles';
import { buttonVariants, inputVariants, cardVariants } from '../../lib/utils/styles';
import ThemeToggle from '../ThemeToggle';
import { Theme } from '../../lib/theme';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();

        setUserData({
          ...user,
          ...profile,
          photo_url: profile?.avatar_url || null,
          full_name: profile?.full_name || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Subscribe to realtime changes for user profile
    const setupSubscription = () => {
      if (!userId) return;

      subscriptionRef.current = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public', 
            table: 'profiles',
            filter: `id=eq.${userId}`
          },
          (payload) => {
            // Update local state immediately when profile changes
            setUserData(prev => ({
              ...prev,
              photo_url: payload.new.avatar_url || null,
              full_name: payload.new.full_name || ''
            }));
            fetchUserData();
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [userId]);
  const handleLogout = async () => {
    try {
      // Get current session
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        // Update user_sessions table
        // Update user_sessions table
        await supabase
          .from('user_sessions')
          .update({
            is_active: false,
            ended_at: new Date().toISOString()
          })
          .eq('session_id', session.access_token);
      }

      // Sign out from Supabase
      await supabase.auth.signOut();
      // Use window.location.origin to construct absolute URL
      window.location.href = `${window.location.origin}/login`;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-effect flex items-center justify-between container-padding">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className={cn(
              inputVariants.base,
              inputVariants.variants.default,
              'pl-10'
            )}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle currentTheme={theme} onThemeChange={onThemeChange} />
        <button className={cn(
          buttonVariants.base,
          buttonVariants.variants.ghost,
          'relative p-1.5 sm:p-2'
        )}>
          <Bell className="h-6 w-6 transition-colors" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-error-500 rounded-full animate-pulse"></span>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              buttonVariants.base,
              buttonVariants.variants.ghost,
              'flex items-center space-x-2 p-1.5 sm:p-2'
            )}
          >
            <ProfilePhoto
              userId={userData?.id}
              photoUrl={userData?.photo_url}
              fullName={userData?.full_name || ''}
              editable={false}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:block">
              {userData?.full_name || 'Loading...'}
            </span>
          </button>

          {isDropdownOpen && (
            <div className={cn(
              cardVariants.base,
              cardVariants.variants.elevated,
              'absolute right-0 mt-2 w-56 sm:w-48 py-1 z-50'
            )}>
              <a 
                href={`${window.location.origin}/profile`}
                className="flex items-center px-4 py-3 sm:py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <User className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                My Profile
              </a>
              <a 
                href={`${window.location.origin}/settings`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                Account Settings
              </a>
              <div className="h-px bg-gray-200/50 dark:bg-dark-700/50 my-1"></div>
              <button 
                onClick={handleLogout}
                className={cn(
                  buttonVariants.base,
                  'flex items-center w-full px-4 py-2 text-sm text-error-600 dark:text-error-500 hover:bg-gray-50 dark:hover:bg-dark-700'
                )}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;