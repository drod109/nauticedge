import React from 'react';
import { Shield, Lock, Eye, FileText, ArrowUpRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Privacy = () => {
  const lastUpdated = 'January 23, 2024';

  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: [
        'Personal Information: Name, email address, phone number, and company details provided during registration',
        'Survey Data: Information collected through our marine survey platform',
        'Usage Data: Information about how you interact with our services',
        'Device Information: Browser type, IP address, and device identifiers',
        'Location Data: General location information based on IP address or user-provided location'
      ]
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our services',
        'To notify you about changes to our services',
        'To provide customer support',
        'To gather analysis or valuable information to improve our services',
        'To monitor the usage of our services',
        'To detect, prevent and address technical issues'
      ]
    },
    {
      icon: Eye,
      title: 'Information Sharing and Disclosure',
      content: [
        'We do not sell your personal information to third parties',
        'We may share your information with service providers who assist in operating our platform',
        'We may disclose information if required by law or to protect our rights',
        'Business transfers may involve transferring your information',
        'Third-party service providers have access only to perform specific tasks'
      ]
    },
    {
      icon: FileText,
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures',
        'All data is encrypted in transit and at rest',
        'Regular security audits and assessments',
        'Access to personal data is strictly controlled',
        'Continuous monitoring for potential security threats'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
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

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions About Our Privacy Policy?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            If you have any questions about our privacy practices, please don't hesitate to contact us.
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

export default Privacy;