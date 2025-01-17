import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
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
    <div className="max-w-md w-full mx-auto bg-white dark:bg-dark-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter the verification code from your authenticator app
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            Remaining attempts: {remainingAttempts}
          </p>
        </div>
      )}

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
            className="block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={code.length !== 6 || loading || remainingAttempts === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Lost access to your authenticator app?{' '}
          <button className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
            Use a recovery code
          </button>
        </p>
      </div>
    </div>
  );
};

export default MFAVerification;