import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProfilePhoto from '../profile/ProfilePhoto.tsx';
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

        const { data: metadata } = await supabase
          .from('users_metadata')
          .select('full_name, photo_url')
          .eq('user_id', user.id)
          .single();

        setUserData({
          ...user,
          ...metadata
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
    
    // Subscribe to realtime changes for user metadata
    const setupSubscription = () => {
      if (!userId) return;

      subscriptionRef.current = supabase
        .channel('user_metadata_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users_metadata',
            filter: `user_id=eq.${userId}` 
          },
          () => {
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
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between px-6 transition-colors">
      <div className="flex items-center flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle currentTheme={theme} onThemeChange={onThemeChange} />
        <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <ProfilePhoto
              userId={userData?.id}
              photoUrl={userData?.photo_url}
              fullName={userData?.full_name || ''}
              editable={false}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{userData?.full_name || 'Loading...'}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-dark-700 z-50">
              <a 
                href="/profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <User className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                My Profile
              </a>
              <a 
                href="/settings" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                Account Settings
              </a>
              <div className="h-px bg-gray-200 dark:bg-dark-700 my-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-gray-50 dark:hover:bg-dark-700"
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