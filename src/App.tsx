import React, { useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './lib/errorBoundary'; 
import PageLoader from './components/PageLoader';
import Login from './pages/Login';
import Landing from './pages/Landing';

// Lazy load survey pages
const SurveysPage = lazy(() => import('./pages/dashboard/surveys'));
const NewSurveyPage = lazy(() => import('./pages/dashboard/surveys/new'));
const EditSurveyPage = lazy(() => import('./pages/dashboard/surveys/[id]/edit'));
const ViewSurveyPage = lazy(() => import('./pages/dashboard/surveys/[id]'));

// Lazy load components with unique names
const LandingHero = lazy(() => import('./components/Hero'));
const LandingFeatures = lazy(() => import('./components/sections/Features'));
const LandingSolutions = lazy(() => import('./components/sections/Solutions'));
const LandingPricing = lazy(() => import('./components/sections/Pricing'));
const LandingClients = lazy(() => import('./components/sections/clients/Clients'));
const LandingTestimonials = lazy(() => import('./components/sections/testimonials/Testimonials'));
const LandingFooter = lazy(() => import('./components/footer/Footer'));

// Lazy load pages with unique names
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const NewClientPage = lazy(() => import('./pages/NewClient'));
const AddPaymentMethodPage = lazy(() => import('./pages/AddPaymentMethod'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const APIKeysPage = lazy(() => import('./pages/APIKeys'));
const WebhooksPage = lazy(() => import('./pages/Webhooks'));
const NewAPIKeyPage = lazy(() => import('./pages/NewAPIKey'));
const NewWebhookPage = lazy(() => import('./pages/NewWebhook'));
const SignUpPage = lazy(() => import('./pages/SignUp'));
const AboutPage = lazy(() => import('./pages/About'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePassword'));
const SessionsPage = lazy(() => import('./pages/Sessions'));
const LoginHistoryPage = lazy(() => import('./pages/LoginHistory'));
const TwoFactorAuthPage = lazy(() => import('./pages/TwoFactorAuth'));
const ContactPage = lazy(() => import('./pages/Contact'));
const PrivacyPage = lazy(() => import('./pages/Privacy'));
const TermsPage = lazy(() => import('./pages/Terms'));
const BlogPage = lazy(() => import('./pages/Blog'));
const SecurityPage = lazy(() => import('./pages/Security'));
const CompliancePage = lazy(() => import('./pages/Compliance'));
const CareersPage = lazy(() => import('./pages/Careers'));
const DocumentationPage = lazy(() => import('./pages/Documentation'));
const APIReferencePage = lazy(() => import('./pages/APIReference'));
const PressPage = lazy(() => import('./pages/Press'));
const CookiesPage = lazy(() => import('./pages/Cookies'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenter'));
const CommunityPage = lazy(() => import('./pages/Community'));
const SolutionsPage = lazy(() => import('./pages/SolutionsPage'));
const RegistrationPage = lazy(() => import('./pages/Registration'));
const SchedulePage = lazy(() => import('./pages/Schedule'));
const InvoicesPage = lazy(() => import('./pages/Invoices'));
const InvoiceBuilderPage = lazy(() => import('./pages/InvoiceBuilder'));
const InvoiceDetailsPage = lazy(() => import('./pages/InvoiceDetails'));
const AppointmentDetailsPage = lazy(() => import('./pages/AppointmentDetails'));
const ClientsPage = lazy(() => import('./pages/Clients'));

function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
        <div className="relative">
          <div className="h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-dark-800/90 animate-pulse"></div>
        </div>
      </div>
    }>
        <Router>
          <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/add-payment-method" element={<AddPaymentMethodPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/2fa" element={<TwoFactorAuthPage />} />
              <Route path="/settings/sessions" element={<SessionsPage />} />
              <Route path="/settings/login-history" element={<LoginHistoryPage />} />
              <Route path="/settings/change-password" element={<ChangePasswordPage />} />
              <Route path="/settings/api-keys" element={<APIKeysPage />} />
              <Route path="/settings/webhooks" element={<WebhooksPage />} />
              <Route path="/settings/api-keys/new" element={<NewAPIKeyPage />} />
              <Route path="/settings/webhooks/new" element={<NewWebhookPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/docs" element={<DocumentationPage />} />
              <Route path="/api" element={<APIReferencePage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/dashboard/clients" element={<ClientsPage />} />
              <Route path="/dashboard/clients/new" element={<NewClientPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/schedule/appointments/:id" element={<AppointmentDetailsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/new" element={<InvoiceBuilderPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
              <Route path="/dashboard/surveys" element={<SurveysPage />} />
              <Route path="/dashboard/surveys/new" element={<NewSurveyPage />} />
              <Route path="/dashboard/surveys/:id/edit" element={<EditSurveyPage />} />
              <Route path="/dashboard/surveys/:id" element={<ViewSurveyPage />} />
              <Route path="/" element={<Landing />} />
            </Routes>
          </div>
        </Router>
      </Suspense>
  );
}

export default App;