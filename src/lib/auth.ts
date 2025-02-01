import { supabase } from './supabase';
import { logger } from './logger';
import { performanceMonitor } from './performance';
import { notificationService } from './notifications';

export const MAX_LOGIN_HISTORY = 50;

interface LoginHistoryEntry {
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

/**
 * Fetches a user's login history with pagination and sorting
 * @returns Promise<LoginHistoryEntry[]>
 */
export async function fetchLoginHistory(): Promise<LoginHistoryEntry[]> {
  try {
    performanceMonitor.startMetric('fetch_login_history');

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('Not authenticated');

    // Query login history
    const { data, error: fetchError } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(MAX_LOGIN_HISTORY);

    if (fetchError) throw fetchError;

    // Clean up old entries if we have more than the maximum
    if (data && data.length > MAX_LOGIN_HISTORY) {
      const oldEntries = data.slice(MAX_LOGIN_HISTORY);
      for (const entry of oldEntries) {
        await supabase
          .from('login_attempts')
          .delete()
          .eq('id', entry.id);
      }
    }

    performanceMonitor.endMetric('fetch_login_history');
    
    logger.info('Login history fetched successfully', {
      userId: user.id,
      entriesCount: data?.length || 0
    });

    return data || [];
  } catch (error) {
    performanceMonitor.endMetric('fetch_login_history', { error: true });
    
    const message = error instanceof Error ? error.message : 'Failed to fetch login history';
    logger.error('Error fetching login history', { error: message });
    
    notificationService.error({
      title: 'Error',
      message: 'Failed to load login history'
    });
    
    throw error;
  }
}