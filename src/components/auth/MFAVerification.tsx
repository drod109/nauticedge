import React, { useState, useEffect } from 'react';
import { Shield, X, ArrowRight } from 'lucide-react';
import { verifyMFALogin } from '../../lib/mfa';

interface MFAVerificationProps {
  onVerify: (code: string) => void;
  onCancel: () => void;
}

const MFAVerification: React.FC<MFAVerificationProps> = ({ onVerify, onCancel }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || loading) return;

    setLoading(true);
    setError(null);

    try {
      const verified = await verifyMFALogin(code);
      if (verified) {
        onVerify(code);
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
      setRemainingAttempts(prev => prev - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Verify Your Identity</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Enter the code from your authenticator app</p>
            </div>
          </div>
          <button
            onClick={onCancel} 
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Remaining attempts: {remainingAttempts}
            </p>
          </div>
        )}

        <div className="p-6 space-y-8">
          {/* Security Tips */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-white/80 dark:bg-dark-800/80 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Security Check</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Protecting your account with 2FA</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Open your authenticator app and enter the 6-digit code displayed for NauticEdge.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="block w-full px-4 py-3 text-center text-2xl tracking-[1em] border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white dark:hover:bg-dark-800"
                autoFocus
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-dark-700 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={code.length !== 6 || loading || remainingAttempts === 0}
            className="relative group w-full sm:w-auto"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative px-4 py-2 bg-white dark:bg-dark-800 rounded-lg leading-none flex items-center justify-center space-x-2">
              {loading ? (
                <div className="h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-blue-600 dark:text-blue-400">Verify & Continue</span>
                  <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MFAVerification;