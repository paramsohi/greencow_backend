import { ApiError } from '../../../common/errors/api-error';
import { parsePagination } from '../../../common/utils/pagination';
import { customersRepository } from '../../customers/repositories/customers.repository';
import { paymentsRepository } from '../repositories/payments.repository';

const toPaymentResponse = <TPayment extends { amount: unknown }>(payment: TPayment) => ({
  ...payment,
  amount: Number(payment.amount),
  ...(payment && typeof payment === 'object' && 'customer' in payment && payment.customer
    ? {
        customer: {
          ...(payment.customer as Record<string, unknown>),
          openingBalance: Number((payment.customer as { openingBalance: unknown }).openingBalance),
        },
      }
    : {}),
});

export class PaymentsService {
  private buildWhere(query: Record<string, unknown>, baseWhere: Record<string, unknown> = {}) {
    return {
      ...baseWhere,
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
  }

  async create(userId: number, body: {
    customerId: number;
    paymentDate: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }) {
    const payment = await paymentsRepository.create(userId, {
      ...body,
      paymentDate: new Date(body.paymentDate),
    });

    return toPaymentResponse(payment);
  }

  async list(userId: number, query: Record<string, unknown>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination({ query } as any);
    const where = this.buildWhere(query);

    const [items, total] = await Promise.all([
      paymentsRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
      paymentsRepository.count(userId, where),
    ]);

    return {
      items: items.map(toPaymentResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async listByCustomer(customerId: number, authUserId: number, query: Record<string, unknown>) {
    const customer = await customersRepository.findById(customerId);
    if (!customer || customer.userId !== authUserId) {
      throw new ApiError(404, 'Customer not found');
    }

    const { page, limit, skip, sortBy, sortOrder } = parsePagination({ query } as any);
    const where = this.buildWhere(query, { customerId });

    const [items, total] = await Promise.all([
      paymentsRepository.list(authUserId, where, skip, limit, { [sortBy]: sortOrder }),
      paymentsRepository.count(authUserId, where),
    ]);

    return {
      items: items.map(toPaymentResponse),
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

    const payment = await paymentsRepository.update(paymentId, {
      ...(body.customerId !== undefined ? { customerId: body.customerId } : {}),
      ...(body.paymentDate ? { paymentDate: new Date(body.paymentDate) } : {}),
      ...(body.amount !== undefined ? { amount: body.amount } : {}),
      ...(body.paymentMethod ? { paymentMethod: body.paymentMethod } : {}),
      ...(body.reference !== undefined ? { reference: body.reference } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
    });

    return toPaymentResponse(payment);
  }

  async remove(paymentId: number, authUserId: number) {
    await this.owned(paymentId, authUserId);
    await paymentsRepository.softDelete(paymentId);
  }
}

export const paymentsService = new PaymentsService();
