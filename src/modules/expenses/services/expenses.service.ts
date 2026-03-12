import { ApiError } from '../../../common/errors/api-error';
import { parsePagination } from '../../../common/utils/pagination';
import { expensesRepository } from '../repositories/expenses.repository';

export class ExpensesService {
  create(userId: number, body: { expenseDate: string; category: string; amount: number; description?: string }) {
    return expensesRepository.create(userId, {
      ...body,
      expenseDate: new Date(body.expenseDate),
    });
  }

  async list(userId: number, query: Record<string, unknown>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination({ query } as any);

    const where = {
      ...(query.category ? { category: { contains: String(query.category) } } : {}),
      ...(query.fromDate || query.toDate
        ? {
            expenseDate: {
              ...(query.fromDate ? { gte: new Date(String(query.fromDate)) } : {}),
              ...(query.toDate ? { lte: new Date(String(query.toDate)) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      expensesRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
      expensesRepository.count(userId, where),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async owned(expenseId: number, authUserId: number) {
    const expense = await expensesRepository.findById(expenseId);
    if (!expense || expense.userId !== authUserId) {
      throw new ApiError(404, 'Expense record not found');
    }

    return expense;
  }

  async update(expenseId: number, authUserId: number, body: {
    expenseDate?: string;
    category?: string;
    amount?: number;
    description?: string;
  }) {
    await this.owned(expenseId, authUserId);

    return expensesRepository.update(expenseId, {
      ...(body.expenseDate ? { expenseDate: new Date(body.expenseDate) } : {}),
      ...(body.category ? { category: body.category } : {}),
      ...(body.amount !== undefined ? { amount: body.amount } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
    });
  }

  async remove(expenseId: number, authUserId: number) {
    await this.owned(expenseId, authUserId);
    await expensesRepository.softDelete(expenseId);
  }
}

export const expensesService = new ExpensesService();
