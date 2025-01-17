import React from 'react';
import { Smartphone, Shield, Zap, BarChart3, Cloud, Users } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile Surveys',
    description: 'Conduct surveys on-the-go with our mobile-first platform. Capture photos, videos, and data offline.'
  },
  {
    icon: Shield,
    title: 'Secure Reports',
    description: 'Bank-grade encryption for all your survey data and reports. Compliant with maritime industry standards.'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get instant notifications and updates on survey progress. Track changes in real-time.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Powerful analytics tools to track trends, generate insights, and make data-driven decisions.'
  },
  {
    icon: Cloud,
    title: 'Cloud Storage',
    description: 'Unlimited cloud storage for all your survey data, photos, and documents. Access anywhere.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamlessly collaborate with team members, clients, and stakeholders in real-time.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Surveyors
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to conduct professional marine surveys efficiently and effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;