import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './lib/errorBoundary';
import { ScrollToTop } from './lib/navigation';
import Navigation from './components/Navigation';
import PageLoader from './components/PageLoader';
import { initializeTheme } from './lib/theme';
import { performanceMonitor } from './lib/performance';

// Lazy load components with error boundaries
const lazyLoad = (importFn: () => Promise<any>, name: string) => {
  const Component = lazy(async () => {
    try {
      const module = await importFn();
      return { default: module.default };
    } catch (error) {
      console.error(`Error loading ${name}:`, error);
      throw error;
    }
  });
  return performanceMonitor.measureRender(Component, name);
};

const Hero = lazyLoad(() => import('./components/Hero'), 'Hero');
const Features = lazyLoad(() => import('./components/sections/Features'), 'Features');
const Solutions = lazyLoad(() => import('./components/sections/Solutions'), 'Solutions');
const Pricing = lazyLoad(() => import('./components/sections/Pricing'), 'Pricing');
const ClientsSection = lazyLoad(() => import('./components/sections/clients/Clients'), 'ClientsSection');
const Testimonials = lazyLoad(() => import('./components/sections/testimonials/Testimonials'), 'Testimonials');
const Footer = lazyLoad(() => import('./components/footer/Footer'), 'Footer');

// Lazy load pages
const Login = lazyLoad(() => import('./pages/Login'), 'Login');
const ForgotPassword = lazyLoad(() => import('./pages/ForgotPassword'), 'ForgotPassword');
const ResetPassword = lazyLoad(() => import('./pages/ResetPassword'), 'ResetPassword');
const Dashboard = lazyLoad(() => import('./pages/Dashboard'), 'Dashboard');
const Profile = lazyLoad(() => import('./pages/Profile'), 'Profile');
const NewClient = lazyLoad(() => import('./pages/NewClient'), 'NewClient');
const AddPaymentMethod = lazyLoad(() => import('./pages/AddPaymentMethod'), 'AddPaymentMethod');
const Settings = lazyLoad(() => import('./pages/Settings'), 'Settings');
const APIKeys = lazyLoad(() => import('./pages/APIKeys'), 'APIKeys');
const Webhooks = lazyLoad(() => import('./pages/Webhooks'), 'Webhooks');
const NewAPIKey = lazyLoad(() => import('./pages/NewAPIKey'), 'NewAPIKey');
const NewWebhook = lazyLoad(() => import('./pages/NewWebhook'), 'NewWebhook');
const SignUp = lazyLoad(() => import('./pages/SignUp'), 'SignUp');
const About = lazyLoad(() => import('./pages/About'), 'About');
const ChangePassword = lazyLoad(() => import('./pages/ChangePassword'), 'ChangePassword');
const Sessions = lazyLoad(() => import('./pages/Sessions'), 'Sessions');
const LoginHistory = lazyLoad(() => import('./pages/LoginHistory'), 'LoginHistory');
const TwoFactorAuth = lazyLoad(() => import('./pages/TwoFactorAuth'), 'TwoFactorAuth');
const Contact = lazyLoad(() => import('./pages/Contact'), 'Contact');
const Privacy = lazyLoad(() => import('./pages/Privacy'), 'Privacy');
const Terms = lazyLoad(() => import('./pages/Terms'), 'Terms');
const Blog = lazyLoad(() => import('./pages/Blog'), 'Blog');
const Security = lazyLoad(() => import('./pages/Security'), 'Security');
const Compliance = lazyLoad(() => import('./pages/Compliance'), 'Compliance');
const Careers = lazyLoad(() => import('./pages/Careers'), 'Careers');
const Documentation = lazyLoad(() => import('./pages/Documentation'), 'Documentation');
const APIReference = lazyLoad(() => import('./pages/APIReference'), 'APIReference');
const Press = lazyLoad(() => import('./pages/Press'), 'Press');
const Cookies = lazyLoad(() => import('./pages/Cookies'), 'Cookies');
const HelpCenter = lazyLoad(() => import('./pages/HelpCenter'), 'HelpCenter');
const Community = lazyLoad(() => import('./pages/Community'), 'Community');
const SolutionsPage = lazyLoad(() => import('./pages/SolutionsPage'), 'SolutionsPage');
const Registration = lazyLoad(() => import('./pages/Registration'), 'Registration');
const Schedule = lazyLoad(() => import('./pages/Schedule'), 'Schedule');
const Invoices = lazyLoad(() => import('./pages/Invoices'), 'Invoices');
const InvoiceBuilder = lazyLoad(() => import('./pages/InvoiceBuilder'), 'InvoiceBuilder');
const InvoiceDetails = lazyLoad(() => import('./pages/InvoiceDetails'), 'InvoiceDetails');
const AppointmentDetails = lazyLoad(() => import('./pages/AppointmentDetails'), 'AppointmentDetails');
const Clients = lazyLoad(() => import('./pages/Clients'), 'Clients');

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Router>
          <ScrollToTop />
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
              <Route path="/invoices/:id" element={<InvoiceDetails />} />
              <Route path="*" element={
                <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center p-4">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
                    <a
                      href="/"
                      className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                      Return Home
                    </a>
                  </div>
                </div>
              } />
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
    </ErrorBoundary>
  );
}

export default App;