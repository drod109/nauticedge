import React from 'react';
import ClientList from './ClientList';
import { Building2 } from 'lucide-react';

const Clients = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join hundreds of maritime companies already using our platform
          </p>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ClientList />
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">500+</span>
            <p className="text-gray-600 dark:text-gray-400">Active Users</p>
          </div>
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">25+</span>
            <p className="text-gray-600 dark:text-gray-400">Countries</p>
          </div>
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">10K+</span>
            <p className="text-gray-600 dark:text-gray-400">Surveys Completed</p>
          </div>
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-dark-700/50 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">98%</span>
            <p className="text-gray-600 dark:text-gray-400">Client Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;