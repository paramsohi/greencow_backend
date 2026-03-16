"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.refreshSchema = exports.verifyPhoneOtpSchema = exports.requestPhoneOtpSchema = exports.loginSchema = exports.signupSchema = void 0;
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
const phoneSchema = zod_1.z
    .string()
    .trim()
    .min(8, 'Phone must be at least 8 characters')
    .max(20, 'Phone cannot exceed 20 characters')
    .regex(/^[+]?\d+$/, 'Phone must contain only digits and optional leading +');
exports.requestPhoneOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: phoneSchema,
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.verifyPhoneOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: phoneSchema,
        otp: zod_1.z.string().trim().min(4).max(8),
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
exports.logoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().trim().min(1).optional(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
//# sourceMappingURL=auth.validator.js.map