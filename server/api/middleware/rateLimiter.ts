import rateLimit from 'express-rate-limit';

// Different rate limits for different plans
const RATE_LIMITS = {
  professional: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  enterprise: {
    windowMs: 15 * 60 * 1000,
    max: 500
  }
};

export const createRateLimiter = (plan: 'professional' | 'enterprise') => {
  const limits = RATE_LIMITS[plan];
  
  return rateLimit({
    windowMs: limits.windowMs,
    max: limits.max,
    message: {
      error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};