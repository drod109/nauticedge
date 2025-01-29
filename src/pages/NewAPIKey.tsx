import React, { useState } from 'react';
import { Key, ArrowLeft, Copy, Check } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import { supabase } from '../lib/supabase';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const NewAPIKey = () => {
  const [theme, setCurrentTheme] = React.useState<Theme>(getInitialTheme());
  const [keyName, setKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const createAPIKey = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate key name
      if (!keyName.trim()) {
        throw new Error('Key name is required');
      }

      const { data, error } = await supabase
        .rpc('create_api_key', {
          p_name: keyName
        });

      if (error) {
        console.error('API key creation error:', error);
        throw new Error(error.message);
      }

      if (data?.key) {
        setNewKey(data.key);
      } else {
        throw new Error('No API key returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-full mx-auto w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <div className="mb-8">
                <nav className="flex items-center space-x-3 text-sm">
                  <a 
                    href="/settings/api-keys"
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to API Keys
                  </a>
                  <span className="text-gray-300 dark:text-gray-600">/</span>
                  <span className="text-gray-900 dark:text-white font-medium">Create New API Key</span>
                </nav>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-dark-700/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-dark-700">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-lg flex items-center justify-center">
                      <Key className="h-6 w-6 text-indigo-600 dark:text-indigo-500" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-600 to-gray-900 dark:from-white dark:via-indigo-400 dark:to-white">Create New API Key</h1>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Generate a new API key for accessing the NauticEdge API
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="max-w-lg space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Key Name
                      </label>
                      <input
                        type="text"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Production API Key"
                        required
                      />
                    </div>

                    {newKey && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          API Key
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            value={newKey}
                            readOnly
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-l-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => copyToClipboard(newKey)}
                            className="px-4 py-2.5 border border-l-0 border-gray-300 dark:border-dark-600 rounded-r-lg hover:bg-gray-50 dark:hover:bg-dark-700 bg-white dark:bg-dark-800"
                          >
                            {copied ? (
                              <Check className="h-5 w-5 text-green-600 dark:text-green-500" />
                            ) : (
                              <Copy className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            )}
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          Make sure to copy your API key now. You won't be able to see it again!
                        </p>
                      </div>
                    )}

                    <div className="pt-6">
                      {!newKey ? (
                        <button
                          onClick={createAPIKey}
                          disabled={!keyName || loading}
                          className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'Create API Key'
                          )}
                        </button>
                      ) : (
                        <a
                          href="/settings/api-keys"
                          className="inline-block px-6 py-3 text-sm font-medium text-white bg-green-600 dark:bg-green-500 rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                        >
                          Done
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default NewAPIKey;