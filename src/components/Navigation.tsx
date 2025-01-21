import React from 'react';
import { Menu, X, Ship } from 'lucide-react';
import { supabase } from '../lib/supabase';


const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  return (
    <nav className="fixed w-full bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm z-50 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a 
            href={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Ship className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">NauticEdge</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
            <a href="#solutions" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Solutions</a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a>
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                Login
              </a>
              <a
                href="/signup"
                className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Sign Up
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
            <a href="#features" className="block px-3 py-2 text-gray-600">Features</a>
            <a href="#solutions" className="block px-3 py-2 text-gray-600">Solutions</a>
            <a href="#pricing" className="block px-3 py-2 text-gray-600">Pricing</a>
            <div className="mt-4 space-y-2">
              <a
                href="/login"
                className="block w-full px-3 py-2 text-center border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 rounded-full hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Login
              </a>
              <a
                href="/signup"
                className="block w-full px-3 py-2 text-center bg-blue-600 dark:bg-blue-500 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;