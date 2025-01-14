import React from 'react';
import { Menu, X, Ship } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Ship className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">NauticEdge</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
            <a href="#solutions" className="text-gray-600 hover:text-blue-600">Solutions</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-900 hover:text-blue-600">
                Login
              </a>
              <a
                href="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
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
                className="block w-full px-3 py-2 text-center text-gray-900 hover:text-blue-600"
              >
                Login
              </a>
              <a
                href="/signup"
                className="block w-full px-3 py-2 text-center bg-blue-600 text-white rounded-full hover:bg-blue-700"
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