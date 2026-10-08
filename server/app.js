import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { validateInquiry } from './validation.js';

export function createApp({ sendInquiry, trustProxy = false, rateLimitMax = 5, logger = console }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }));

  app.post('/api/inquiry',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: rateLimitMax,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      message: { error: 'Too many inquiries. Please wait 15 minutes and try again.' },
    }),
    (req, res, next) => {
      if (!req.is('application/json')) return res.status(415).json({ error: 'Please submit the inquiry as JSON.' });
      next();
    },
    express.json({ limit: '32kb' }),
    async (req, res) => {
      if (req.body?._gotcha) return res.json({ ok: true });
      const result = validateInquiry(req.body);
      if (result.error) return res.status(400).json({ error: result.error });

      try {
        await sendInquiry(result.values);
        return res.json({ ok: true });
      } catch (error) {
        // Do not log submitted personal information, email bodies, or secrets.
        logger.error('Inquiry email delivery failed', { name: error.name });
        return res.status(503).json({ error: 'Your inquiry could not be sent. Please try again shortly.' });
      }
    },
  );

  app.use((error, req, res, next) => {
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Your inquiry is too large.' });
    if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Please submit valid JSON.' });
    logger.error('Inquiry request failed', { name: error.name });
    return res.status(500).json({ error: 'The inquiry could not be processed.' });
  });

  return app;
}
