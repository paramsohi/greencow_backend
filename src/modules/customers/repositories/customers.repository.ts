import { prisma } from '../../../config/prisma';

export class CustomersRepository {
  create(userId: number, data: { name: string; phone?: string; address?: string; openingBalance?: number }) {
    return prisma.customer.create({
      data: {
        userId,
        name: data.name,
        phone: data.phone,
        address: data.address,
        openingBalance: data.openingBalance ?? 0,
      },
    });
  }

  list(userId: number, where: Record<string, unknown>, skip: number, take: number, orderBy: Record<string, unknown>) {
    return prisma.customer.findMany({
      where: { userId, deletedAt: null, ...where },
      skip,
      take,
      orderBy,
    });
  }

  count(userId: number, where: Record<string, unknown>) {
    return prisma.customer.count({ where: { userId, deletedAt: null, ...where } });
  }

  findById(customerId: number) {
    return prisma.customer.findFirst({ where: { id: customerId, deletedAt: null } });
  }

  update(customerId: number, data: Record<string, unknown>) {
    return prisma.customer.update({ where: { id: customerId }, data });
  }

  softDelete(customerId: number) {
    return prisma.customer.update({ where: { id: customerId }, data: { deletedAt: new Date() } });
  }
}

export const customersRepository = new CustomersRepository();
