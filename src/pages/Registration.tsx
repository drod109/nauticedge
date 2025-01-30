import React, { useState } from 'react';
import { Ship, Building2, CreditCard, ChevronRight, ChevronLeft, Phone, Check, Clock, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Theme, getInitialTheme } from '../lib/theme';
import ThemeToggle from '../components/ThemeToggle';

interface RegistrationFormData {
  subscription_plan: 'basic' | 'professional' | 'enterprise';
  card_number: string;
  card_expiry: string;
  card_cvc: string;
  cardholder_name: string;
  company_name: string;
  company_position: string;
  registration_number: string;
  tax_id: string;
  company_address_line1: string;
  company_address_line2: string;
  company_city: string;
  company_state: string;
  company_postal_code: string;
  company_country: string;
  company_phone: string;
}

const plans = [
  {
    name: 'Basic',
    price: 49,
    features: ['Up to 20 surveys per month', 'Basic report templates', 'Email support']
  },
  {
    name: 'Professional',
    price: 99,
    features: ['Unlimited surveys', 'Custom report templates', 'Priority support', 'API access']
  },
  {
    name: 'Enterprise',
    price: 249,
    features: ['Everything in Professional', 'White-label reports', '24/7 phone support', 'Custom integrations']
  }
];

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [totalSteps] = useState(3); // Now 3 steps including billing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subscription_plan: 'basic',
    card_number: '',
    card_expiry: '',
    card_cvc: '',
    cardholder_name: '',
    company_name: '',
    company_position: '',
    registration_number: '',
    tax_id: '',
    company_address_line1: '',
    company_address_line2: '',
    company_city: '',
    company_state: '',
    company_postal_code: '',
    company_country: '',
    company_phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    // Format credit card number
    if (name === 'card_number') {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format card number as XXXX XXXX XXXX XXXX
      if (digits.length <= 16) {
        value = digits.replace(/(\d{4})/g, '$1 ').trim();
      }
    }
    
    // Format card expiry
    if (name === 'card_expiry') {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format as MM/YY
      if (digits.length >= 2) {
        const month = digits.slice(0, 2);
        const year = digits.slice(2, 4);
        
        // Validate month
        if (parseInt(month) > 12) {
          value = '12' + (year ? `/${year}` : '');
        } else {
          value = month + (year ? `/${year}` : '');
        }
      } else {
        value = digits;
      }
    }
    
    // Format CVC
    if (name === 'card_cvc') {
      // Only allow 3-4 digits
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    // Format phone number
    if (name === 'company_phone') {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format phone number as (XXX) XXX-XXXX
      if (digits.length <= 10) {
        value = digits
          .replace(/(\d{3})/, '($1) ')
          .replace(/(\d{3})(\d{1,4})/, '$1-$2');
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.subscription_plan;
      case 2:
        return (
          !!formData.card_number &&
          !!formData.card_expiry &&
          !!formData.card_cvc &&
          !!formData.cardholder_name
        );
      case 3:
        return (
          !!formData.company_name &&
          !!formData.company_position &&
          !!formData.registration_number &&
          !!formData.tax_id &&
          !!formData.company_address_line1 &&
          !!formData.company_city &&
          !!formData.company_state &&
          !!formData.company_postal_code &&
          !!formData.company_country &&
          !!formData.company_phone
        );
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create payment method
      const { error: paymentError } = await supabase
        .from('payment_methods')
        .insert([{
          user_id: user.id,
          card_last4: formData.card_number.slice(-4),
          card_brand: 'visa', // In production, get from payment processor
          exp_month: formData.card_expiry.split('/')[0],
          exp_year: `20${formData.card_expiry.split('/')[1]}`,
          cardholder_name: formData.cardholder_name,
          is_default: true
        }]);

      if (paymentError) throw paymentError;

      // Update profile with company details
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_name: formData.company_name,
          company_position: formData.company_position,
          registration_number: formData.registration_number,
          tax_id: formData.tax_id,
          company_address_line1: formData.company_address_line1,
          company_address_line2: formData.company_address_line2,
          company_city: formData.company_city,
          company_state: formData.company_state,
          company_postal_code: formData.company_postal_code,
          company_country: formData.company_country,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name.toLowerCase()}
                  className={`relative p-6 rounded-xl border-2 transition-colors cursor-pointer ${
                    formData.subscription_plan === plan.name.toLowerCase()
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-dark-700 hover:border-blue-600 dark:hover:border-blue-500'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, subscription_plan: plan.name.toLowerCase() as any }))}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    ${plan.price}
                    <span className="text-base font-normal text-gray-500 dark:text-gray-400">/month</span>
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                        <ChevronRight className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholder_name"
                  value={formData.cardholder_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="card_number"
                    value={formData.card_number}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="card_expiry"
                    value={formData.card_expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CVC
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="card_cvc"
                    value={formData.card_cvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">3. Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="company_position"
                  value={formData.company_position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax ID
                </label>
                <input
                  type="text"
                  name="tax_id"
                  value={formData.tax_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="company_address_line1"
                  value={formData.company_address_line1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="company_address_line2"
                  value={formData.company_address_line2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="company_city"
                  value={formData.company_city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  name="company_state"
                  value={formData.company_state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  name="company_postal_code"
                  value={formData.company_postal_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="company_country"
                  value={formData.company_country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="company_phone"
                    value={formData.company_phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      {/* Header */}
      <header className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-dark-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="group flex items-center">
                <Ship className="h-8 w-8 text-blue-600 dark:text-blue-500 group-hover:rotate-[-10deg] transition-transform duration-300" />
                <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white group-hover:animate-gradient">NauticEdge</span>
              </a>
            </div>
            <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-dark-700/50 p-6 sm:p-8 animate-fade-in">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="hidden sm:flex items-center justify-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1 ? 'border-blue-600 dark:border-blue-500' : 'border-gray-400 dark:border-gray-500'
                }`}>
                  1
                </div>
                <span>Plan Selection</span>
              </div>
              <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2 ? 'border-blue-600 dark:border-blue-500' : 'border-gray-400 dark:border-gray-500'}`}>
                  2
                </div>
                <span>Payment</span>
              </div>
              <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 3 ? 'border-blue-600 dark:border-blue-500' : 'border-gray-400 dark:border-gray-500'
                }`}>
                  3
                </div>
                <span>Company Details</span>
              </div>
            </div>
            
            {/* Mobile Steps */}
            <div className="sm:hidden flex items-center justify-center">
              <div className="flex items-center space-x-3">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= step
                          ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500'
                          : 'border-gray-400 dark:border-gray-500 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-3 h-0.5 mx-1 ${
                          currentStep > step
                            ? 'bg-blue-600 dark:bg-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 text-center sm:hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentStep === 1 && 'Plan Selection'}
                {currentStep === 2 && 'Payment Information'}
                {currentStep === 3 && 'Company Details'}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300 flex items-center justify-center"
                >
                  Back
                </button>
              )}
              <div className="w-full sm:w-auto sm:ml-auto">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => validateStep(currentStep) && setCurrentStep(prev => prev + 1)}
                    className="w-full sm:w-auto relative group overflow-hidden rounded-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:scale-105 transition-transform duration-300"></div>
                    <div className="relative px-8 py-3 flex items-center justify-center">
                      <span className="text-white font-medium">Next</span>
                      <ChevronRight className="ml-2 h-5 w-5 text-white transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!validateStep(currentStep) || loading}
                    className="w-full sm:w-auto relative group overflow-hidden rounded-lg disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:scale-105 transition-transform duration-300"></div>
                    <div className="relative px-8 py-3 flex items-center justify-center">
                      {loading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="text-white font-medium">Complete Registration</span>
                          <Check className="ml-2 h-5 w-5 text-white transform group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Registration;