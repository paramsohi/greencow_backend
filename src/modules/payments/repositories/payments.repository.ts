import { prisma } from '../../../config/prisma';

export class PaymentsRepository {
  create(userId: number, data: {
    customerId: number;
    paymentDate: Date;
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }) {
    return prisma.paymentRecord.create({ data: { userId, ...data } });
  }

  list(userId: number, where: Record<string, unknown>, skip: number, take: number, orderBy: Record<string, unknown>) {
    return prisma.paymentRecord.findMany({
      where: { userId, deletedAt: null, ...where },
      skip,
      take,
      orderBy,
      include: { customer: true },
    });
  }

  count(userId: number, where: Record<string, unknown>) {
    return prisma.paymentRecord.count({ where: { userId, deletedAt: null, ...where } });
  }

  findById(paymentId: number) {
    return prisma.paymentRecord.findFirst({ where: { id: paymentId, deletedAt: null } });
  }

  update(paymentId: number, data: Record<string, unknown>) {
    return prisma.paymentRecord.update({ where: { id: paymentId }, data });
  }

  softDelete(paymentId: number) {
    return prisma.paymentRecord.update({ where: { id: paymentId }, data: { deletedAt: new Date() } });
  }
}

export const paymentsRepository = new PaymentsRepository();
