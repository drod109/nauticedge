import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { APIError } from './errorHandler';
import { logger } from '../utils/logger';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const validateSubscription = (requiredPlans: ['professional', 'enterprise']) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user from auth middleware
      if (!req.user?.id) {
        throw new APIError(401, 'Authentication required');
      }

      // Check subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', req.user?.id)
        .single();

      if (!subscription) {
        throw new APIError(403, 'This feature requires a Professional or Enterprise subscription');
      }

      if (subscription.status !== 'active') {
        throw new APIError(403, 'Subscription is not active');
      }

      if (!requiredPlans.includes(subscription.plan as 'professional' | 'enterprise')) {
        throw new APIError(
          403,
          'This feature requires a Professional or Enterprise subscription'
        );
      }

      // Log API access
      logger.info({
        message: 'API access granted',
        userId: req.user.id,
        plan: subscription.plan,
        path: req.path
      });
      next();
    } catch (error) {
      logger.error({
        message: 'API access denied',
        userId: req.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        path: req.path
      });
      next(error);
    }
  };
};