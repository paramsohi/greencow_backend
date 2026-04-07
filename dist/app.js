"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const error_handler_1 = require("./common/middleware/error-handler");
const request_logger_1 = require("./common/middleware/request-logger");
const rate_limit_1 = require("./common/middleware/rate-limit");
const sanitize_1 = require("./common/middleware/sanitize");
const admin_1 = require("./modules/admin");
const modules_1 = require("./modules");
exports.app = (0, express_1.default)();
// View engine setup
exports.app.set('view engine', 'ejs');
exports.app.set('views', path_1.default.join(__dirname, '../views'));
// Static files
exports.app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Session middleware
exports.app.use((0, express_session_1.default)({
    secret: env_1.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: env_1.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
}));
exports.app.use((0, pino_http_1.default)({ logger: logger_1.logger }));
exports.app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            fontSrc: ["'self'"],
            imgSrc: ["'self'", 'data:'],
            connectSrc: ["'self'"],
        },
    },
}));
exports.app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
}));
exports.app.use(request_logger_1.requestLogger);
exports.app.use(rate_limit_1.apiRateLimit);
exports.app.use(express_1.default.json({ limit: '1mb' }));
exports.app.use(express_1.default.urlencoded({ limit: '1mb', extended: true }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(sanitize_1.sanitizeBody);
exports.app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'ok' });
});
exports.app.get('/', (_req, res) => {
    res.send('Backend running 🚀');
});
exports.app.use('/api', modules_1.apiRouter);
exports.app.use('/admin', admin_1.adminRouter);
exports.app.use(error_handler_1.notFoundHandler);
exports.app.use(error_handler_1.errorHandler);
//# sourceMappingURL=app.js.map