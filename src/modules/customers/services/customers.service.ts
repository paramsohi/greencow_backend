import { ApiError } from '../../../common/errors/api-error';
import { parsePagination } from '../../../common/utils/pagination';
import { customersRepository } from '../repositories/customers.repository';

export class CustomersService {
  async create(userId: number, body: { name: string; phone?: string; address?: string; openingBalance?: number }) {
    return customersRepository.create(userId, body);
  }

  async list(userId: number, query: Record<string, unknown>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination({ query } as any);
    const search = typeof query.search === 'string' ? query.search : undefined;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      customersRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
      customersRepository.count(userId, where),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(customerId: number, authUserId: number) {
    const item = await customersRepository.findById(customerId);
    if (!item || item.userId !== authUserId) {
      throw new ApiError(404, 'Customer not found');
    }

    return item;
  }

  async update(customerId: number, authUserId: number, body: { name?: string; phone?: string; address?: string; openingBalance?: number }) {
    const current = await this.getById(customerId, authUserId);

    return customersRepository.update(current.id, {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.phone !== undefined ? { phone: body.phone } : {}),
      ...(body.address !== undefined ? { address: body.address } : {}),
      ...(body.openingBalance !== undefined ? { openingBalance: body.openingBalance } : {}),
    });
  }

  async remove(customerId: number, authUserId: number) {
    const current = await this.getById(customerId, authUserId);
    await customersRepository.softDelete(current.id);
  }
}

export const customersService = new CustomersService();
