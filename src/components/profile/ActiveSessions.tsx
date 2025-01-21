import React from 'react';
import { LogOut, Smartphone, Laptop, Monitor } from 'lucide-react';
import type { UserSession } from '../../types/auth';
import { formatDistanceToNow } from 'date-fns';

interface ActiveSessionsProps {
  sessions: UserSession[];
  currentSessionId: string | null;
  onLogoutSession: (sessionId: string) => void;
}

const ActiveSessions = ({ sessions, currentSessionId, onLogoutSession }: ActiveSessionsProps) => {
  // Filter and sort sessions to get current and last session
  const filteredSessions = sessions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We'll alert you via email if there is any unusual activity on your account
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <div key={session.id} className={`flex items-center justify-between p-4 ${
            session.session_id === currentSessionId 
              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' 
              : 'border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800'
          } rounded-lg transition-colors`}>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                {session.device_info?.type === 'mobile' ? (
                  <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                ) : session.device_info?.type === 'tablet' ? (
                  <Laptop className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                ) : (
                  <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.device_info?.browser && session.device_info?.os
                    ? `${session.device_info.browser} on ${session.device_info.os}`
                    : 'Unknown Device'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })} · {session.location?.city}, {session.location?.country}
                </p>
              </div>
            </div>
            {session.session_id === currentSessionId ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                Active Now
              </span>
            ) : (
              <button
                onClick={() => onLogoutSession(session.id)}
                className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveSessions;