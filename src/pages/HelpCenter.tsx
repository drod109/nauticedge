import React, { useState } from 'react';
import { Search, Book, MessageCircle, Zap, FileText, HelpCircle, ArrowUpRight, Mail, Phone } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      articles: [
        'Quick Start Guide',
        'Account Setup',
        'First Survey Guide',
        'Basic Navigation'
      ]
    },
    {
      icon: FileText,
      title: 'Survey Management',
      articles: [
        'Creating New Surveys',
        'Survey Templates',
        'Adding Photos & Documents',
        'Generating Reports'
      ]
    },
    {
      icon: Zap,
      title: 'Advanced Features',
      articles: [
        'Real-time Collaboration',
        'Custom Report Templates',
        'API Integration',
        'Data Export'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Support',
      articles: [
        'Contact Support',
        'Feature Requests',
        'Bug Reports',
        'FAQs'
      ]
    }
  ];

  const popularArticles = [
    {
      title: 'How to Create Your First Survey',
      views: '2.5k views',
      time: '5 min read'
    },
    {
      title: 'Setting Up Two-Factor Authentication',
      views: '1.8k views',
      time: '3 min read'
    },
    {
      title: 'Customizing Report Templates',
      views: '1.5k views',
      time: '7 min read'
    },
    {
      title: 'Managing Team Permissions',
      views: '1.2k views',
      time: '4 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              How can we help you?
            </h1>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mb-4">
                <category.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group/link"
                    >
                      {article}
                      <ArrowUpRight className="ml-1 h-4 w-4 opacity-0 group-hover/link:opacity-100 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Popular Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularArticles.map((article, index) => (
            <a
              key={index}
              href="#"
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 flex items-start"
            >
              <div className="h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg flex items-center justify-center mr-4">
                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{article.views}</span>
                  <span className="mx-2">•</span>
                  <span>{article.time}</span>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Still Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Email Support</h3>
                <a href="mailto:support@nauticedge.io" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  support@nauticedge.io
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-blue-600 dark:text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Phone Support</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Available Mon-Fri, 9AM-6PM EST
                </p>
                <a href="tel:+1-647-555-0123" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  +1 (647) 555-0123
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;