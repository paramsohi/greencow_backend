"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsService = exports.PaymentsService = void 0;
const api_error_1 = require("../../../common/errors/api-error");
const pagination_1 = require("../../../common/utils/pagination");
const payments_repository_1 = require("../repositories/payments.repository");
const toPaymentResponse = (payment) => ({
    ...payment,
    amount: Number(payment.amount),
    ...(payment && typeof payment === 'object' && 'customer' in payment && payment.customer
        ? {
            customer: {
                ...payment.customer,
                openingBalance: Number(payment.customer.openingBalance),
            },
        }
        : {}),
});
class PaymentsService {
    async create(userId, body) {
        const payment = await payments_repository_1.paymentsRepository.create(userId, {
            ...body,
            paymentDate: new Date(body.paymentDate),
        });
        return toPaymentResponse(payment);
    }
    async list(userId, query) {
        const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.parsePagination)({ query });
        const where = {
            ...(query.customerId ? { customerId: Number(query.customerId) } : {}),
            ...(query.paymentMethod ? { paymentMethod: { contains: String(query.paymentMethod) } } : {}),
            ...(query.fromDate || query.toDate
                ? {
                    paymentDate: {
                        ...(query.fromDate ? { gte: new Date(String(query.fromDate)) } : {}),
                        ...(query.toDate ? { lte: new Date(String(query.toDate)) } : {}),
                    },
                }
                : {}),
        };
        const [items, total] = await Promise.all([
            payments_repository_1.paymentsRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
            payments_repository_1.paymentsRepository.count(userId, where),
        ]);
        return {
            items: items.map(toPaymentResponse),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async owned(paymentId, authUserId) {
        const payment = await payments_repository_1.paymentsRepository.findById(paymentId);
        if (!payment || payment.userId !== authUserId) {
            throw new api_error_1.ApiError(404, 'Payment record not found');
        }
        return payment;
    }
    async update(paymentId, authUserId, body) {
        await this.owned(paymentId, authUserId);
        const payment = await payments_repository_1.paymentsRepository.update(paymentId, {
            ...(body.customerId !== undefined ? { customerId: body.customerId } : {}),
            ...(body.paymentDate ? { paymentDate: new Date(body.paymentDate) } : {}),
            ...(body.amount !== undefined ? { amount: body.amount } : {}),
            ...(body.paymentMethod ? { paymentMethod: body.paymentMethod } : {}),
            ...(body.reference !== undefined ? { reference: body.reference } : {}),
            ...(body.notes !== undefined ? { notes: body.notes } : {}),
        });
        return toPaymentResponse(payment);
    }
    async remove(paymentId, authUserId) {
        await this.owned(paymentId, authUserId);
        await payments_repository_1.paymentsRepository.softDelete(paymentId);
    }
}
exports.PaymentsService = PaymentsService;
exports.paymentsService = new PaymentsService();
//# sourceMappingURL=payments.service.js.map