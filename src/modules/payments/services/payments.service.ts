import { ApiError } from '../../../common/errors/api-error';
import { parsePagination } from '../../../common/utils/pagination';
import { paymentsRepository } from '../repositories/payments.repository';

export class PaymentsService {
  create(userId: number, body: {
    customerId: number;
    paymentDate: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }) {
    return paymentsRepository.create(userId, {
      ...body,
      paymentDate: new Date(body.paymentDate),
    });
  }

  async list(userId: number, query: Record<string, unknown>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination({ query } as any);

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
      paymentsRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
      paymentsRepository.count(userId, where),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async owned(paymentId: number, authUserId: number) {
    const payment = await paymentsRepository.findById(paymentId);
    if (!payment || payment.userId !== authUserId) {
      throw new ApiError(404, 'Payment record not found');
    }

    return payment;
  }

  async update(paymentId: number, authUserId: number, body: {
    customerId?: number;
    paymentDate?: string;
    amount?: number;
    paymentMethod?: string;
    reference?: string;
    notes?: string;
  }) {
    await this.owned(paymentId, authUserId);

    return paymentsRepository.update(paymentId, {
      ...(body.customerId !== undefined ? { customerId: body.customerId } : {}),
      ...(body.paymentDate ? { paymentDate: new Date(body.paymentDate) } : {}),
      ...(body.amount !== undefined ? { amount: body.amount } : {}),
      ...(body.paymentMethod ? { paymentMethod: body.paymentMethod } : {}),
      ...(body.reference !== undefined ? { reference: body.reference } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
    });
  }

  async remove(paymentId: number, authUserId: number) {
    await this.owned(paymentId, authUserId);
    await paymentsRepository.softDelete(paymentId);
  }
}

export const paymentsService = new PaymentsService();
