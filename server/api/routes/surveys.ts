import { Router } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { APIError } from '../middleware/errorHandler';
import { validateToken } from '../middleware/auth';
import { validateSubscription } from '../middleware/validateSubscription';
import { logger } from '../utils/logger';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Validation schemas
const surveySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  vesselName: z.string().min(1).max(100),
  surveyType: z.enum(['annual', 'condition', 'damage', 'pre-purchase']),
  scheduledDate: z.string().datetime(),
  location: z.string().min(1).max(200)
});

// Get all surveys for authenticated user
router.get('/', validateToken, validateSubscription(['professional', 'enterprise']), async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error({
        message: 'Failed to fetch surveys',
        userId: req.user.id,
        error: error.message
      });
      throw new APIError(400, 'Failed to fetch surveys');
    }

    logger.info({
      message: 'Surveys fetched successfully',
      userId: req.user.id,
      count: data?.length || 0
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

// Create new survey
router.post('/', validateToken, validateSubscription(['professional', 'enterprise']), async (req, res, next) => {
  try {
    const surveyData = surveySchema.parse(req.body);

    const { data, error } = await supabase
      .from('surveys')
      .insert([
        {
          ...surveyData,
          user_id: req.user.id,
          status: 'draft'
        }
      ])
      .select()
      .single();

    if (error) {
      logger.error({
        message: 'Failed to create survey',
        userId: req.user.id,
        error: error.message,
        surveyData
      });
      throw new APIError(400, 'Failed to create survey');
    }

    logger.info({
      message: 'Survey created successfully',
      userId: req.user.id,
      surveyId: data?.id
    });

    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
});

// Get survey by ID
router.get('/:id', validateToken, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) {
      throw new APIError(404, 'Survey not found');
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

export default router;