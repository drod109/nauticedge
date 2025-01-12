import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80"
                alt="John Doe"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">John Doe</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50">
              <a 
                href="/profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User className="h-4 w-4 mr-3 text-gray-500" />
                My Profile
              </a>
              <a 
                href="/settings" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-500" />
                Account Settings
              </a>
              <div className="h-px bg-gray-200 my-1"></div>
              <button 
                onClick={() => {
                  // Handle logout
                  window.location.href = '/login';
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
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