import { prisma } from '../../../config/prisma';

export class SalesRepository {
  create(userId: number, data: {
    customerId?: number;
    saleDate: Date;
    productType: string;
    quantityLiters: number;
    ratePerLiter: number;
    notes?: string;
  }) {
    const totalAmount = data.quantityLiters * data.ratePerLiter;
    return prisma.salesEntry.create({
      data: {
        userId,
        customerId: data.customerId,
        saleDate: data.saleDate,
        productType: data.productType,
        quantityLiters: data.quantityLiters,
        ratePerLiter: data.ratePerLiter,
        totalAmount,
        notes: data.notes,
      },
    });
  }

  list(userId: number, where: Record<string, unknown>, skip: number, take: number, orderBy: Record<string, unknown>) {
    return prisma.salesEntry.findMany({
      where: { userId, deletedAt: null, ...where },
      skip,
      take,
      orderBy,
      include: { customer: true },
    });
  }

  count(userId: number, where: Record<string, unknown>) {
    return prisma.salesEntry.count({ where: { userId, deletedAt: null, ...where } });
  }

  findById(saleId: number) {
    return prisma.salesEntry.findFirst({ where: { id: saleId, deletedAt: null } });
  }

  update(saleId: number, data: Record<string, unknown>) {
    return prisma.salesEntry.update({ where: { id: saleId }, data });
  }

  softDelete(saleId: number) {
    return prisma.salesEntry.update({ where: { id: saleId }, data: { deletedAt: new Date() } });
  }
}

export const salesRepository = new SalesRepository();
