"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentSchema = exports.paymentIdSchema = exports.customerPaymentListSchema = exports.listPaymentsSchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
const listQuery = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    customerId: zod_1.z.coerce.number().int().positive().optional(),
    fromDate: zod_1.z.string().optional(),
    toDate: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.string().optional(),
});
exports.createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.coerce.number().int().positive(),
        paymentDate: zod_1.z.string().datetime(),
        amount: zod_1.z.coerce.number().positive(),
        paymentMethod: zod_1.z.string().min(2).max(50),
        reference: zod_1.z.string().max(100).optional(),
        notes: zod_1.z.string().max(255).optional(),
    }),
    params: zod_1.z.object({ userId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
exports.listPaymentsSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({ userId: zod_1.z.coerce.number().int().positive() }),
    query: listQuery,
});
exports.customerPaymentListSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({ customerId: zod_1.z.coerce.number().int().positive() }),
    query: listQuery.omit({ customerId: true }),
});
exports.paymentIdSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({ paymentId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
exports.updatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.coerce.number().int().positive().optional(),
        paymentDate: zod_1.z.string().datetime().optional(),
        amount: zod_1.z.coerce.number().positive().optional(),
        paymentMethod: zod_1.z.string().min(2).max(50).optional(),
        reference: zod_1.z.string().max(100).optional(),
        notes: zod_1.z.string().max(255).optional(),
    }),
    params: zod_1.z.object({ paymentId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
//# sourceMappingURL=payments.validator.js.map