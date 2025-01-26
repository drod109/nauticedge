import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/sections/Features';
import Solutions from './components/sections/Solutions';
import Pricing from './components/sections/Pricing';
import ClientsSection from './components/sections/clients/Clients';
import ClientsPage from './pages/Clients';
import Testimonials from './components/sections/testimonials/Testimonials';
import Footer from './components/footer/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import Security from './pages/Security';
import Compliance from './pages/Compliance';
import Careers from './pages/Careers';
import Documentation from './pages/Documentation';
import APIReference from './pages/APIReference';
import Press from './pages/Press';
import Cookies from './pages/Cookies';
import HelpCenter from './pages/HelpCenter';
import Community from './pages/Community';
import SolutionsPage from './pages/SolutionsPage';
import Registration from './pages/Registration';
import Schedule from './pages/Schedule';
import Invoices from './pages/Invoices';
import InvoiceBuilder from './pages/InvoiceBuilder';
import { initializeTheme } from './lib/theme';

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  // Simple route handling
  const path = window.location.pathname;

  if (path === '/login') {
    return <Login />;
  }

  if (path === '/dashboard') {
    return <Dashboard />;
  }

  if (path === '/profile') {
    return <Profile />;
  }

  if (path === '/settings') {
    return <Settings />;
  }

  if (path === '/signup') {
    return <SignUp />;
  }

  if (path === '/about') {
    return <About />;
  }

  if (path === '/contact') {
    return <Contact />;
  }
  
  if (path === '/privacy') {
    return <Privacy />;
  }
  
  if (path === '/terms') {
    return <Terms />;
  }
  
  if (path === '/blog') {
    return <Blog />;
  }

  if (path === '/security') {
    return <Security />;
  }
  
  if (path === '/compliance') {
    return <Compliance />;
  }
  
  if (path === '/careers') {
    return <Careers />;
  }
  
  if (path === '/docs') {
    return <Documentation />;
  }
  
  if (path === '/api') {
    return <APIReference />;
  }
  
  if (path === '/press') {
    return <Press />;
  }

  if (path === '/help') {
    return <HelpCenter />;
  }

  if (path === '/community') {
    return <Community />;
  }
  
  if (path === '/solutions') {
    return <SolutionsPage />;
  }
  
  if (path === '/cookies') {
    return <Cookies />;
  }
  
  if (path === '/registration') {
    return <Registration />;
  }
  
  if (path === '/dashboard/clients') {
    return <ClientsPage />;
  }

  if (path === '/schedule') {
    return <Schedule />;
  }
  
  if (path === '/invoices') {
    return <Invoices />;
  }
  
  if (path === '/invoices/new') {
    return <InvoiceBuilder />;
  }

  if (path === '/dashboard/clients') {
    return <Clients />;
  }
  
  if (path === '/dashboard/clients') {
    return <Clients />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors">
      <Navigation />
      <Hero />
      <Features />
      <ClientsSection />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;