import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler, notFoundHandler } from './common/middleware/error-handler';
import { requestLogger } from './common/middleware/request-logger';
import { apiRateLimit } from './common/middleware/rate-limit';
import { sanitizeBody } from './common/middleware/sanitize';
import { adminRouter } from './modules/admin';
import { apiRouter } from './modules';

export const app = express();

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(requestLogger);
app.use(apiRateLimit);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(sanitizeBody);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ok' });
});
app.get('/', (_req, res) => {
  res.send('Backend running 🚀');
});
app.use('/api', apiRouter);
app.use('/admin', adminRouter);
app.use(notFoundHandler);
app.use(errorHandler);
