import { Router } from 'express';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { validateToken } from '../middleware/auth';
import { APIError } from '../middleware/errorHandler';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validation schemas
const analyzeSchema = z.object({
  surveyId: z.string().uuid(),
  content: z.string().min(1).max(10000),
  analysisType: z.enum(['risk', 'recommendations', 'compliance'])
});

// Analyze survey content using AI
router.post('/analyze', validateToken, async (req, res, next) => {
  try {
    const { surveyId, content, analysisType } = analyzeSchema.parse(req.body);

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

    if (error) throw new APIError(400, 'Failed to store analysis');

    res.json({ data: { analysis } });
  } catch (error) {
    next(error);
  }
});

export default router;