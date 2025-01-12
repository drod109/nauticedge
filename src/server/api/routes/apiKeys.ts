import { Router } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { validateToken } from '../middleware/auth';
import { validateSubscription } from '../middleware/validateSubscription';
import { APIError } from '../middleware/errorHandler';
import crypto from 'crypto';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Validation schemas
const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.string()),
  expiresIn: z.number().optional() // Days until expiration
});

// Create new API key
router.post(
  '/',
  validateToken,
  validateSubscription(['professional', 'enterprise']),
  async (req, res, next) => {
    try {
      const { name, scopes, expiresIn } = createApiKeySchema.parse(req.body);

      // Generate API key
      const apiKey = crypto.randomBytes(32).toString('hex');
      const keyHash = crypto
        .createHash('sha256')
        .update(apiKey)
        .digest('hex');

      const expiresAt = expiresIn
        ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
        : null;

      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            user_id: req.user.id,
            name,
            key_hash: keyHash,
            scopes,
            expires_at: expiresAt
          }
        ])
        .select()
        .single();

      if (error) {
        throw new APIError(400, 'Failed to create API key');
      }

      // Only return the actual API key once
      res.json({
        data: {
          ...data,
          key: apiKey // This is the only time the actual key will be shown
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// List API keys
router.get(
  '/',
  validateToken,
  validateSubscription(['professional', 'enterprise']),
  async (req, res, next) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, scopes, created_at, expires_at, last_used_at')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new APIError(400, 'Failed to fetch API keys');
      }

      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
);

// Delete API key
router.delete(
  '/:id',
  validateToken,
  validateSubscription(['professional', 'enterprise']),
  async (req, res, next) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);

      if (error) {
        throw new APIError(400, 'Failed to delete API key');
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;