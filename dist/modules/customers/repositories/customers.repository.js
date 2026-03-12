"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersRepository = exports.CustomersRepository = void 0;
const prisma_1 = require("../../../config/prisma");
class CustomersRepository {
    create(userId, data) {
        return prisma_1.prisma.customer.create({
            data: {
                userId,
                name: data.name,
                phone: data.phone,
                address: data.address,
                openingBalance: data.openingBalance ?? 0,
            },
        });
    }
    list(userId, where, skip, take, orderBy) {
        return prisma_1.prisma.customer.findMany({
            where: { userId, deletedAt: null, ...where },
            skip,
            take,
            orderBy,
        });
    }
    count(userId, where) {
        return prisma_1.prisma.customer.count({ where: { userId, deletedAt: null, ...where } });
    }
    findById(customerId) {
        return prisma_1.prisma.customer.findFirst({ where: { id: customerId, deletedAt: null } });
    }
    update(customerId, data) {
        return prisma_1.prisma.customer.update({ where: { id: customerId }, data });
    }
    softDelete(customerId) {
        return prisma_1.prisma.customer.update({ where: { id: customerId }, data: { deletedAt: new Date() } });
    }
}
exports.CustomersRepository = CustomersRepository;
exports.customersRepository = new CustomersRepository();
//# sourceMappingURL=customers.repository.js.map