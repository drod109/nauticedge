import React, { useState } from 'react';
import { Mail, Phone, ArrowLeft, Shield, Check, AlertCircle, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Try to send password reset email
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

      // Show success message
      alert('Password reset instructions have been sent to your email');
      window.location.href = '/login';
      return;

    } catch (err) {
      if (err instanceof Error && err.message === 'No account found with this email address') {
        throw new Error('No account found with this email address');
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (verificationCode.length !== 6) {
        throw new Error('Please enter a valid 6-digit code');
      }

      // In production, verify the code with your SMS service
      // For demo purposes, accept any 6-digit code
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
      setRemainingAttempts(prev => prev - 1);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Reset password using Supabase Auth
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/login` }
      );

      if (resetError) throw resetError;

      // Redirect to login page
      window.location.href = '/login';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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
              {step === 'email' && "We'll help you get back into your account"}
              {step === 'verify' && "Enter the verification code sent to your phone"}
              {step === 'reset' && "Create a new password for your account"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl animate-fade-in">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                {step === 'verify' && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Remaining attempts: {remainingAttempts}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full px-7 py-4 bg-white dark:bg-dark-800 rounded-lg leading-none flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-blue-600 dark:text-blue-400">Continue</span>
                      <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'verify' && phone && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We've sent a verification code to your phone number ending in
                    {' ' + phone.slice(-4)}
                  </p>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter 6-digit code"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6 || remainingAttempts === 0}
                  className="relative w-full px-7 py-4 bg-white dark:bg-dark-800 rounded-lg leading-none flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-blue-600 dark:text-blue-400">Verify Code</span>
                      <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="relative w-full px-7 py-4 bg-white dark:bg-dark-800 rounded-lg leading-none flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-blue-600 dark:text-blue-400">Reset Password</span>
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {step === 'verify' && (
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Didn't receive the code?{' '}
              <button className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                Resend code
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;