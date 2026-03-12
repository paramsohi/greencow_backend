"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const prisma_1 = require("./config/prisma");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ensureDatabaseConnection = async (maxAttempts = 10, delayMs = 2000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            await prisma_1.prisma.$connect();
            logger_1.logger.info('Database connection established');
            return;
        }
        catch (error) {
            logger_1.logger.warn({ attempt, maxAttempts, err: error }, 'Database connection attempt failed');
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
        app_1.app.listen(env_1.env.PORT, '0.0.0.0', () => {
            logger_1.logger.info(`Server listening on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to start server due to database connectivity issue');
        process.exit(1);
    }
};
void startServer();
//# sourceMappingURL=server.js.map