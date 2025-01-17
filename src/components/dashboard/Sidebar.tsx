import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart,
  Calendar,
  LogOut,
  Ship,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SIDEBAR_STATE_KEY = 'nauticedge_sidebar_collapsed';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Surveys', href: '/dashboard/surveys' },
  { icon: Users, label: 'Clients', href: '/dashboard/clients' },
  { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
  { icon: BarChart, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get saved state or default to collapsed on mobile
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    return window.innerWidth < 768;
  });

  useEffect(() => {
    // Handle initial mobile check and window resize
    const handleResize = () => {
      if (window.innerWidth < 768 && !isCollapsed) {
        setIsCollapsed(true);
        localStorage.setItem(SIDEBAR_STATE_KEY, 'true');
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(newState));
  };

  return (
    <div 
      className={`fixed md:relative h-screen bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col transition-all duration-300 z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
        <a 
          href="/dashboard"
          className="flex items-center hover:opacity-80 transition-opacity text-gray-900 dark:text-white"
        >
          <Ship className="h-8 w-8 text-blue-600 dark:text-blue-500 shrink-0" />
          {!isCollapsed && <span className="ml-2 text-xl font-bold">NauticEdge</span>}
        </a>
      </div>
      
      <button 
        onClick={toggleCollapse}
        className="absolute -right-3 top-16 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-full p-1.5 hover:bg-gray-50 dark:hover:bg-dark-700 z-30"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )
        }
      </button>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-blue-600 dark:hover:text-blue-500 transition-colors`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2.5 w-full rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-red-600 dark:hover:text-red-500 transition-colors`}>
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;