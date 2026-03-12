"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.userIdParamSchema = void 0;
const zod_1 = require("zod");
const dairySettingsSchema = zod_1.z.object({
    buffaloes: zod_1.z.number().int().nonnegative(),
    cows: zod_1.z.number().int().nonnegative(),
    sheep: zod_1.z.number().int().nonnegative(),
});
exports.userIdParamSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({
        userId: zod_1.z.coerce.number().int().positive(),
    }),
    query: zod_1.z.object({}),
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2).max(100).optional(),
        phone: zod_1.z.string().max(50).optional(),
        businessName: zod_1.z.string().max(100).optional(),
        businessAddress: zod_1.z.string().max(255).optional(),
        dairySettings: dairySettingsSchema.optional(),
        hasCompletedDairySetup: zod_1.z.boolean().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
    params: zod_1.z.object({
        userId: zod_1.z.coerce.number().int().positive(),
    }),
    query: zod_1.z.object({}),
});
//# sourceMappingURL=users.validator.js.map