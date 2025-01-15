import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface APIKey {
  id: string;
  name: string;
  key_hash: string;
  created_at: string;
  last_used_at: string | null;
  scopes: string[];
}

const APIKeysList = () => {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKeys(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const createAPIKey = async () => {
    try {
      const { data, error } = await supabase
        .rpc('create_api_key', {
          p_name: newKeyName
        });

      if (error) throw error;

      setNewKey(data.key);
      await fetchAPIKeys();
      setShowNewKeyModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
    }
  };

  const deleteAPIKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
      await fetchAPIKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h2 className="text-lg font-medium text-gray-900">API Keys</h2>
          <p className="text-sm text-gray-500">Manage your API keys for accessing the NauticEdge API</p>
        </div>
        <button
          onClick={() => setShowNewKeyModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Create New Key
        </button>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {keys.map((key) => (
          <div key={key.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">{key.name}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Created on {new Date(key.created_at).toLocaleDateString()}
                {key.last_used_at && ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
              </div>
            </div>
            <button
              onClick={() => deleteAPIKey(key.id)}
              className="p-2 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Create New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New API Key</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Production API Key"
                  />
                </div>
                {newKey && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={newKey}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard(newKey)}
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50"
                      >
                        {copied ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-red-600">
                      Make sure to copy your API key now. You won't be able to see it again!
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowNewKeyModal(false);
                    setNewKey(null);
                    setNewKeyName('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Close
                </button>
                {!newKey && (
                  <button
                    onClick={createAPIKey}
                    disabled={!newKeyName}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Create
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeysList;