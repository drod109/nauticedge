import React from 'react';
import { Laptop, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ActiveSessionsList from '../components/settings/security/ActiveSessionsList';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Sessions = () => {
  const [theme, setCurrentTheme] = React.useState<Theme>(getInitialTheme());

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <div className="mb-8">
                <nav className="flex items-center space-x-3 text-sm">
                  <a 
                    href="/settings"
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Settings
                  </a>
                  <span className="text-gray-300 dark:text-gray-600">/</span>
                  <span className="text-gray-900 dark:text-white font-medium">Active Sessions</span>
                </nav>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-dark-700/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-dark-700">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-xl flex items-center justify-center">
                      <Laptop className="h-6 w-6 text-green-600 dark:text-green-500" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-green-600 to-gray-900 dark:from-white dark:via-green-400 dark:to-white">Active Sessions</h1>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your active sessions across different devices
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <ActiveSessionsList />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Sessions;