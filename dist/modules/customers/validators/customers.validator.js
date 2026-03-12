"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerSchema = exports.customerIdSchema = exports.listCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const listQuery = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    search: zod_1.z.string().optional(),
});
exports.createCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        phone: zod_1.z.string().max(50).optional(),
        address: zod_1.z.string().max(255).optional(),
        openingBalance: zod_1.z.coerce.number().optional(),
    }),
    params: zod_1.z.object({
        userId: zod_1.z.coerce.number().int().positive(),
    }),
    query: zod_1.z.object({}),
});
exports.listCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({
        userId: zod_1.z.coerce.number().int().positive(),
    }),
    query: listQuery,
});
exports.customerIdSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({
        customerId: zod_1.z.coerce.number().int().positive(),
    }),
    query: zod_1.z.object({}),
});
exports.updateCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(100).optional(),
        phone: zod_1.z.string().max(50).optional(),
        address: zod_1.z.string().max(255).optional(),
        openingBalance: zod_1.z.coerce.number().optional(),
    }),
    params: zod_1.z.object({
        customerId: zod_1.z.coerce.number().int().positive(),
    }),
    query: zod_1.z.object({}),
});
//# sourceMappingURL=customers.validator.js.map