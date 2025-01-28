import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import { initializeTheme } from './lib/theme';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/sections/Features'));
const Solutions = lazy(() => import('./components/sections/Solutions'));
const Pricing = lazy(() => import('./components/sections/Pricing'));
const ClientsSection = lazy(() => import('./components/sections/clients/Clients'));
const Testimonials = lazy(() => import('./components/sections/testimonials/Testimonials'));
const Footer = lazy(() => import('./components/footer/Footer'));

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const AddPaymentMethod = lazy(() => import('./pages/AddPaymentMethod'));
const Settings = lazy(() => import('./pages/Settings'));
const SignUp = lazy(() => import('./pages/SignUp'));
const About = lazy(() => import('./pages/About'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Sessions = lazy(() => import('./pages/Sessions'));
const LoginHistory = lazy(() => import('./pages/LoginHistory'));
const TwoFactorAuth = lazy(() => import('./pages/TwoFactorAuth'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Blog = lazy(() => import('./pages/Blog'));
const Security = lazy(() => import('./pages/Security'));
const Compliance = lazy(() => import('./pages/Compliance'));
const Careers = lazy(() => import('./pages/Careers'));
const Documentation = lazy(() => import('./pages/Documentation'));
const APIReference = lazy(() => import('./pages/APIReference'));
const Press = lazy(() => import('./pages/Press'));
const Cookies = lazy(() => import('./pages/Cookies'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Community = lazy(() => import('./pages/Community'));
const SolutionsPage = lazy(() => import('./pages/SolutionsPage'));
const Registration = lazy(() => import('./pages/Registration'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Invoices = lazy(() => import('./pages/Invoices'));
const InvoiceBuilder = lazy(() => import('./pages/InvoiceBuilder'));
const ClientsPage = lazy(() => import('./pages/Clients'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
    <div className="relative">
      <div className="h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-dark-800/90 animate-pulse"></div>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  // Simple route handling
  const path = window.location.pathname;

  const renderContent = () => {
    if (path === '/login') {
      return <Login />;
    }

    if (path === '/dashboard') {
      return <Dashboard />;
    }

    if (path === '/profile') {
      return <Profile />;
    }
    
    if (path === '/add-payment-method') {
      return <AddPaymentMethod />;
    }

    if (path === '/settings') {
      return <Settings />;
    }
    
    if (path === '/settings/2fa') {
      return <TwoFactorAuth />;
    }
    
    if (path === '/settings/sessions') {
      return <Sessions />;
    }
    
    if (path === '/settings/login-history') {
      return <LoginHistory />;
    }
    
    if (path === '/settings/change-password') {
      return <ChangePassword />;
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

    return (
      <>
        <Navigation />
        <Suspense fallback={<PageLoader />}>
          <Hero />
          <Features />
          <ClientsSection />
          <Testimonials />
          <Pricing />
          <Footer />
        </Suspense>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors">
      <Suspense fallback={<PageLoader />}>
        {renderContent()}
      </Suspense>
    </div>
  );
}

export default App;