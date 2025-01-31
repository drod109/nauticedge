import React from 'react';

const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
    <div className="relative">
      <div className="h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-dark-800/90 animate-pulse"></div>
    </div>
  </div>
);

export default PageLoader;