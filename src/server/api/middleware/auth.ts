import { Request, Response, NextFunction } from 'express';
import { auth } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check user's subscription plan
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (!subscription || !['professional', 'enterprise'].includes(subscription.plan)) {
      return res.status(403).json({ error: 'This API is only available for Professional and Enterprise plans' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};