import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const TestConnection = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to get the current user session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border p-4 z-50">
      <div className="flex items-start space-x-3">
        {status === 'testing' && (
          <div className="flex-shrink-0 h-6 w-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
        {status === 'success' && (
          <div className="flex-shrink-0 h-6 w-6 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {status === 'error' && (
          <div className="flex-shrink-0 h-6 w-6 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">
            {status === 'testing' && 'Testing Supabase Connection...'}
            {status === 'success' && 'Successfully connected to Supabase!'}
            {status === 'error' && 'Failed to connect to Supabase'}
          </p>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default TestConnection;