import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

interface SubscriptionError extends Error {
  code?: string;
}

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SubscriptionError | null>(null);

  const changePlan = useCallback(async (newPlan: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        const error = new Error('Please sign in to change your subscription plan');
        logger.error('No session found', { error });
        throw error;
      }

      logger.info('Changing subscription plan', { newPlan });

      // Validate plan name
      if (!['basic', 'professional', 'enterprise'].includes(newPlan)) {
        const error = new Error('Invalid subscription plan selected');
        logger.error('Invalid plan', { error, newPlan });
        throw error;
      }

      // Get current subscription
      const { data: currentSub, error: subError } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', session.user.id)
        .single();

      if (subError) {
        const error = new Error('Unable to verify current subscription');
        logger.error('Subscription verification failed', { error: subError });
        throw error;
      }

      // If subscription exists, check if it's the same plan
      if (currentSub && currentSub.plan.toLowerCase() === newPlan.toLowerCase()) {
        const error = new Error('Already subscribed to this plan');
        logger.error('Duplicate plan change attempt', { currentPlan: currentSub.plan, newPlan });
        throw error;
      }

      const now = new Date();
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Use upsert to handle both new subscriptions and updates
      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: session.user.id,
          plan: newPlan,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        const error = new Error('Failed to update subscription');
        logger.error('Subscription update failed', { error: upsertError });
        throw error;
      }

      logger.info('Successfully changed subscription plan', { newPlan });
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unexpected error occurred');
      setError(error as SubscriptionError);
      logger.error('Error in changePlan', { error: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    changePlan
  };
}