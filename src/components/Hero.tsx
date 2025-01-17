import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-[700px] lg:h-[800px] bg-gradient-to-br from-blue-50 to-white dark:from-dark-900 dark:to-dark-950">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pt-20 md:pt-0">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Modern Marine Survey Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            Streamline your marine surveys with our comprehensive digital platform. 
            Built for surveyors, boat owners, and insurers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-dark-600 text-base font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 md:text-lg">
              Watch Demo
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">1000+</span>
              <span className="text-gray-600 dark:text-gray-400">Surveys Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">98%</span>
              <span className="text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">50+</span>
              <span className="text-gray-600 dark:text-gray-400">Insurance Partners</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-500">24/7</span>
              <span className="text-gray-600 dark:text-gray-400">Support Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;