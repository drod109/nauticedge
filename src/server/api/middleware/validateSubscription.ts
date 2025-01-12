import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { APIError } from './errorHandler';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const validateSubscription = (allowedPlans: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', req.user.id)
        .single();

      if (!subscription) {
        throw new APIError(403, 'No active subscription found');
      }

      if (subscription.status !== 'active') {
        throw new APIError(403, 'Subscription is not active');
      }

      if (!allowedPlans.includes(subscription.plan)) {
        throw new APIError(
          403,
          `This feature is only available for ${allowedPlans.join(', ')} plans`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};