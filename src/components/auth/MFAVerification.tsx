import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface MFAVerificationProps {
  onVerify: (code: string) => void;
  onCancel: () => void;
}

const MFAVerification: React.FC<MFAVerificationProps> = ({ onVerify, onCancel }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600">
          Enter the verification code from your authenticator app
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={code.length !== 6}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify
          </button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Lost access to your authenticator app?{' '}
          <button className="text-blue-600 hover:text-blue-700">
            Use a recovery code
          </button>
        </p>
      </div>
    </div>
  );
};

export default MFAVerification;