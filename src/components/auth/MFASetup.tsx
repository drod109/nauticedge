import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, Shield, Copy, Check } from 'lucide-react';
import { initializeMFASetup, completeMFASetup } from '../../lib/mfa';

interface MFASetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<{
    secret: string;
    recoveryCodes: string[];
    otpauthUrl: string;
  } | null>(null);
  
  useEffect(() => {
    const setup = async () => {
      try {
        const data = await initializeMFASetup();
        setSetupData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize MFA setup');
      }
    };
    setup();
  }, []);
  
  const copySecretKey = () => {
    if (setupData) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData || verificationCode.length !== 6) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await completeMFASetup(verificationCode);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-lg">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enable Two-Factor Authentication</h2>
            <p className="text-gray-600">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Smartphone className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Use an authenticator app</h3>
                <p className="text-sm text-gray-500">
                  We recommend using Microsoft Authenticator or Google Authenticator
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={onSkip}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Skip for now
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <QrCode className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h2>
            <p className="text-gray-600">
              Scan this QR code with your authenticator app
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              {setupData && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    setupData.otpauthUrl
                  )}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={setupData?.secret || ''}
                  readOnly
                  className="flex-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-l-lg text-gray-900 sm:text-sm"
                />
                <button
                  onClick={copySecretKey}
                  className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleVerification}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={verificationCode.length !== 6 || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify and Enable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFASetup;