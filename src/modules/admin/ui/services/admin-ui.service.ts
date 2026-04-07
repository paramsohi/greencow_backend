import { prisma } from '../../../../config/prisma';
import { comparePassword } from '../../../../common/utils/crypto';
import { apiLogsService } from '../../api-logs/services/api-logs.service';
import { UserRole } from '@prisma/client';

export class AdminUiService {
  /**
   * Validate admin credentials
   */
  async validateAdmin(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        role: UserRole.ADMIN,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
      },
    });

    if (!user) {
      return null;
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Log admin activity
   */
  async logAdminActivity(adminId: number, action: string, description: string, ipAddress?: string | null) {
    try {
      // Create a record if needed (you can create a separate AdminActivity table)
      console.log(`[Admin Activity] User ${adminId}: ${action} - ${description} from ${ipAddress}`);
    } catch (error) {
      console.error('Error logging admin activity:', error);
    }
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
      netProfit: Number(totalRevenue._sum.totalAmount || 0) - Number(totalExpenses._sum.amount || 0),
    };
  }

  /**
   * Get admin logs from API
   */
  async getAdminLogs(page: number = 1, limit: number = 20) {
    try {
      // Call the API logs service directly
      const result = await apiLogsService.list({
        page,
        limit,
        excludeAdmin: false, // Include admin logs
      });

      return {
        items: result.items.map((log: any) => ({
          id: log.id,
          method: log.method,
          url: log.url,
          status: log.status,
          responseTime: log.responseTime,
          createdAt: new Date(log.createdAt),
        })),
        meta: {
          total: result.meta.total,
          page: result.meta.page,
          limit: result.meta.limit,
          pages: result.meta.totalPages,
        },
      };
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      return { items: [], meta: { total: 0, page, limit, pages: 0 } };
    }
  }
}

export const adminUiService = new AdminUiService();
