import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/sections/Features';
import Solutions from './components/sections/Solutions';
import Pricing from './components/sections/Pricing';
import Clients from './components/sections/clients/Clients';
import Testimonials from './components/sections/testimonials/Testimonials';
import Footer from './components/footer/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TestConnection from './components/auth/TestConnection';
import SignUp from './pages/SignUp';

function App() {
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

  return (
    <div className="min-h-screen bg-white">
      <TestConnection />
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
}

export default App;