import React from 'react';
import { BookOpen, Code, Terminal, Puzzle, Compass, Zap, ArrowUpRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Documentation = () => {
  const sections = [
    {
      icon: BookOpen,
      title: 'Getting Started',
      content: [
        {
          title: 'Quick Start Guide',
          description: 'Get up and running with NauticEdge in minutes',
          href: '#quick-start'
        },
        {
          title: 'Installation',
          description: 'Step-by-step installation instructions',
          href: '#installation'
        },
        {
          title: 'Basic Concepts',
          description: 'Learn the fundamental concepts',
          href: '#concepts'
        }
      ]
    },
    {
      icon: Code,
      title: 'API Reference',
      content: [
        {
          title: 'REST API',
          description: 'Complete REST API documentation',
          href: '#api-rest'
        },
        {
          title: 'WebSocket API',
          description: 'Real-time WebSocket API reference',
          href: '#api-websocket'
        },
        {
          title: 'Authentication',
          description: 'API authentication methods',
          href: '#api-auth'
        }
      ]
    },
    {
      icon: Terminal,
      title: 'SDK Documentation',
      content: [
        {
          title: 'JavaScript SDK',
          description: 'JavaScript/TypeScript SDK guide',
          href: '#sdk-js'
        },
        {
          title: 'Python SDK',
          description: 'Python SDK documentation',
          href: '#sdk-python'
        },
        {
          title: 'Mobile SDKs',
          description: 'iOS and Android SDK guides',
          href: '#sdk-mobile'
        }
      ]
    },
    {
      icon: Puzzle,
      title: 'Integrations',
      content: [
        {
          title: 'Webhooks',
          description: 'Setting up and using webhooks',
          href: '#webhooks'
        },
        {
          title: 'Third-party Apps',
          description: 'Integrating with other services',
          href: '#integrations'
        },
        {
          title: 'Custom Solutions',
          description: 'Building custom integrations',
          href: '#custom'
        }
      ]
    }
  ];

  const guides = [
    {
      title: 'Survey Management',
      description: 'Learn how to create and manage digital marine surveys',
      icon: Compass
    },
    {
      title: 'Real-time Updates',
      description: 'Implement real-time features in your application',
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Documentation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to build with NauticEdge. From getting started guides to detailed API references.
            </p>
          </div>
        </div>
      </div>

      {/* Documentation Sections */}
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

        {/* Popular Guides */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Popular Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <a
                key={index}
                href="#"
                className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 flex items-center"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <guide.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {guide.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group"
          >
            Contact Support
            <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Documentation;