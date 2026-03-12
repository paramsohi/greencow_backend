"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeBody = void 0;
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return value.trim().replace(/[<>]/g, '');
    }
    if (Array.isArray(value)) {
        return value.map((entry) => sanitizeValue(entry));
    }
    if (value && typeof value === 'object') {
        const record = value;
        const sanitized = {};
        for (const key of Object.keys(record)) {
            sanitized[key] = sanitizeValue(record[key]);
        }
        return sanitized;
    }
    return value;
};
const sanitizeBody = (req, _res, next) => {
    req.body = sanitizeValue(req.body);
    next();
};
exports.sanitizeBody = sanitizeBody;
//# sourceMappingURL=sanitize.js.map