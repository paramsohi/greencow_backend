import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/prisma';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureDatabaseConnection = async (maxAttempts = 10, delayMs = 2000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await prisma.$connect();
      logger.info('Database connection established');
      return;
    } catch (error) {
      logger.warn({ attempt, maxAttempts, err: error }, 'Database connection attempt failed');

      if (attempt === maxAttempts) {
        throw error;
      }

      await wait(delayMs);
    }
  }
};

const startServer = async () => {
  try {
    await ensureDatabaseConnection();

    app.listen(env.PORT, '0.0.0.0', () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server due to database connectivity issue');
    process.exit(1);
  }
};

void startServer();