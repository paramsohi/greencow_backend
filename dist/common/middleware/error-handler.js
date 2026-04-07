"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const logger_1 = require("../../config/logger");
const api_error_1 = require("../errors/api-error");
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, _req, res, _next) => {
    console.error("🔥 REAL ERROR:", err); // 👈 ADD THIS
    if (err instanceof api_error_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.details,
        });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.flatten(),
        });
    }
    if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        logger_1.logger.error({ err }, 'Database initialization error');
        return res.status(503).json({
            success: false,
            message: 'Database is unavailable. Ensure MySQL is running and try again.',
        });
    }
    // 👇 IMPORTANT CHANGE
    logger_1.logger.error({ err }, 'Unhandled server error');
    return res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined, // 👈 add this
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map