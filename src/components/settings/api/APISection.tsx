import React, { useState } from 'react';
import APIKeysList from './APIKeysList';
import WebhooksList from './WebhooksList';

const APISection = () => {
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks'>('keys');

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('keys')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'keys'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`pb-4 text-sm font-medium ${
              activeTab === 'webhooks'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Webhooks
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'keys' ? <APIKeysList /> : <WebhooksList />}
    </div>
  );
};

export default APISection;