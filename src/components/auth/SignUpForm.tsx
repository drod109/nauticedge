import React, { useState } from 'react';
import { Mail, Lock, User2, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!acceptTerms) {
        throw new Error('You must accept the Terms and Privacy Policy to create an account');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Add retry logic for network issues
      const maxRetries = 3;
      let retryCount = 0;
      let lastError = null;

      while (retryCount < maxRetries) {
        try {
          const fullName = `${firstName} ${lastName}`.trim();

          const { data, error: signUpError } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/login`,
              data: {
                full_name: fullName
              }
            }
          });

          if (signUpError) throw signUpError;
          if (!data.user) throw new Error('No user data returned');

          // Check if user was created successfully
          if (data.user.identities?.length === 0) {
            throw new Error('This email is already registered. Please sign in instead.');
          }

          // Success - redirect to login
          window.location.href = '/login';
          return;
        } catch (err) {
          lastError = err;
          if (err instanceof Error && !err.message.includes('network')) {
            throw err; // Don't retry non-network errors
          }
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          }
        }
      }
      throw new Error('Failed to sign up after multiple attempts. Please check your connection and try again.');
    } catch (err) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        switch (err.name) {
          case 'AuthApiError':
            if (err.message.includes('already registered')) {
              setError('This email is already registered. Please sign in instead.');
            } else {
              setError(err.message || 'Failed to create account. Please try again.');
            }
            break;
          case 'AuthRetryableFetchError':
            setError('Network error. Please check your connection and try again.');
            break;
          default:
            setError(err.message || 'An unexpected error occurred. Please try again.');
        }
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      const redirectTo = new URL('/registration', window.location.origin).toString();

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
      console.error('Google signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current URL for proper redirection
      const redirectTo = new URL('/registration', window.location.origin).toString();

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
      console.error('Google signup error:', err);
      let errorMessage = 'Failed to sign up with Google';
      
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('popup_closed_by_user')) {
          errorMessage = 'Sign up cancelled. Please try again.';
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

  const handleGithubSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      const redirectTo = new URL('/registration', window.location.origin).toString();

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
      console.error('GitHub signup error:', err);
      let errorMessage = 'Failed to sign up with GitHub';

      if (err instanceof Error) {
        if (err.message.includes('popup_closed_by_user')) {
          errorMessage = 'Sign up cancelled. Please try again.';
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

  return (
    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-dark-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Create your account</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Join NauticEdge and transform your marine survey operations</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl animate-fade-in">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
            <div className="relative">
              <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="First name"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
            <div className="relative">
              <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Last name"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Create a password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Must be at least 6 characters long
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Confirm your password"
              required
              minLength={6}
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

        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 focus:ring-offset-0 border-gray-300 dark:border-dark-600 rounded transition-colors"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
            By signing up you have agreed to our{' '}
            <a href="/terms" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Terms</a>
            {' '}& {' '}
            <a href="/privacy" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
          </label>
        </div>

        <div className="relative group">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !acceptTerms}
            className="relative w-full group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-400 group-hover:from-blue-400 group-hover:to-blue-600 rounded-lg"></span>
            <div className="relative w-full px-7 py-4 rounded-lg leading-none flex items-center justify-center space-x-2">
              {loading ? (
                <div className="h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-white">Create Account</span>
                  <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/50 dark:border-dark-600/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/80 dark:bg-dark-800/80 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Google', onClick: handleGoogleSignup, icon: 'google' },
            { name: 'Facebook', onClick: handleFacebookSignup, icon: 'facebook' },
            { name: 'GitHub', onClick: handleGithubSignup, icon: 'github' }
          ].map((provider) => (
            <button
              key={provider.name}
              onClick={provider.onClick}
              disabled={loading}
              className="w-full px-6 py-3 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center justify-center"
            >
                {provider.icon === 'google' && (
                  <svg className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
                )}
                {provider.icon === 'facebook' && (
                  <svg className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                {provider.icon === 'github' && (
                  <svg className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                )}
                <span className="text-gray-700 dark:text-gray-300">Continue with {provider.name}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            Sign in <ArrowRight className="inline-block h-4 w-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;