import { Router } from 'express';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { validateToken } from '../middleware/auth';
import { validateSubscription } from '../middleware/validateSubscription';
import { APIError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validation schemas
const analyzeSchema = z.object({
  surveyId: z.string().uuid(),
  content: z.string().min(1).max(10000),
  analysisType: z.enum(['risk', 'recommendations', 'compliance'])
});

// Analyze survey content using AI
router.post('/analyze', validateToken, validateSubscription(['professional', 'enterprise']), async (req, res, next) => {
  try {
    const { surveyId, content, analysisType } = analyzeSchema.parse(req.body);

    logger.info({
      message: 'Starting AI analysis',
      userId: req.user.id,
      surveyId,
      analysisType
    });

    const prompt = `Analyze the following marine survey content for ${analysisType}:\n\n${content}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4-turbo-preview",
    });

    const analysis = completion.choices[0].message.content;

    // Store analysis result
    const { error } = await supabase
      .from('survey_analyses')
      .insert([
        {
          survey_id: surveyId,
          analysis_type: analysisType,
          content: analysis,
          user_id: req.user.id
        }
      ]);

    if (error) {
      logger.error({
        message: 'Failed to store analysis',
        userId: req.user.id,
        surveyId,
        error: error.message
      });
      throw new APIError(400, 'Failed to store analysis');
    }

    logger.info({
      message: 'AI analysis completed successfully',
      userId: req.user.id,
      surveyId,
      analysisType
    });

    res.json({ data: { analysis } });
  } catch (error) {
    logger.error({
      message: 'AI analysis failed',
      userId: req.user?.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    next(error);
  }
});

export default router;