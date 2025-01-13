import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
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
  } | null>(null);
  const [showSetup, setShowSetup] = useState(false);

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
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_mfa')
        .update({ 
          enabled: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchMFAStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable MFA');
    } finally {
      setLoading(false);
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
    <div className="p-8 max-w-2xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  {mfaData?.enabled
                    ? `Last verified ${mfaData.last_used_at 
                        ? new Date(mfaData.last_used_at).toLocaleDateString()
                        : 'never'}`
                    : 'Add an extra layer of security to your account'}
                </p>
              </div>
            </div>
            {mfaData?.enabled ? (
              <button
                onClick={handleDisableMFA}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                Disable
              </button>
            ) : (
              <button
                onClick={() => setShowSetup(true)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {mfaData?.enabled && (
          <div className="p-6 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Security Status</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">MFA Status</p>
                  <p className="text-sm text-gray-500">Two-factor authentication is enabled</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Verification</p>
                  <p className="text-sm text-gray-500">
                    {mfaData.last_used_at
                      ? new Date(mfaData.last_used_at).toLocaleString()
                      : 'Never used'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Enabled On</p>
                  <p className="text-sm text-gray-500">
                    {mfaData.verified_at
                      ? new Date(mfaData.verified_at).toLocaleString()
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MFAManagement;