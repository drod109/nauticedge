import React from 'react';
import { ShieldCheck, FileCheck, Scale, Award, ArrowUpRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Compliance = () => {
  const lastUpdated = 'January 23, 2024';

  const sections = [
    {
      icon: ShieldCheck,
      title: 'Industry Standards',
      content: [
        'ISO 27001 certified for information security management',
        'SOC 2 Type II compliant infrastructure and processes',
        'GDPR and CCPA compliant data handling',
        'Maritime industry regulatory compliance',
        'Regular compliance audits and certifications'
      ]
    },
    {
      icon: FileCheck,
      title: 'Data Compliance',
      content: [
        'Secure data storage and transmission protocols',
        'Compliant data retention and disposal policies',
        'Regular data protection impact assessments',
        'Transparent data processing practices',
        'Data privacy by design and default'
      ]
    },
    {
      icon: Scale,
      title: 'Regulatory Framework',
      content: [
        'Adherence to maritime safety regulations',
        'Compliance with international maritime laws',
        'Environmental protection standards',
        'Industry-specific certification requirements',
        'Regular regulatory updates and adaptations'
      ]
    },
    {
      icon: Award,
      title: 'Certifications',
      content: [
        'ISO 9001:2015 Quality Management System',
        'ISO 27001:2013 Information Security Management',
        'Maritime Authority Certifications',
        'Environmental Management Certifications',
        'Professional Industry Accreditations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative min-h-[400px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              Compliance & Certifications
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our commitment to maintaining the highest standards of compliance and security in the maritime industry.
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need More Information?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Contact us to learn more about our compliance standards and certifications.
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

export default Compliance;