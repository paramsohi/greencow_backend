"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaleSchema = exports.saleIdSchema = exports.listSalesSchema = exports.createSaleSchema = void 0;
const zod_1 = require("zod");
const listQuery = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().optional(),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    customerId: zod_1.z.coerce.number().int().positive().optional(),
    fromDate: zod_1.z.string().optional(),
    toDate: zod_1.z.string().optional(),
    productType: zod_1.z.string().optional(),
});
exports.createSaleSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.coerce.number().int().positive().optional(),
        saleDate: zod_1.z.string().datetime(),
        productType: zod_1.z.string().min(2).max(100),
        quantityLiters: zod_1.z.coerce.number().positive(),
        ratePerLiter: zod_1.z.coerce.number().positive(),
        notes: zod_1.z.string().max(255).optional(),
    }),
    params: zod_1.z.object({ userId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
exports.listSalesSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({ userId: zod_1.z.coerce.number().int().positive() }),
    query: listQuery,
});
exports.saleIdSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({ saleId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
exports.updateSaleSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.coerce.number().int().positive().nullable().optional(),
        saleDate: zod_1.z.string().datetime().optional(),
        productType: zod_1.z.string().min(2).max(100).optional(),
        quantityLiters: zod_1.z.coerce.number().positive().optional(),
        ratePerLiter: zod_1.z.coerce.number().positive().optional(),
        notes: zod_1.z.string().max(255).optional(),
    }),
    params: zod_1.z.object({ saleId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({}),
});
//# sourceMappingURL=sales.validator.js.map