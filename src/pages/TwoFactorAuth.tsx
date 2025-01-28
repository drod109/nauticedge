import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Check } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import { supabase } from '../lib/supabase';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const TwoFactorAuth = () => {
  const [theme, setCurrentTheme] = useState<Theme>(getInitialTheme());
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const checkMFAStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('user_mfa')
          .select('enabled, backup_codes')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setMfaEnabled(data.enabled);
          setRecoveryCodes(data.backup_codes || []);
        }
      } catch (err) {
        console.error('Error checking MFA status:', err);
        setError('Failed to load MFA status');
      } finally {
        setLoading(false);
      }
    };

    checkMFAStatus();
  }, []);

  const setupMFA = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate new secret and QR code
      const secret = 'ABCDEFGHIJKLMNOP'; // In production, generate this securely
      const otpauthUrl = `otpauth://totp/NauticEdge:${user.email}?secret=${secret}&issuer=NauticEdge`;
      
      // Generate QR code URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`;
      setQrCode(qrUrl);

      // Generate recovery codes
      const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 15).toUpperCase()
      );
      setRecoveryCodes(codes);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    try {
      setVerifying(true);
      setError(null);

      // In production, verify the code with the actual TOTP implementation
      if (verificationCode.length !== 6) {
        throw new Error('Invalid verification code');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update MFA status
      const { error: updateError } = await supabase
        .from('user_mfa')
        .update({
          enabled: true,
          backup_codes: recoveryCodes,
          verified_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setMfaEnabled(true);
      setVerificationCode('');
      setQrCode(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setVerifying(false);
    }
  };

  const disableMFA = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('user_mfa')
        .update({
          enabled: false,
          backup_codes: null,
          verified_at: null
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setMfaEnabled(false);
      setRecoveryCodes([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <nav className="flex items-center space-x-3 text-sm">
                  <a 
                    href="/settings"
                    className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    Back to Settings
                  </a>
                  <span className="text-gray-300 dark:text-gray-600">/</span>
                  <span className="text-gray-900 dark:text-white">Two-Factor Authentication</span>
                </nav>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                <div className="p-6 border-b border-gray-200 dark:border-dark-700">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Two-Factor Authentication</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : mfaEnabled ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-500" />
                          <p className="text-green-700 dark:text-green-400">Two-factor authentication is enabled</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recovery Codes</h3>
                        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {recoveryCodes.map((code, index) => (
                              <div key={index} className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                {code}
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Save these recovery codes in a secure place. You can use them to access your account if you lose access to your authenticator app.
                        </p>
                      </div>

                      <div className="pt-6 border-t border-gray-200 dark:border-dark-700">
                        <button
                          onClick={disableMFA}
                          className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          Disable Two-Factor Authentication
                        </button>
                      </div>
                    </div>
                  ) : qrCode ? (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <img
                          src={qrCode}
                          alt="QR Code"
                          className="w-48 h-48 bg-white rounded-lg shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter 6-digit code"
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => {
                            setQrCode(null);
                            setVerificationCode('');
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={verifyAndEnable}
                          disabled={verifying || verificationCode.length !== 6}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                        >
                          {verifying ? 'Verifying...' : 'Enable 2FA'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-400">
                        Two-factor authentication adds an extra layer of security to your account by requiring a code from your authenticator app in addition to your password.
                      </p>

                      <button
                        onClick={setupMFA}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        Set Up Two-Factor Authentication
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TwoFactorAuth;