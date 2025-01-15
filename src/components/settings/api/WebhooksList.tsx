import React, { useState, useEffect } from 'react';
import { Link2, Trash2, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Webhook {
  id: string;
  url: string;
  description: string;
  events: string[];
  is_active: boolean;
  created_at: string;
  last_triggered_at: string | null;
}

const WebhooksList = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewWebhookModal, setShowNewWebhookModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
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

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async () => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .insert([{
          url: newWebhook.url,
          description: newWebhook.description,
          events: newWebhook.events,
          is_active: true
        }]);

      if (error) throw error;

      await fetchWebhooks();
      setShowNewWebhookModal(false);
      setNewWebhook({ url: '', description: '', events: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create webhook');
    }
  };

  const deleteWebhook = async (webhookId: string) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', webhookId);

      if (error) throw error;
      await fetchWebhooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete webhook');
    }
  };

  const toggleWebhookStatus = async (webhookId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('webhooks')
        .update({ is_active: !currentStatus })
        .eq('id', webhookId);

      if (error) throw error;
      await fetchWebhooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update webhook status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Webhooks</h2>
          <p className="text-sm text-gray-500">Receive real-time updates for specific events</p>
        </div>
        <button
          onClick={() => setShowNewWebhookModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Webhook
        </button>
      </div>

      {/* Webhooks List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Link2 className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">{webhook.url}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleWebhookStatus(webhook.id, webhook.is_active)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    webhook.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {webhook.is_active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => deleteWebhook(webhook.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{webhook.description}</p>
            <div className="flex flex-wrap gap-2">
              {webhook.events.map((event) => (
                <span
                  key={event}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create New Webhook Modal */}
      {showNewWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Webhook</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newWebhook.description}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Production webhook for survey updates"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Events to Subscribe
                  </label>
                  <div className="space-y-2">
                    {availableEvents.map((event) => (
                      <label key={event} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event)}
                          onChange={(e) => {
                            setNewWebhook(prev => ({
                              ...prev,
                              events: e.target.checked
                                ? [...prev.events, event]
                                : prev.events.filter(e => e !== event)
                            }));
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowNewWebhookModal(false);
                    setNewWebhook({ url: '', description: '', events: [] });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={createWebhook}
                  disabled={!newWebhook.url || !newWebhook.events.length}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhooksList;