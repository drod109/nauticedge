import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
const NewClient = lazy(() => import('./pages/NewClient'));
const AddPaymentMethod = lazy(() => import('./pages/AddPaymentMethod'));
const Settings = lazy(() => import('./pages/Settings'));
const APIKeys = lazy(() => import('./pages/APIKeys'));
const Webhooks = lazy(() => import('./pages/Webhooks'));
const NewAPIKey = lazy(() => import('./pages/NewAPIKey'));
const NewWebhook = lazy(() => import('./pages/NewWebhook'));
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

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-payment-method" element={<AddPaymentMethod />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/2fa" element={<TwoFactorAuth />} />
            <Route path="/settings/sessions" element={<Sessions />} />
            <Route path="/settings/login-history" element={<LoginHistory />} />
            <Route path="/settings/change-password" element={<ChangePassword />} />
            <Route path="/settings/api-keys" element={<APIKeys />} />
            <Route path="/settings/webhooks" element={<Webhooks />} />
            <Route path="/settings/api-keys/new" element={<NewAPIKey />} />
            <Route path="/settings/webhooks/new" element={<NewWebhook />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/security" element={<Security />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/api" element={<APIReference />} />
            <Route path="/press" element={<Press />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/community" element={<Community />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/dashboard/clients" element={<ClientsPage />} />
            <Route path="/dashboard/clients/new" element={<NewClient />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<InvoiceBuilder />} />
            <Route path="/" element={
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
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;