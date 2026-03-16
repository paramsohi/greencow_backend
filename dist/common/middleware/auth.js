"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownershipGuard = exports.authGuard = void 0;
const api_error_1 = require("../errors/api-error");
const tokens_1 = require("../utils/tokens");
const authGuard = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return next(new api_error_1.ApiError(401, 'Missing or invalid authorization header'));
    }
    const token = header.substring(7);
    try {
        const payload = (0, tokens_1.verifyAccessToken)(token);
        const normalizedUserId = Number(payload.userId ?? payload.id);
        const normalizedRole = typeof payload.role === 'string' ? payload.role.toUpperCase() : '';
        if (!Number.isInteger(normalizedUserId) || !payload.email || !normalizedRole) {
            return next(new api_error_1.ApiError(401, 'Invalid access token payload'));
        }
        req.auth = {
            userId: normalizedUserId,
            email: payload.email,
            role: normalizedRole,
        };
        return next();
    }
    catch {
        return next(new api_error_1.ApiError(401, 'Invalid or expired access token'));
    }
};
exports.authGuard = authGuard;
const ownershipGuard = (req, _res, next) => {
    const paramUserId = Number(req.params.userId);
    if (!req.auth) {
        return next(new api_error_1.ApiError(401, 'Unauthorized'));
    }
    if (Number.isNaN(paramUserId)) {
        return next(new api_error_1.ApiError(400, 'Invalid userId parameter'));
    }
    if (req.auth.userId !== paramUserId) {
        if (req.auth.role === 'OWNER') {
            return next(new api_error_1.ApiError(403, 'Owner can only access own records in this API'));
        }
        return next(new api_error_1.ApiError(403, 'Forbidden'));
    }
    return next();
};
exports.ownershipGuard = ownershipGuard;
//# sourceMappingURL=auth.js.map