import React, { useState, useEffect } from 'react';
import { Mail, Lock, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input, Button, Alert, Card, Stack } from '../../lib/designSystem';
import MFAVerification from './MFAVerification';
import ForgotPassword from './ForgotPassword';
import { supabase } from '../../lib/supabase';
import { userSchema } from '../../lib/validation';
import { notificationService } from '../../lib/notifications';
import { performanceMonitor } from '../../lib/performance';
import { keyVaultService } from '../../lib/keyVault';
import { checkMFAStatus } from '../../lib/mfa';
import { getRememberedEmail, rememberEmail, forgetEmail } from '../../utils/auth';

import { getBrowserInfo } from '../../utils/browser';
import { getLocationInfo } from '../../utils/location';

const LoginForm = () => {
  const [email, setEmail] = useState(getRememberedEmail() || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!getRememberedEmail());
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    performanceMonitor.startMetric('login_attempt');
    
    try {
      // Validate input using Zod schema
      const validatedData = userSchema.pick({ email: true }).parse({ email });
    
      // Handle remember me preference
      if (rememberMe) {
        rememberEmail(email);
      } else {
        forgetEmail();
      }

      // Handle remember me preference
      if (rememberMe) {
        rememberEmail(email);
      } else {
        forgetEmail();
      }

      try {
        // Add retry logic for network issues
        const maxRetries = 3;
        let retryCount = 0;
        let lastError = null;
        let locationInfo;

        try {
          locationInfo = await getLocationInfo();
        } catch (err) {
          // Default location info if geolocation fails
          locationInfo = {
            city: 'Unknown',
            country: 'Unknown',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          };
        }

        while (retryCount < maxRetries) {
          try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });

            if (signInError) {
              if (signInError.message.includes('Invalid login credentials')) {
                throw new Error('The email or password you entered is incorrect');
              }
              throw signInError;
            }

            if (data.user) {
              setSessionId(data.session?.access_token || '');
              setUserId(data.user.id);

              // Only store session token if we have one
              if (data.session?.access_token) {
                try {
                  await keyVaultService.storeSecureKey(
                    'session_token',
                    data.session.access_token,
                    { sensitive: true }
                  );
                } catch (error) {
                  // Log but don't block login if secure storage fails
                  logger.error('Failed to store session token securely', { 
                    error: error instanceof Error ? error.message : 'Unknown error'
                  });
                }
              }
          
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
                p_session_id: data.session?.access_token || data.user.id,
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
                if (sessionError.message?.includes('duplicate key value')) {
                  window.location.href = '/dashboard';
                  return;
                }
                throw sessionError;
              }

              // Let ProtectedRoute handle the redirection
              window.location.href = '/dashboard';
              return;
            }
            throw new Error('No user data returned');
          } catch (err) {
            lastError = err;
            if (err instanceof Error && err.name !== 'AuthRetryableFetchError') {
              throw err; // Don't retry non-network errors
            }
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              continue;
            }
          }
        }
        throw lastError || new Error('Failed to sign in after multiple attempts');
      } catch (err) {
        performanceMonitor.endMetric('login_attempt', { error: true });
        
        if (err instanceof Error) {
          switch (err.name) {
            case 'AuthRetryableFetchError':
              notificationService.error({
                title: 'Connection Error',
                message: 'Please check your internet connection and try again'
              });
              break;
            case 'AuthApiError':
              if (err.message.includes('Email not confirmed')) {
                notificationService.warning({
                  title: 'Email Not Verified',
                  message: 'Please verify your email address before logging in'
                });
              } else if (err.message.includes('Invalid login credentials')) {
                notificationService.error({
                  title: 'Invalid Credentials',
                  message: 'The email or password you entered is incorrect'
                });
              } else {
                notificationService.error({
                  title: 'Login Failed',
                  message: err.message || 'Failed to sign in. Please try again.'
                });
              }
              break;
            default:
              notificationService.error({
                title: 'Error',
                message: 'An unexpected error occurred. Please try again later.'
              });
          }
        } else {
          notificationService.error({
            title: 'Error',
            message: 'Unable to sign in at this time. Please try again later.'
          });
        }
      } finally {
        setLoading(false);
        performanceMonitor.endMetric('login_attempt');
      }
    } catch (validationError) {
      setError('Please enter a valid email address');
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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const redirectTo = new URL('/dashboard', window.location.origin).toString();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
            response_type: 'code',
            scope: 'email profile'
          }
        }
      });
      
      if (error) throw error;
      
      if (data.url) {
        sessionStorage.setItem('preAuthPath', window.location.pathname);
        window.location.href = data.url;
        return;
      }
      
      throw new Error('No authentication URL returned');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current URL for proper redirection
      const redirectTo = new URL('/dashboard', window.location.origin).toString();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo,
          queryParams: {
            response_type: 'code',
            scope: 'email,public_profile'
          }
        }
      });
      
      if (error) throw error;
      
      // Handle the OAuth redirect
      if (data.url) {
        // Store the current URL to redirect back after auth
        sessionStorage.setItem('preAuthPath', window.location.pathname);
        
        // Redirect to Google OAuth
        window.location.href = data.url;
        return;
      }
      
      // If we get here without a URL, something went wrong
      throw new Error('No authentication URL returned');
    } catch (err) {
      console.error('Google login error:', err);
      let errorMessage = 'Failed to sign in with Google';
      
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('popup_closed_by_user')) {
          errorMessage = 'Login cancelled. Please try again.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const redirectTo = new URL('/dashboard', window.location.origin).toString();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo,
          queryParams: {
            response_type: 'code',
            scope: 'user:email'
          }
        }
      });

      if (error) throw error;

      if (data.url) {
        sessionStorage.setItem('preAuthPath', window.location.pathname);
        window.location.href = data.url;
        return;
      }

      throw new Error('No authentication URL returned');
    } catch (err) {
      console.error('GitHub login error:', err);
      let errorMessage = 'Failed to sign in with GitHub';

      if (err instanceof Error) {
        if (err.message.includes('popup_closed_by_user')) {
          errorMessage = 'Login cancelled. Please try again.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
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

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
        <p className="text-gray-600 dark:text-gray-400">Sign in to continue to NauticEdge</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-dark-600 rounded focus:ring-blue-500"
              id="remember-me"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </label>
          </div>
          <a href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
            Sign up
          </a>
        </p>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-dark-600 rounded-lg shadow-sm bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            <span className="sr-only">Sign in with Google</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          </button>

          <button
            onClick={handleFacebookLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-dark-600 rounded-lg shadow-sm bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            <span className="sr-only">Sign in with Facebook</span>
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>

          <button
            onClick={handleGithubLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-dark-600 rounded-lg shadow-sm bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            <span className="sr-only">Sign in with GitHub</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;