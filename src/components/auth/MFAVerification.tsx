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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1b2838] rounded-xl shadow-2xl max-w-md w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-900/20 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Two-Factor Authentication</h2>
              <p className="mt-1 text-sm text-gray-400">Enter the verification code from your authenticator app</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Remaining attempts: {remainingAttempts}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2.5 bg-[#2a3f5a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-[#344863]"
              autoFocus
            />
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-[#2a3f5a] rounded-lg hover:bg-[#344863] transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#1b2838]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={code.length !== 6 || loading || remainingAttempts === 0}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1b2838]"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lost access to your authenticator app?{' '}
            <button className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
              Use a recovery code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MFAVerification;