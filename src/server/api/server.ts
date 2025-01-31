import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

// Security headers configuration
const securityHeaders = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "https://api.supabase.io", "wss://realtime-*.supabase.co"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
};

import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import surveysRouter from './routes/surveys';
import aiRouter from './routes/ai';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet(securityHeaders));
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  credentials: true,
  maxAge: 600
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// Routes
app.use('/api/v1/surveys', surveysRouter);
app.use('/api/v1/ai', aiRouter);

// Real-time updates
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('subscribe', async (surveyId) => {
    socket.join(`survey:${surveyId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});