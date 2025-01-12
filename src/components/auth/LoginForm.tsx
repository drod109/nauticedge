import React, { useState } from 'react';
import { Mail, Lock, Shield } from 'lucide-react';
import MFAVerification from './MFAVerification';

const LoginForm = () => {
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('1234');
  const [showMFAVerification, setShowMFAVerification] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if user has MFA enabled
    const hasMFA = true; // This would come from your backend
    if (hasMFA) {
      setShowMFAVerification(true);
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleMFAVerify = (code: string) => {
    // Verify MFA code with backend
    console.log('Verifying MFA code:', code);
    window.location.href = '/dashboard';
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google authentication
    window.location.href = '/dashboard';
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
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-blue-600" id="remember" />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
          </div>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
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
      </div>
    </div>
  );
};

export default LoginForm;