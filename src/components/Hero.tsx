import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-[700px] lg:min-h-[800px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200&h=400')] bg-cover bg-center opacity-10 animate-ken-burns"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-20 md:py-32">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient">
            Modern Marine Survey Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 animate-fade-in-up">
            Streamline your marine surveys with our comprehensive digital platform. 
            Built for surveyors, boat owners, and insurers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="/signup"
              className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition-all duration-300 ease-out rounded-lg group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600"></span>
              <span className="relative group-hover:scale-110 transition-transform duration-300">
                Start Free Trial
              </span>
              <ArrowRight className="relative ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 group">
              <span className="relative flex items-center">
                Watch Demo
                <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
              </span>
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent animate-number" data-value="1000">1000+</span>
              <span className="text-gray-600 dark:text-gray-400">Surveys Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent animate-number" data-value="98">98%</span>
              <span className="text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent animate-number" data-value="50">50+</span>
              <span className="text-gray-600 dark:text-gray-400">Insurance Partners</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">24/7</span>
              <span className="text-gray-600 dark:text-gray-400">Support Available</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent animate-blob"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default Hero;