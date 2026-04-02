import { ApiError } from '../../../common/errors/api-error';
import { parsePagination } from '../../../common/utils/pagination';
import { customersRepository } from '../../customers/repositories/customers.repository';
import { salesRepository } from '../repositories/sales.repository';

const toSaleResponse = <TSale extends { totalAmount: unknown; quantityLiters: unknown; ratePerLiter: unknown }>(sale: TSale) => ({
  ...sale,
  quantityLiters: Number(sale.quantityLiters),
  ratePerLiter: Number(sale.ratePerLiter),
  totalAmount: Number(sale.totalAmount),
  ...(sale && typeof sale === 'object' && 'paymentStatus' in sale
    ? {
        paymentStatus: ['paid', 'partial', 'pending'].includes(String((sale as Record<string, unknown>).paymentStatus))
          ? String((sale as Record<string, unknown>).paymentStatus)
          : 'pending',
      }
    : {}),
  ...(sale && typeof sale === 'object' && 'customer' in sale && sale.customer
    ? {
        customer: {
          ...(sale.customer as Record<string, unknown>),
          openingBalance: Number((sale.customer as { openingBalance: unknown }).openingBalance),
        },
      }
    : {}),
});

export class SalesService {
  private buildWhere(query: Record<string, unknown>, baseWhere: Record<string, unknown> = {}) {
    return {
      ...baseWhere,
      ...(query.customerId ? { customerId: Number(query.customerId) } : {}),
      ...(query.productType ? { productType: { contains: String(query.productType) } } : {}),
      ...(query.fromDate || query.toDate
        ? {
            saleDate: {
              ...(query.fromDate ? { gte: new Date(String(query.fromDate)) } : {}),
              ...(query.toDate ? { lte: new Date(String(query.toDate)) } : {}),
            },
          }
        : {}),
    };
  }

  create(userId: number, body: {
    customerId?: number;
    saleDate: string;
    productType: string;
    quantityLiters: number;
    ratePerLiter: number;
    paymentStatus?: 'paid' | 'pending' | 'partial';
    notes?: string;
  }) {
    return salesRepository.create(userId, {
      ...body,
      saleDate: new Date(body.saleDate),
    }).then(toSaleResponse);
  }

  async list(userId: number, query: Record<string, unknown>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination({ query } as any);
    const where = this.buildWhere(query);

    const [items, total] = await Promise.all([
      salesRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
      salesRepository.count(userId, where),
    ]);

    return {
      items: items.map(toSaleResponse),
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
      salesRepository.list(authUserId, where, skip, limit, { [sortBy]: sortOrder }),
      salesRepository.count(authUserId, where),
    ]);

    return {
      items: items.map(toSaleResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOwnedSale(saleId: number, authUserId: number) {
    const sale = await salesRepository.findById(saleId);
    if (!sale || sale.userId !== authUserId) {
      throw new ApiError(404, 'Sale entry not found');
    }

    return sale;
  }

  async update(saleId: number, authUserId: number, body: {
    customerId?: number | null;
    saleDate?: string;
    productType?: string;
    quantityLiters?: number;
    ratePerLiter?: number;
    paymentStatus?: 'paid' | 'pending' | 'partial';
    notes?: string;
  }) {
    const existing = await this.getOwnedSale(saleId, authUserId);
    const quantity = body.quantityLiters ?? Number(existing.quantityLiters);
    const rate = body.ratePerLiter ?? Number(existing.ratePerLiter);

    const sale = await salesRepository.update(saleId, {
      ...(body.customerId !== undefined ? { customerId: body.customerId } : {}),
      ...(body.saleDate ? { saleDate: new Date(body.saleDate) } : {}),
      ...(body.productType ? { productType: body.productType } : {}),
      ...(body.quantityLiters !== undefined ? { quantityLiters: body.quantityLiters } : {}),
      ...(body.ratePerLiter !== undefined ? { ratePerLiter: body.ratePerLiter } : {}),
      ...(body.paymentStatus !== undefined ? { paymentStatus: body.paymentStatus } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      totalAmount: quantity * rate,
    });

    return toSaleResponse(sale);
  }

  async remove(saleId: number, authUserId: number) {
    await this.getOwnedSale(saleId, authUserId);
    await salesRepository.softDelete(saleId);
  }
}

export const salesService = new SalesService();
