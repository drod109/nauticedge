import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Monitor, LogOut, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import type { UserSession } from '../../../types/auth';

const ActiveSessionsList = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

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
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
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
      setShowConfirmDialog(false);
      setSelectedSession(null);
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
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {sessions.map((session) => (
        <div
          key={session.id}
          className={`p-4 rounded-lg border ${
            session.session_id === currentSessionId
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                {getDeviceIcon(session.device_info?.type || 'desktop')}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.device_info?.browser} on {session.device_info?.os}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })} · {session.location?.city}, {session.location?.country}
                </p>
              </div>
            </div>
            {session.session_id === currentSessionId ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                Current Session
              </span>
            ) : (
              <button
                onClick={() => {
                  setSelectedSession(session.id);
                  setShowConfirmDialog(true);
                }}
                className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  End Session
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to end this session? The user will be logged out from this device.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setSelectedSession(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLogout(selectedSession)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSessionsList;