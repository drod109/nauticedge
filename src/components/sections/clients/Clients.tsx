import React from 'react';
import ClientList from './ClientList';

const Clients = () => {
  return (
    <section className="py-16 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join hundreds of maritime companies already using our platform
          </p>
        </div>
        <ClientList />
      </div>
    </section>
  );
};

export default Clients;