import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MFASetup from './MFASetup';

interface MFAManagementProps {
  onClose: () => void;
}

const MFAManagement: React.FC<MFAManagementProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mfaData, setMfaData] = useState<{
    enabled: boolean;
    verified_at: string | null;
    last_used_at: string | null;
    backup_codes: string[] | null;
  } | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);

  useEffect(() => {
    fetchMFAStatus();
  }, []);

  const fetchMFAStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_mfa')
        .select('enabled, verified_at, last_used_at')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setMfaData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load MFA status');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    try {
      setDisableLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First, verify user has MFA enabled
      const { data: mfaSettings } = await supabase
        .from('user_mfa')
        .select('id')
        .eq('user_id', user.id)
        .eq('enabled', true)
        .single();

      if (!mfaSettings) {
        throw new Error('MFA is not enabled');
      }

      const { error } = await supabase
        .from('user_mfa')
        .update({ 
          enabled: false,
          backup_codes: null,
          secret: null,
          verified_at: null,
          last_used_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Clean up any temporary MFA data
      await supabase
        .from('mfa_temp')
        .delete()
        .eq('user_id', user.id);
      await fetchMFAStatus();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable MFA');
    } finally {
      setDisableLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    fetchMFAStatus();
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <MFASetup
        onComplete={handleSetupComplete}
        onSkip={() => setShowSetup(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl max-w-md w-full my-8">
        <div className="flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white">Two-Factor Authentication</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Enhance your account security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

          <div className="p-6 space-y-8">
          {/* Status Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white/80 dark:bg-dark-800/80 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                <span>Recovery Codes:</span>
                <span>{mfaData?.backup_codes?.length || 0} remaining</span>
                </div>
                </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Active
              </span>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-dark-700/50">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Last Verification</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mfaData?.last_used_at
                  ? new Date(mfaData.last_used_at).toLocaleString()
                  : 'Never used'}
              </p>
            </div>
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-dark-700/50">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recovery Codes</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mfaData?.backup_codes?.length || 0} unused codes
              </p>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-yellow-50/50 dark:bg-yellow-900/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-200/50 dark:border-yellow-800/50">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-3">Security Tips</h4>
            <ul className="space-y-2">
              <li className="flex items-start text-sm text-yellow-700 dark:text-yellow-300">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                Store your recovery codes in a secure location
              </li>
              <li className="flex items-start text-sm text-yellow-700 dark:text-yellow-300">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                Never share your 2FA codes with anyone
              </li>
            </ul>
          </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-dark-700 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDisableMFA}
              disabled={disableLoading}
              className="relative group px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative flex items-center justify-center">
                {disableLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Disable 2FA'
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFAManagement;