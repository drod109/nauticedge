import React from 'react';
import { Scale, Shield, FileCheck, AlertCircle, ArrowUpRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Terms = () => {
  const lastUpdated = 'January 23, 2024';

  const sections = [
    {
      icon: Scale,
      title: 'Terms of Use',
      content: [
        'By accessing NauticEdge, you agree to be bound by these Terms of Service',
        'You must be at least 18 years old to use our services',
        'You are responsible for maintaining the confidentiality of your account',
        'You agree to provide accurate and complete information when creating an account',
        'You must not use our services for any illegal or unauthorized purpose'
      ]
    },
    {
      icon: Shield,
      title: 'User Responsibilities',
      content: [
        'Maintain accurate and up-to-date survey records',
        'Protect your account credentials and notify us of any unauthorized use',
        'Comply with all applicable laws and regulations',
        'Respect the intellectual property rights of others',
        'Use the platform in a professional and ethical manner'
      ]
    },
    {
      icon: FileCheck,
      title: 'Service Terms',
      content: [
        'We reserve the right to modify or terminate services for any reason',
        'Service availability and features may vary by subscription plan',
        'We may update these terms at any time with reasonable notice',
        'Subscription fees are billed in advance on a monthly basis',
        'Refunds are handled according to our refund policy'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Limitations and Liability',
      content: [
        'Services are provided "as is" without any warranties',
        'We are not liable for any indirect or consequential damages',
        'Our liability is limited to the amount paid for services',
        'We do not guarantee the accuracy of third-party information',
        'Force majeure events may affect service availability'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Please read these terms carefully before using our services.
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions About Our Terms?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            If you have any questions about our terms of service, we're here to help.
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

export default Terms;