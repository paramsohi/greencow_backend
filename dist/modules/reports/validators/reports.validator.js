"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerLedgerSchema = exports.userReportsQuerySchema = void 0;
const zod_1 = require("zod");
exports.userReportsQuerySchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({ userId: zod_1.z.coerce.number().int().positive() }),
    query: zod_1.z.object({
        date: zod_1.z.string().optional(),
        month: zod_1.z.string().optional(),
    }),
});
exports.customerLedgerSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({
        userId: zod_1.z.coerce.number().int().positive(),
        customerId: zod_1.z.coerce.number().int().positive(),
    }),
    query: zod_1.z.object({
        fromDate: zod_1.z.string().optional(),
        toDate: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=reports.validator.js.map