import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/sections/Features';
import Solutions from '../components/sections/Solutions';
import Pricing from '../components/sections/Pricing';
import Clients from '../components/sections/clients/Clients';
import Testimonials from '../components/sections/testimonials/Testimonials';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />
      <Hero />
      <Features />
      <Solutions />
      <Clients />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Landing;