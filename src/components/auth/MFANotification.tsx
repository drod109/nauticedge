import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MFANotificationProps {
  onSetup: () => void;
  onDismiss: () => void;
}

const MFANotification: React.FC<MFANotificationProps> = ({ onSetup, onDismiss }) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const checkMFAStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('user_mfa')
          .select('enabled')
          .eq('user_id', user.id)
          .single();

        // Only show notification if MFA is not enabled
        setShouldShow(!data?.enabled);
      } catch (error) {
        console.error('Error checking MFA status:', error);
      }
    };

    checkMFAStatus();
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 p-4 z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-500" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Enhance Your Account Security
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enable two-factor authentication to better protect your account
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={onSetup}
              className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Set up now
            </button>
            <button
              onClick={onDismiss}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400"
            >
              Remind me later
            </button>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onDismiss}
            className="bg-white dark:bg-dark-800 rounded-md inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MFANotification;