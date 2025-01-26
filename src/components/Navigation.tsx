import React from 'react';
import { Menu, X, Ship, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const navItems = [
  { label: 'Features', href: '/#features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/#pricing' },
  {
    label: 'Resources',
    children: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Blog', href: '/blog' },
    ]
  }
];

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  return (
    <nav className="fixed w-full bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm z-50 border-b border-gray-200/50 dark:border-dark-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a 
            href={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center group"
          >
            <Ship className="h-8 w-8 text-blue-600 dark:text-blue-500 group-hover:rotate-[-10deg] transition-transform duration-300" />
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white group-hover:animate-gradient">NauticEdge</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {item.label}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      openDropdown === item.label ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200/50 dark:border-dark-700/50 backdrop-blur-sm py-2 animate-fade-in">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:left-0 after:-bottom-1 after:rounded-full after:origin-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
                >
                  {item.label}
                </a>
              )
            ))}
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                Login
              </a>
              <a
                href="/signup"
                className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition-all duration-300 ease-out rounded-lg group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                Sign Up
                </span>
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300"
                  >
                    {item.label}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      openDropdown === item.label ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {item.label}
                </a>
              )
            ))}
            <div className="mt-4 space-y-2">
              <a
                href="/login"
                className="block w-full px-3 py-2 text-center border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-dark-800 transition-all duration-300"
              >
                Login
              </a>
              <a
                href="/signup"
                className="block w-full px-3 py-2 text-center relative overflow-hidden font-medium text-white transition-all duration-300 ease-out rounded-lg group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                Sign Up
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;