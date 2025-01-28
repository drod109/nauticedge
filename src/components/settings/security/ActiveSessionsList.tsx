import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Monitor, LogOut, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import type { UserSession } from '../../../types/auth';

const MAX_SESSIONS = 10; // Maximum number of active sessions to store

const ActiveSessionsList = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setCurrentSessionId(session.access_token);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', session.user.id);

      if (sessionsError) throw sessionsError;
      
      // Filter active sessions and sort by most recent
      const activeSessions = (sessionsData || [])
        .filter(s => s.is_active)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, MAX_SESSIONS); // Keep only the most recent sessions

      setSessions(activeSessions);
      setSessionCount(activeSessions.length);

      // If we have more than MAX_SESSIONS active sessions, end the oldest ones
      if (activeSessions.length > MAX_SESSIONS) {
        const oldestSessions = activeSessions.slice(MAX_SESSIONS);
        for (const oldSession of oldestSessions) {
          await handleLogout(oldSession.id);
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load active sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Refresh sessions list
      await fetchSessions();
    } catch (err) {
      console.error('Error ending session:', err);
      setError('Failed to end session');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-500" />;
      case 'tablet':
        return <Laptop className="h-5 w-5 text-blue-600 dark:text-blue-500" />;
      default:
        return <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sessionCount >= MAX_SESSIONS && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              You've reached the maximum number of active sessions ({MAX_SESSIONS}). 
              Older sessions will be automatically ended when new ones are created.
            </p>
          </div>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group bg-white dark:bg-dark-800 rounded-xl border ${
              session.session_id === currentSessionId
                ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20'
                : 'border-gray-200/50 dark:border-dark-700/50'
            } p-6 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  session.session_id === currentSessionId
                    ? 'bg-blue-100 dark:bg-blue-900/40'
                    : 'bg-gray-100 dark:bg-dark-700'
                }`}>
                  {getDeviceIcon(session.device_info?.type || 'desktop')}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.device_info?.browser} on {session.device_info?.os}
                    </p>
                    {session.session_id === currentSessionId && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}</span>
                    <span>•</span>
                    <span>{session.location?.city}, {session.location?.country}</span>
                  </div>
                </div>
              </div>
              {session.session_id !== currentSessionId && (
                <button
                  onClick={() => handleLogout(session.id)}
                  className="flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  End Session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveSessionsList;