import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart,
  CalendarDays,
  Receipt,
  LogOut,
  Ship,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

const SIDEBAR_STATE_KEY = 'nauticedge_sidebar_collapsed';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Surveys', href: '/dashboard/surveys' },
  { icon: Receipt, label: 'Invoices', href: '/invoices' },
  { icon: CalendarDays, label: 'Schedule', href: '/schedule' },
  { icon: Users, label: 'Clients', href: '/dashboard/clients' },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle initial mobile check and window resize
    const handleResize = () => {
      if (window.innerWidth < 768 && !isCollapsed) {
        setIsCollapsed(true);
        setIsMobileMenuOpen(false);
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

  useEffect(() => {
    // Handle clicks outside sidebar to close mobile menu
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(newState));
  };

  return (<>
    {/* Mobile Menu Button */}
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="fixed top-2 left-2 p-2 rounded-lg bg-white dark:bg-dark-800 shadow-lg border border-gray-200 dark:border-dark-700 md:hidden z-50 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
    >
      <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
    </button>

    {/* Sidebar */}
    <div
      ref={sidebarRef}
      className={`fixed md:sticky top-0 h-[100dvh] glass-effect border-r border-gray-200 dark:border-dark-700 flex flex-col transition-all duration-300 z-40
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className={`p-4 sm:p-6 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
        <a 
          href="/dashboard"
          className="flex items-center hover:opacity-80 transition-opacity text-gray-900 dark:text-white"
        >
          <Ship className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-500 shrink-0" />
          {!isCollapsed && <span className="ml-2 text-xl font-bold">NauticEdge</span>}
        </a>
      </div>
      
      <button 
        onClick={toggleCollapse}
        className="absolute -right-3 top-16 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-full p-1.5 hover:bg-gray-50 dark:hover:bg-dark-700 z-30 hidden md:block"
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
            <li key={item.label} className="w-full">
              <a
                href={item.href}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} w-full px-3 sm:px-4 py-3 sm:py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-dark-700/80 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-200 group`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-dark-700 mt-auto">
        <button className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2.5 w-full rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700 hover:text-red-600 dark:hover:text-red-500 transition-colors`}>
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>

    {/* Overlay for mobile */}
    {isMobileMenuOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )}
  </>
  );
};

export default Sidebar;