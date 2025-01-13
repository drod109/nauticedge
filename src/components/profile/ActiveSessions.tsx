import React from 'react';
import { LogOut, Smartphone, Laptop, Monitor } from 'lucide-react';
import type { UserSession } from '../../types/auth';

interface ActiveSessionsProps {
  sessions: UserSession[];
  currentSessionId: string | null;
  onLogoutSession: (sessionId: string) => void;
}

const ActiveSessions = ({ sessions, currentSessionId, onLogoutSession }: ActiveSessionsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>
          <p className="mt-1 text-sm text-gray-500">
            We'll alert you via email if there is any unusual activity on your account
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className={`flex items-center justify-between p-4 ${
            session.session_id === currentSessionId ? 'bg-blue-50 border border-blue-100' : 'border border-gray-200'
          } rounded-lg`}>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {session.device_info?.type === 'mobile' ? (
                  <Smartphone className="h-5 w-5 text-blue-600" />
                ) : session.device_info?.type === 'tablet' ? (
                  <Laptop className="h-5 w-5 text-blue-600" />
                ) : (
                  <Monitor className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {session.device_info?.browser && session.device_info?.os
                    ? `${session.device_info.browser} on ${session.device_info.os}`
                    : 'Unknown Device'}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(session.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {new Date(session.created_at).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} · {session.location?.city}, {session.location?.country}
                </p>
              </div>
            </div>
            {session.session_id === currentSessionId ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active Now
              </span>
            ) : (
              <button
                onClick={() => onLogoutSession(session.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
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