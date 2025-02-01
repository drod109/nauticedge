import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Monitor, AlertCircle, CheckCircle2, XCircle, History } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';
import { Alert, Card, Stack } from '../../../lib/designSystem';
import { performanceMonitor } from '../../../lib/performance';
import { notificationService } from '../../../lib/notifications';

const MAX_LOGIN_HISTORY = 50; // Maximum number of login history entries to store

interface LoginAttempt {
  id: string;
  created_at: string;
  success: boolean;
  device_info: {
    type: string;
    browser: string;
    os: string;
  };
  location: {
    city: string;
    country: string;
  };
}

const LoginHistoryList = () => {
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLoginHistory = async () => {
    try {
      performanceMonitor.startMetric('fetch_login_history');
      setLoading(true);
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('login_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(MAX_LOGIN_HISTORY);

      if (fetchError) throw fetchError;
      
      // Sort and limit login history entries
      const sortedAttempts = (data || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, MAX_LOGIN_HISTORY);

      setAttempts(sortedAttempts);

      // Clean up old entries if we have more than the maximum
      if (data && data.length > MAX_LOGIN_HISTORY) {
        const oldAttempts = data.slice(MAX_LOGIN_HISTORY);
        for (const attempt of oldAttempts) {
          await supabase
            .from('login_attempts')
            .delete()
            .eq('id', attempt.id);
        }
      }

      performanceMonitor.endMetric('fetch_login_history');
    } catch (err) {
      console.error('Error fetching login history:', err);
      setError('Failed to load login history');
      performanceMonitor.endMetric('fetch_login_history', { error: true });
      
      notificationService.error({
        title: 'Error',
        message: 'Failed to load login history'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
      case 'tablet':
        return <Laptop className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
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

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          For security purposes, we store up to {MAX_LOGIN_HISTORY} most recent login attempts.
          Older entries are automatically removed.
        </p>
      </div>

      <div className="space-y-4">
        {attempts.map((attempt) => (
          <Card
            key={attempt.id}
            variant="elevated"
            hoverable
            className="group transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    attempt.success
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {getDeviceIcon(attempt.device_info?.type || 'desktop')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {attempt.device_info?.browser} on {attempt.device_info?.os}
                      </p>
                      {attempt.success ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Failed
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{format(new Date(attempt.created_at), 'MMM d, yyyy HH:mm:ss')}</span>
                      <span>•</span>
                      <span>{attempt.location?.city}, {attempt.location?.country}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {attempts.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gray-100 dark:bg-dark-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <History className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Login History</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Your login activity will appear here
            </p>
          </div>
        )}
      </div>
    </Stack>
  );
};

export default LoginHistoryList;