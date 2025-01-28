import React, { useState } from 'react';
import { CreditCard, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AddPaymentMethod = () => {
  const [theme, setCurrentTheme] = useState<Theme>(getInitialTheme());
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      const month = digits.substr(0, 2);
      const year = digits.substr(2, 2);
      // Validate month
      if (parseInt(month) > 12) {
        return '12/' + year;
      }
      return `${month}/${year}`;
    }
    return digits;
  };

  // Format CVV to only allow 3-4 digits
  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').substr(0, 4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // In a production environment, you would:
      // 1. Send card details to a payment processor (e.g., Stripe)
      // 2. Store only the token/reference and last 4 digits
      
      const last4 = cardNumber.trim().slice(-4);
      const expMonth = expiryDate.split('/')[0];
      const expYear = `20${expiryDate.split('/')[1]}`;

      const { error: dbError } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          card_last4: last4,
          card_brand: 'visa', // In production, this would come from the payment processor
          exp_month: expMonth,
          exp_year: expYear,
          cardholder_name: cardholderName,
          is_default: true
        });

      if (dbError) throw dbError;

      // Redirect back to billing section
      window.location.href = '/profile?tab=billing';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                <div className="p-6 border-b border-gray-200 dark:border-dark-700">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Add Payment Method</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enter your card details securely</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(formatCVV(e.target.value))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full sm:w-auto group overflow-hidden rounded-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:scale-105 transition-transform duration-300"></div>
                      <div className="relative w-full px-8 py-3 leading-none flex items-center justify-center space-x-2">
                        {loading ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span className="text-white">Add Card</span>
                            <Check className="h-5 w-5 text-white transform group-hover:scale-110 transition-transform" />
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AddPaymentMethod;