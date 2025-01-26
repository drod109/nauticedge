import React from 'react';
import { Cookie, Shield, Settings, Clock, ArrowUpRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Cookies = () => {
  const lastUpdated = 'January 23, 2024';

  const sections = [
    {
      icon: Cookie,
      title: 'What Are Cookies',
      content: [
        'Cookies are small text files stored on your device',
        'They help us remember your preferences and settings',
        'Some cookies are essential for site functionality',
        'Others help us improve your experience',
        'You can control cookie settings in your browser'
      ]
    },
    {
      icon: Shield,
      title: 'How We Use Cookies',
      content: [
        'Authentication and security purposes',
        'Remembering your preferences and settings',
        'Analyzing site traffic and user behavior',
        'Improving our services and user experience',
        'Marketing and advertising optimization'
      ]
    },
    {
      icon: Settings,
      title: 'Types of Cookies We Use',
      content: [
        'Essential cookies for site functionality',
        'Performance cookies for analytics',
        'Functionality cookies for user preferences',
        'Targeting cookies for marketing',
        'Third-party cookies for additional services'
      ]
    },
    {
      icon: Clock,
      title: 'Cookie Duration',
      content: [
        'Session cookies - temporary, deleted when browser closes',
        'Persistent cookies - remain until expiration or deletion',
        'Third-party cookies - controlled by other services',
        'Authentication cookies - expire after logout',
        'Preference cookies - typically last one year'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Understanding how and why we use cookies to improve your experience.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12">
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
              <ul className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start text-gray-600 dark:text-gray-400">
                    <span className="h-1.5 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cookie Settings Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Your Cookie Preferences</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You can adjust your cookie preferences at any time through your browser settings.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group"
          >
            Contact Us
            <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cookies;