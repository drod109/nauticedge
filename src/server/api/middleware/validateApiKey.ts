import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { APIError } from './errorHandler';
import { logger } from '../utils/logger';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      throw new APIError(401, 'API key is required');
    }

    // Get API key from database
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select('id, user_id, scopes, expires_at')
      .eq('key_hash', apiKey)
      .single();

    if (error || !keyData) {
      throw new APIError(401, 'Invalid API key');
    }

    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      throw new APIError(401, 'API key has expired');
    }

    // Update last used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyData.id);

    // Log API usage
    const startTime = process.hrtime();

    res.on('finish', async () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const responseTime = seconds * 1000 + nanoseconds / 1000000;

      await supabase.from('api_usage').insert({
        user_id: keyData.user_id,
        api_key_id: keyData.id,
        endpoint: req.path,
        method: req.method,
        status_code: res.statusCode,
        response_time: Math.round(responseTime)
      });
    });

    req.user = { id: keyData.user_id };
    req.apiKey = {
      id: keyData.id,
      scopes: keyData.scopes
    };

    next();
  } catch (error) {
    next(error);
  }
};