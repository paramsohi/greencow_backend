import { prisma } from '../../../../config/prisma';

export class AdminDataService {
  /**
   * Get all users with pagination
   */
  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              fullName: true,
              phone: true,
              businessName: true,
              businessAddress: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: { deletedAt: null } }),
    ]);

    return {
      items: users,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all customers
   */
  async getAllCustomers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where: { deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: { fullName: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where: { deletedAt: null } }),
    ]);

    return {
      items: customers,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all sales entries
   */
  async getAllSales(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      prisma.salesEntry.findMany({
        where: { deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true } },
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { saleDate: 'desc' },
      }),
      prisma.salesEntry.count({ where: { deletedAt: null } }),
    ]);

    return {
      items: sales,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all payment records
   */
  async getAllPayments(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.paymentRecord.findMany({
        where: { deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true } },
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.paymentRecord.count({ where: { deletedAt: null } }),
    ]);

    return {
      items: payments,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all expenses
   */
  async getAllExpenses(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      prisma.expenseRecord.findMany({
        where: { deletedAt: null },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { expenseDate: 'desc' },
      }),
      prisma.expenseRecord.count({ where: { deletedAt: null } }),
    ]);

    return {
      items: expenses,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [userCount, customerCount, salesCount, totalRevenue, totalExpenses, activeUsers] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.customer.count({ where: { deletedAt: null } }),
      prisma.salesEntry.count({ where: { deletedAt: null } }),
      prisma.salesEntry.aggregate({
        where: { deletedAt: null },
        _sum: { totalAmount: true },
      }),
      prisma.expenseRecord.aggregate({
        where: { deletedAt: null },
        _sum: { amount: true },
      }),
      prisma.user.count({ where: { deletedAt: null, isActive: true } }),
    ]);

    return {
      totalUsers: userCount,
      totalCustomers: customerCount,
      totalSales: salesCount,
      activeUsers,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      totalExpenses: Number(totalExpenses._sum.amount || 0),
    };
  }
}

export const adminDataService = new AdminDataService();
