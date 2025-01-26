import React from 'react';
import { Code, Key, Lock, Zap, Webhook, Database, ArrowUpRight, Terminal, Copy } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const APIReference = () => {
  const sections = [
    {
      icon: Terminal,
      title: 'Getting Started',
      content: [
        {
          title: 'Authentication',
          description: 'Learn how to authenticate your API requests',
          href: '#authentication'
        },
        {
          title: 'Rate Limiting',
          description: 'Understanding API rate limits and quotas',
          href: '#rate-limits'
        },
        {
          title: 'Error Handling',
          description: 'How to handle API errors and status codes',
          href: '#errors'
        }
      ]
    },
    {
      icon: Database,
      title: 'Core Resources',
      content: [
        {
          title: 'Surveys',
          description: 'Create, read, update, and delete surveys',
          href: '#surveys'
        },
        {
          title: 'Reports',
          description: 'Generate and manage survey reports',
          href: '#reports'
        },
        {
          title: 'Clients',
          description: 'Manage client information and relationships',
          href: '#clients'
        }
      ]
    },
    {
      icon: Webhook,
      title: 'Webhooks',
      content: [
        {
          title: 'Event Types',
          description: 'Available webhook events and payloads',
          href: '#webhook-events'
        },
        {
          title: 'Security',
          description: 'Securing your webhook endpoints',
          href: '#webhook-security'
        },
        {
          title: 'Best Practices',
          description: 'Guidelines for reliable webhook handling',
          href: '#webhook-best-practices'
        }
      ]
    },
    {
      icon: Zap,
      title: 'Real-time APIs',
      content: [
        {
          title: 'WebSocket API',
          description: 'Real-time updates and notifications',
          href: '#websocket'
        },
        {
          title: 'Server-Sent Events',
          description: 'Stream updates to your application',
          href: '#sse'
        },
        {
          title: 'Presence',
          description: 'Track online users and activity',
          href: '#presence'
        }
      ]
    }
  ];

  const examples = [
    {
      title: 'Survey Creation',
      language: 'javascript',
      code: `const response = await fetch('https://api.nauticedge.io/v1/surveys', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Annual Hull Inspection',
    vesselName: 'Ocean Explorer',
    surveyType: 'annual',
    scheduledDate: '2024-02-01'
  })
});

const data = await response.json();`
    },
    {
      title: 'Real-time Updates',
      language: 'javascript',
      code: `const ws = new WebSocket('wss://api.nauticedge.io/v1/ws', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Received update:', update);
};

// Subscribe to survey updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'survey.updates'
}));`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              API Reference
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive documentation for the NauticEdge API. Build powerful integrations with our platform.
            </p>
          </div>
        </div>
      </div>

      {/* API Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div 
              key={section.title}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mr-4">
                  <section.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.href}
                    className="block p-4 rounded-lg border border-gray-200/50 dark:border-dark-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 group/item transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transform group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Code Examples */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Code Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                  <h3 className="text-sm font-medium text-white">{example.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{example.language}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(example.code)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign up for an API key and start building with NauticEdge today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group"
            >
              Get API Key
              <Key className="ml-2 h-5 w-5 transform group-hover:rotate-12 transition-transform" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors group"
            >
              Contact Sales
              <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default APIReference;