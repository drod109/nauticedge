import React, { useState, useEffect } from 'react';
import { Mail, Lock, Shield } from 'lucide-react';
import MFAVerification from './MFAVerification';
import ForgotPassword from './ForgotPassword';
import { supabase } from '../../lib/supabase';
import { checkMFAStatus } from '../../lib/mfa';
import { getRememberedEmail, rememberEmail, forgetEmail } from '../../utils/auth';

import { getBrowserInfo } from '../../utils/browser';
import { getLocationInfo } from '../../utils/location';

const LoginForm = () => {
  const [email, setEmail] = useState(getRememberedEmail() || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!getRememberedEmail());
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Handle remember me preference
    if (rememberMe) {
      rememberEmail(email);
    } else {
      forgetEmail();
    }

    try {
      const locationInfo = await getLocationInfo();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data.user) {
        setSessionId(data.session?.access_token || '');
        setUserId(data.user.id);
        
        // Check if user has MFA enabled
        const hasMFA = await checkMFAStatus();
        if (hasMFA) {
          setShowMFAVerification(true);
          return;
        }

        // Create new session record
        const browserInfo = getBrowserInfo();
        const { error: sessionError } = await supabase.rpc('create_user_session', {
          p_user_id: data.user.id,
          p_session_id: data.session?.access_token || '',
          p_user_agent: navigator.userAgent,
          p_device_info: {
            type: browserInfo.isMobile ? 'mobile' : 'desktop',
            browser: browserInfo.browser,
            os: browserInfo.os
          },
          p_location: locationInfo
        });

        if (sessionError) {
          // If session already exists, just redirect to dashboard
          if (sessionError.code === '23505') {
            window.location.href = '/dashboard';
            return;
          }
          throw sessionError;
        }

        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerify = async (code: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create session record after successful MFA
      const browserInfo = getBrowserInfo();
      const locationInfo = await getLocationInfo();
      
      const { error: sessionError } = await supabase.rpc('create_user_session', {
        p_user_id: user.id,
        p_session_id: sessionId || user.id,
        p_user_agent: navigator.userAgent,
        p_device_info: {
          type: browserInfo.isMobile ? 'mobile' : 'desktop',
          browser: browserInfo.browser,
          os: browserInfo.os
        },
        p_location: locationInfo
      });

      if (sessionError) throw sessionError;

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify MFA code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google authentication
    window.location.href = '/dashboard';
  };

  const handleAppleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple'
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Apple');
    }
  };

  if (showMFAVerification) {
    return (
      <MFAVerification
        onVerify={handleMFAVerify}
        onCancel={() => setShowMFAVerification(false)}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword onBack={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-gray-200 dark:border-dark-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Welcome back</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const submitButton = e.currentTarget.form?.querySelector('button[type="submit"]');
                  if (submitButton) {
                    submitButton.click();
                  }
                }
              }}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-dark-600 rounded" 
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</label>
          </div>
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400"
          >
            Forgot password?
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? <a href="/signup" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400">Sign up</a>
        </p>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg shadow-sm bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
        <button
          onClick={handleAppleLogin}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg shadow-sm bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.07 2.7.6 3.44 1.51-3.03 1.81-2.52 5.87.22 7.22-.65 1.29-1.51 2.58-2.25 3.3ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.33-1.94 4.23-3.74 4.25Z"/>
          </svg>
          Continue with Apple
        </button>
      </div>
    </div>
  );
};

export default LoginForm;