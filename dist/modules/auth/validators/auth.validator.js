"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.refreshSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        fullName: zod_1.z.string().min(2).max(100),
        phone: zod_1.z.string().max(50).optional(),
        businessName: zod_1.z.string().max(100).optional(),
        businessAddress: zod_1.z.string().max(255).optional(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(20),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.logoutSchema = exports.refreshSchema;
//# sourceMappingURL=auth.validator.js.map