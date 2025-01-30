import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { initializeTheme } from './lib/theme';

// Lazy load components
const Hero = lazy(async () => {
  const module = await import('./components/Hero');
  return { default: module.default };
});
const Features = lazy(async () => {
  const module = await import('./components/sections/Features');
  return { default: module.default };
});
const Solutions = lazy(async () => {
  const module = await import('./components/sections/Solutions');
  return { default: module.default };
});
const Pricing = lazy(async () => {
  const module = await import('./components/sections/Pricing');
  return { default: module.default };
});
const ClientsSection = lazy(async () => {
  const module = await import('./components/sections/clients/Clients');
  return { default: module.default };
});
const Testimonials = lazy(async () => {
  const module = await import('./components/sections/testimonials/Testimonials');
  return { default: module.default };
});
const Footer = lazy(async () => {
  const module = await import('./components/footer/Footer');
  return { default: module.default };
});

// Lazy load pages
const Login = lazy(async () => {
  const module = await import('./pages/Login');
  return { default: module.default };
});
const ForgotPassword = lazy(async () => {
  const module = await import('./pages/ForgotPassword');
  return { default: module.default };
});
const ResetPassword = lazy(async () => {
  const module = await import('./pages/ResetPassword');
  return { default: module.default };
});
const Dashboard = lazy(async () => {
  const module = await import('./pages/Dashboard');
  return { default: module.default };
});
const Profile = lazy(async () => {
  const module = await import('./pages/Profile');
  return { default: module.default };
});
const NewClient = lazy(async () => {
  const module = await import('./pages/NewClient');
  return { default: module.default };
});
const AddPaymentMethod = lazy(async () => {
  const module = await import('./pages/AddPaymentMethod');
  return { default: module.default };
});
const Settings = lazy(async () => {
  const module = await import('./pages/Settings');
  return { default: module.default };
});
const APIKeys = lazy(async () => {
  const module = await import('./pages/APIKeys');
  return { default: module.default };
});
const Webhooks = lazy(async () => {
  const module = await import('./pages/Webhooks');
  return { default: module.default };
});
const NewAPIKey = lazy(async () => {
  const module = await import('./pages/NewAPIKey');
  return { default: module.default };
});
const NewWebhook = lazy(async () => {
  const module = await import('./pages/NewWebhook');
  return { default: module.default };
});
const SignUp = lazy(async () => {
  const module = await import('./pages/SignUp');
  return { default: module.default };
});
const About = lazy(async () => {
  const module = await import('./pages/About');
  return { default: module.default };
});
const ChangePassword = lazy(async () => {
  const module = await import('./pages/ChangePassword');
  return { default: module.default };
});
const Sessions = lazy(async () => {
  const module = await import('./pages/Sessions');
  return { default: module.default };
});
const LoginHistory = lazy(async () => {
  const module = await import('./pages/LoginHistory');
  return { default: module.default };
});
const TwoFactorAuth = lazy(async () => {
  const module = await import('./pages/TwoFactorAuth');
  return { default: module.default };
});
const Contact = lazy(async () => {
  const module = await import('./pages/Contact');
  return { default: module.default };
});
const Privacy = lazy(async () => {
  const module = await import('./pages/Privacy');
  return { default: module.default };
});
const Terms = lazy(async () => {
  const module = await import('./pages/Terms');
  return { default: module.default };
});
const Blog = lazy(async () => {
  const module = await import('./pages/Blog');
  return { default: module.default };
});
const Security = lazy(async () => {
  const module = await import('./pages/Security');
  return { default: module.default };
});
const Compliance = lazy(async () => {
  const module = await import('./pages/Compliance');
  return { default: module.default };
});
const Careers = lazy(async () => {
  const module = await import('./pages/Careers');
  return { default: module.default };
});
const Documentation = lazy(async () => {
  const module = await import('./pages/Documentation');
  return { default: module.default };
});
const APIReference = lazy(async () => {
  const module = await import('./pages/APIReference');
  return { default: module.default };
});
const Press = lazy(async () => {
  const module = await import('./pages/Press');
  return { default: module.default };
});
const Cookies = lazy(async () => {
  const module = await import('./pages/Cookies');
  return { default: module.default };
});
const HelpCenter = lazy(async () => {
  const module = await import('./pages/HelpCenter');
  return { default: module.default };
});
const Community = lazy(async () => {
  const module = await import('./pages/Community');
  return { default: module.default };
});
const SolutionsPage = lazy(async () => {
  const module = await import('./pages/SolutionsPage');
  return { default: module.default };
});
const Registration = lazy(async () => {
  const module = await import('./pages/Registration');
  return { default: module.default };
});
const Schedule = lazy(async () => {
  const module = await import('./pages/Schedule');
  return { default: module.default };
});
const Invoices = lazy(async () => {
  const module = await import('./pages/Invoices');
  return { default: module.default };
});
const InvoiceBuilder = lazy(async () => {
  const module = await import('./pages/InvoiceBuilder');
  return { default: module.default };
});
const AppointmentDetails = lazy(async () => {
  const module = await import('./pages/AppointmentDetails');
  return { default: module.default };
});
const Clients = lazy(async () => {
  const module = await import('./pages/Clients');
  return { default: module.default };
});

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
    <Suspense fallback={<PageLoader />}>
      <Router>
        <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
            <Route path="/dashboard/clients" element={<Clients />} />
            <Route path="/dashboard/clients/new" element={<NewClient />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/schedule/appointments/:id" element={<AppointmentDetails />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<InvoiceBuilder />} />
            <Route path="/" element={
              <Suspense fallback={<PageLoader />}>
                <Navigation />
                <Hero />
                <Features />
                <ClientsSection />
                <Testimonials />
                <Pricing />
                <Footer />
              </Suspense>
            } />
          </Routes>
        </div>
      </Router>
    </Suspense>
  );
}

export default App;