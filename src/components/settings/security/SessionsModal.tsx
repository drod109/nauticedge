import React from 'react';
import { X } from 'lucide-react';
import ActiveSessionsList from './ActiveSessionsList';
import LoginHistoryList from './LoginHistoryList';

interface SessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'sessions' | 'history';
  onTabChange: (tab: 'sessions' | 'history') => void;
}

const SessionsModal: React.FC<SessionsModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 overflow-hidden">
      <div className="bg-white dark:bg-dark-800 rounded-none sm:rounded-xl shadow-xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col">
        <div className="sticky top-0 z-10 bg-white dark:bg-dark-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700 rounded-t-none sm:rounded-t-xl">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {activeTab === 'sessions' ? 'Active Sessions' : 'Login History'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'sessions' 
                ? 'Manage your active login sessions across different devices'
                : 'Review your recent login activity'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => onTabChange('sessions')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'sessions'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Active Sessions
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Login History
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          {activeTab === 'sessions' ? <ActiveSessionsList /> : <LoginHistoryList />}
        </div>
        
        <div className="sticky bottom-0 z-10 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 p-4 rounded-b-none sm:rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionsModal;