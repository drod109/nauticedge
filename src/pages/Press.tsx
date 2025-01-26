import React from 'react';
import { Newspaper, Download, ArrowUpRight, Mail, Phone, Globe, Award, TrendingUp } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Press = () => {
  const pressReleases = [
    {
      title: 'NauticEdge Raises $10M Series A to Transform Marine Surveys',
      date: 'January 23, 2024',
      excerpt: 'Funding will accelerate product development and international expansion of our digital marine survey platform.',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800&h=400'
    },
    {
      title: 'New AI-Powered Features Launch for Maritime Surveyors',
      date: 'January 15, 2024',
      excerpt: 'Revolutionary machine learning algorithms enhance survey accuracy and efficiency.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=400'
    },
    {
      title: 'NauticEdge Expands Operations to European Market',
      date: 'January 8, 2024',
      excerpt: 'New office in Rotterdam marks significant milestone in global expansion strategy.',
      image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=800&h=400'
    }
  ];

  const awards = [
    {
      title: 'Maritime Innovation Award 2023',
      organization: 'International Maritime Organization',
      date: 'December 2023'
    },
    {
      title: 'Best Maritime Technology Solution',
      organization: 'Marine Technology Awards',
      date: 'November 2023'
    },
    {
      title: 'Sustainability Excellence Award',
      organization: 'Green Maritime Initiative',
      date: 'October 2023'
    }
  ];

  const mediaResources = [
    {
      title: 'Press Kit',
      description: 'Logos, brand guidelines, and executive photos',
      icon: Download
    },
    {
      title: 'Company Fact Sheet',
      description: 'Key statistics and company information',
      icon: TrendingUp
    },
    {
      title: 'Media Coverage',
      description: 'Recent articles and features',
      icon: Newspaper
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Press &amp; Media
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Latest news, press releases, and media resources from NauticEdge.
            </p>
          </div>
        </div>
      </div>

      {/* Press Releases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Latest Press Releases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pressReleases.map((release, index) => (
            <article
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={release.image}
                  alt={release.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <time className="text-sm text-gray-500 dark:text-gray-400">{release.date}</time>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {release.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {release.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 group/link"
                >
                  Read More
                  <ArrowUpRight className="ml-1 h-4 w-4 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Awards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Awards &amp; Recognition</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((award, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {award.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{award.organization}</p>
              <time className="text-sm text-gray-500 dark:text-gray-400">{award.date}</time>
            </div>
          ))}
        </div>
      </div>

      {/* Media Resources */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">Media Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mediaResources.map((resource, index) => (
            <a
              key={index}
              href="#"
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up flex items-start"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mr-4">
                <resource.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{resource.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Press Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Press Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Email</h3>
                <a href="mailto:press@nauticedge.io" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  press@nauticedge.io
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-blue-600 dark:text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Phone</h3>
                <a href="tel:+1-647-555-0123" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  +1 (647) 555-0123
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Location</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Toronto, Canada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Press;