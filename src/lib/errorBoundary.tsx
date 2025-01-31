import React, { Component, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';
import { logger } from './logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', {
      error: error.message,
      name: error.name,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      type: error instanceof TypeError ? 'TypeError' : 'Error'
    });
    
    // Handle module loading errors specifically
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      logger.error('Module loading failed', {
        error: error.message,
        stack: error.stack
      });
      
      // Attempt to recover by clearing module cache and reloading
      if (window.location.search.includes('retry=true')) {
        // If already retrying, show error UI
        return;
      }
      
      // Add retry parameter and reload
      const url = new URL(window.location.href);
      url.searchParams.set('retry', 'true');
      window.location.href = url.toString();
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6 max-w-lg w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Something went wrong</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}