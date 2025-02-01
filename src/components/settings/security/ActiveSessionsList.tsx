import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Monitor, LogOut, AlertCircle, Shield, Globe, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import type { UserSession } from '../../../types/auth';
import { Alert, Card, Stack } from '../../../lib/designSystem';
import { performanceMonitor } from '../../../lib/performance';
import { notificationService } from '../../../lib/notifications';

const MAX_SESSIONS = 10; // Maximum number of active sessions to store

const ActiveSessionsList = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      performanceMonitor.startMetric('fetch_sessions');
      
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

      performanceMonitor.endMetric('fetch_sessions');
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load active sessions');
      performanceMonitor.endMetric('fetch_sessions', { error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (sessionId: string) => {
    try {
      setTerminatingSession(sessionId);
      performanceMonitor.startMetric('terminate_session');

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
      
      notificationService.success({
        title: 'Session Terminated',
        message: 'The session has been successfully ended'
      });

      performanceMonitor.endMetric('terminate_session');
    } catch (err) {
      console.error('Error ending session:', err);
      setError('Failed to end session');
      performanceMonitor.endMetric('terminate_session', { error: true });
      
      notificationService.error({
        title: 'Error',
        message: 'Failed to terminate session. Please try again.'
      });
    } finally {
      setTerminatingSession(null);
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
      <div className="flex justify-center py-12">
        <div className="relative">
          <div className="h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-dark-800/90 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <Stack spacing={6}>
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          closeable
          onClose={() => setError(null)}
        />
      )}

      {sessionCount >= MAX_SESSIONS && (
        <Alert
          type="warning"
          title="Session Limit Reached"
          message={`You've reached the maximum number of active sessions (${MAX_SESSIONS}). Older sessions will be automatically ended when new ones are created.`}
          closeable
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <Card
            key={session.id}
            variant="elevated"
            hoverable
            className={`group transition-all duration-300 ${
              session.session_id === currentSessionId
                ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                : ''
            }`}
          >
            <div className="p-6 space-y-4">
              {/* Device Info */}
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
                  </div>
                </div>
                {session.session_id !== currentSessionId && session.is_active && !session.ended_at && (
                  <div className="relative">
                    <button
                      onClick={() => handleLogout(session.id)}
                      disabled={terminatingSession === session.id}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-500 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      {terminatingSession === session.id ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogOut className="h-5 w-5 mr-2" />
                          <span className="whitespace-nowrap">End Session</span>
                        </>
                      )}
                    </button>
                    {terminatingSession === session.id && (
                      <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        Terminating session...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Session Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <div className="flex flex-col">
                    <span>{formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">IP: {session.ip_address || 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <div className="flex flex-col">
                    <span>{session.location?.city}, {session.location?.country}</span>
                   <span className="text-xs text-gray-400 dark:text-gray-500">
                     {session.location?.timezone || 'Unknown timezone'}
                   </span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              {session.session_id === currentSessionId && (
                <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                  <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-300">
                    <Shield className="h-4 w-4" />
                    <span>This is your current active session</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="h-16 w-16 bg-gray-100 dark:bg-dark-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Monitor className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Sessions</h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have any other active sessions at the moment.
          </p>
        </div>
      )}
    </Stack>
  );
};

export default ActiveSessionsList;