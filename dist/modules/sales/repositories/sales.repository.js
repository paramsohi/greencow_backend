"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRepository = exports.SalesRepository = void 0;
const prisma_1 = require("../../../config/prisma");
class SalesRepository {
    create(userId, data) {
        const totalAmount = data.quantityLiters * data.ratePerLiter;
        return prisma_1.prisma.salesEntry.create({
            data: {
                userId,
                customerId: data.customerId,
                saleDate: data.saleDate,
                productType: data.productType,
                quantityLiters: data.quantityLiters,
                ratePerLiter: data.ratePerLiter,
                totalAmount,
                paymentStatus: data.paymentStatus ?? 'pending',
                notes: data.notes,
            },
        });
    }
    list(userId, where, skip, take, orderBy) {
        return prisma_1.prisma.salesEntry.findMany({
            where: { userId, deletedAt: null, ...where },
            skip,
            take,
            orderBy,
            include: { customer: true },
        });
    }
    count(userId, where) {
        return prisma_1.prisma.salesEntry.count({ where: { userId, deletedAt: null, ...where } });
    }
    findById(saleId) {
        return prisma_1.prisma.salesEntry.findFirst({ where: { id: saleId, deletedAt: null } });
    }
    update(saleId, data) {
        return prisma_1.prisma.salesEntry.update({ where: { id: saleId }, data });
    }
    softDelete(saleId) {
        return prisma_1.prisma.salesEntry.update({ where: { id: saleId }, data: { deletedAt: new Date() } });
    }
}
exports.SalesRepository = SalesRepository;
exports.salesRepository = new SalesRepository();
//# sourceMappingURL=sales.repository.js.map