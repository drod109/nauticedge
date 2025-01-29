import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Shield, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);

  useEffect(() => {
    // Check if there's an existing lockout
    const storedLockout = localStorage.getItem('passwordResetLockout');
    if (storedLockout) {
      const lockoutData = JSON.parse(storedLockout);
      const lockoutEnd = new Date(lockoutData.endTime);
      if (lockoutEnd > new Date()) {
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);
      } else {
        // Clear expired lockout
        localStorage.removeItem('passwordResetLockout');
      }
    }
  }, []);

  const handleLockout = () => {
    const lockoutDuration = 60 * 60 * 1000; // 1 hour
    const endTime = new Date(Date.now() + lockoutDuration);
    setIsLocked(true);
    setLockoutEndTime(endTime);
    localStorage.setItem('passwordResetLockout', JSON.stringify({
      endTime: endTime.toISOString()
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check for lockout
      if (isLocked) {
        throw new Error(`Too many attempts. Please try again after ${lockoutEndTime?.toLocaleTimeString()}`);
      }

      // Increment attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Check max attempts
      if (newAttempts >= 3) {
        handleLockout();
        throw new Error('Maximum attempts reached. Please try again in 1 hour.');
      }

      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/login` }
      );

      if (resetError) {
        if (resetError.message.includes('Email not found')) {
          throw new Error('No account found with this email address');
        }
        throw resetError;
      }

      setSuccess(true);
      // Reset attempts on success
      setAttempts(0);
      localStorage.removeItem('passwordResetLockout');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
        <div className="relative p-6 border-b border-gray-200/50 dark:border-dark-700/50">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mb-3">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Reset Password</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              We'll help you get back into your account
            </p>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl animate-fade-in">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {success ? (
          <div className="p-6 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Check your email
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent password reset instructions to {email}
            </p>
            <button
              onClick={onBack}
              className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              Return to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  aria-label="Email address"
                  aria-describedby="email-description"
                  aria-invalid={error ? "true" : "false"}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                  placeholder="Enter your email"
                  required
                  disabled={isLocked}
                />
              </div>
              <div id="email-description" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the email address associated with your account
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="relative w-full group overflow-hidden rounded-lg"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-full px-7 py-4 bg-white dark:bg-dark-800 rounded-lg leading-none flex items-center justify-center space-x-2">
                {loading ? (
                  <div className="h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-blue-600 dark:text-blue-400">Send Reset Instructions</span>
                    <ArrowLeft className="h-5 w-5 text-blue-600 dark:text-blue-400 transform rotate-180 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;