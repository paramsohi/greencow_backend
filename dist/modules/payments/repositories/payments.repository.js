"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRepository = exports.PaymentsRepository = void 0;
const prisma_1 = require("../../../config/prisma");
class PaymentsRepository {
    create(userId, data) {
        return prisma_1.prisma.paymentRecord.create({ data: { userId, ...data } });
    }
    list(userId, where, skip, take, orderBy) {
        return prisma_1.prisma.paymentRecord.findMany({
            where: { userId, deletedAt: null, ...where },
            skip,
            take,
            orderBy,
            include: { customer: true },
        });
    }
    count(userId, where) {
        return prisma_1.prisma.paymentRecord.count({ where: { userId, deletedAt: null, ...where } });
    }
    findById(paymentId) {
        return prisma_1.prisma.paymentRecord.findFirst({ where: { id: paymentId, deletedAt: null } });
    }
    update(paymentId, data) {
        return prisma_1.prisma.paymentRecord.update({ where: { id: paymentId }, data });
    }
    softDelete(paymentId) {
        return prisma_1.prisma.paymentRecord.update({ where: { id: paymentId }, data: { deletedAt: new Date() } });
    }
}
exports.PaymentsRepository = PaymentsRepository;
exports.paymentsRepository = new PaymentsRepository();
//# sourceMappingURL=payments.repository.js.map