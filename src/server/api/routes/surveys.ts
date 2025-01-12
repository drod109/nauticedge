import { Router } from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { APIError } from '../middleware/errorHandler';
import { validateToken } from '../middleware/auth';

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
router.get('/', validateToken, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new APIError(400, 'Failed to fetch surveys');

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

// Create new survey
router.post('/', validateToken, async (req, res, next) => {
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

    if (error) throw new APIError(400, 'Failed to create survey');

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