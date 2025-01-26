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
    <section id="features" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] -top-64 -right-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute w-[500px] h-[500px] -bottom-64 -left-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-4">
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
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-500 transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10 blur transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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