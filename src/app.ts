import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import path from 'path';
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

// View engine setup
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../views'));
// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Session middleware
app.use(
  session({
    secret: env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

app.use(pinoHttp({ logger }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net"
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net"
        ],

        fontSrc: [
          "'self'",
          "https://cdn.jsdelivr.net"
        ],

        imgSrc: [
          "'self'",
          "data:"
        ],

        connectSrc: [
          "'self'"
        ]
      },
    },
  })
);
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(requestLogger);
app.use(apiRateLimit);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
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
