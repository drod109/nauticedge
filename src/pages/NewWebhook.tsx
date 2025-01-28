import React, { useState } from 'react';
import { Webhook, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import { supabase } from '../lib/supabase';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const NewWebhook = () => {
  const [theme, setCurrentTheme] = React.useState<Theme>(getInitialTheme());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webhook, setWebhook] = useState({
    url: '',
    description: '',
    events: [] as string[]
  });

  const availableEvents = [
    'survey.created',
    'survey.updated',
    'survey.completed',
    'report.generated',
    'client.created',
    'client.updated'
  ];

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  const createWebhook = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('webhooks')
        .insert([{
          url: webhook.url,
          description: webhook.description,
          events: webhook.events,
          is_active: true
        }]);

      if (error) throw error;

      // Redirect back to webhooks list
      window.location.href = '/settings/webhooks';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create webhook');
    } finally {
      setLoading(false);
    }
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
                    href="/settings/webhooks"
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Webhooks
                  </a>
                  <span className="text-gray-300 dark:text-gray-600">/</span>
                  <span className="text-gray-900 dark:text-white font-medium">Create New Webhook</span>
                </nav>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-dark-700/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-dark-700">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 rounded-lg flex items-center justify-center">
                      <Webhook className="h-6 w-6 text-pink-600 dark:text-pink-500" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 dark:from-white dark:via-pink-400 dark:to-white">Create New Webhook</h1>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Set up a new webhook endpoint for event notifications
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
                        Endpoint URL
                      </label>
                      <input
                        type="url"
                        value={webhook.url}
                        onChange={(e) => setWebhook(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://your-domain.com/webhook"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={webhook.description}
                        onChange={(e) => setWebhook(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Production webhook for survey updates"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Events to Subscribe
                      </label>
                      <div className="space-y-3">
                        {availableEvents.map((event) => (
                          <label key={event} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={webhook.events.includes(event)}
                              onChange={(e) => {
                                setWebhook(prev => ({
                                  ...prev,
                                  events: e.target.checked
                                    ? [...prev.events, event]
                                    : prev.events.filter(e => e !== event)
                                }));
                              }}
                              className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-dark-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{event}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={createWebhook}
                        disabled={!webhook.url || !webhook.events.length || loading}
                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Create Webhook'
                        )}
                      </button>
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

export default NewWebhook;