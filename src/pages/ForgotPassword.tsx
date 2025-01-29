import React, { useState, useEffect } from 'react';
import { Mail, Shield, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
  const navigate = useNavigate();

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
        { redirectTo: `${window.location.origin}/reset-password` }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <a href="/" className="group flex items-center justify-center mb-8">
            <Shield className="h-10 w-10 text-blue-600 dark:text-blue-500 group-hover:rotate-[-10deg] transition-transform duration-300" />
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white group-hover:animate-gradient">NauticEdge</span>
          </a>

          <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-dark-700/50 animate-fade-in">
            <div className="flex flex-col items-center mb-8">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Reset Password</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl animate-fade-in">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            {success ? (
              <div className="text-center">
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
                  onClick={() => navigate('/login')}
                  className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Return to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                      placeholder="Enter your email"
                      required
                      disabled={isLocked}
                    />
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
                      <span className="text-blue-600 dark:text-blue-400">Send Reset Instructions</span>
                    )}
                  </div>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80"
            alt="Ocean view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-900/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <blockquote className="text-white max-w-lg animate-fade-in-up">
              <p className="text-2xl font-medium mb-6">
                "NauticEdge's commitment to security and user experience sets them apart in the maritime industry."
              </p>
              <footer className="text-white/90">
                <p className="font-semibold">Sarah Chen</p>
                <p>Fleet Manager, Pacific Marine</p>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;