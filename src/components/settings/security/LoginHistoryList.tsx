import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Monitor, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';

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
  const [locationLoading, setLocationLoading] = useState<{ [key: string]: boolean }>({});
  const [locations, setLocations] = useState<{ [key: string]: { city: string; country: string } }>({});

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLocationDetails = async (attempt: LoginAttempt) => {
    if (!attempt.device_info?.location?.city || !attempt.device_info?.location?.country) {
      return;
    }

    // Use the stored location data directly
    setLocations(prev => ({
      ...prev,
      [attempt.id]: {
        city: attempt.device_info.location.city,
        country: attempt.device_info.location.country
      }
    }));
  };

  const fetchLoginHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('mfa_verification_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      
      // Fetch location details for each attempt
      if (data) {
        data.forEach(attempt => {
          fetchLocationDetails(attempt);
        });
      }
      setAttempts(data || []);
    } catch (err) {
      console.error('Error fetching login history:', err);
      setError('Failed to load login history');
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
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden border border-gray-200 dark:border-dark-700 divide-y divide-gray-200 dark:divide-dark-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800">
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div>{format(new Date(attempt.created_at), 'MMM d, yyyy')}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {format(new Date(attempt.created_at), 'HH:mm:ss')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getDeviceIcon(attempt.device_info?.type || 'desktop')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {attempt.device_info?.browser}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {attempt.device_info?.os}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {attempt.device_info?.location?.city && attempt.device_info?.location?.country
                    ? `${attempt.device_info.location.city}, ${attempt.device_info.location.country}`
                    : 'Location unavailable'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {attempt.success ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400">
                      <XCircle className="h-4 w-4 mr-1" />
                      Failed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginHistoryList;