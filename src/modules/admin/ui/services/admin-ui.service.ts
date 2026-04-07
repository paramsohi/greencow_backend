import { prisma } from '../../../../config/prisma';
import { comparePassword } from '../../../../common/utils/crypto';
import axios from 'axios';

export class AdminUiService {
  /**
   * Validate admin credentials
   */
  async validateAdmin(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        role: 'ADMIN',
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
      // Fetch from the internal API logs endpoint
      const skip = (page - 1) * limit;
      const response = await axios.get(`http://localhost:3000/admin/api-logs`, {
        params: { page, limit },
        timeout: 5000,
      });

      if (response.data?.data) {
        return {
          items: response.data.data.map((log: any) => ({
            id: log.id,
            method: log.method,
            url: log.url,
            status: log.status,
            responseTime: log.responseTime,
            createdAt: new Date(log.createdAt),
          })),
          meta: response.data.meta || {
            total: response.data.data.length,
            page,
            limit,
            pages: 1,
          },
        };
      }

      return { items: [], meta: { total: 0, page, limit, pages: 0 } };
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      return { items: [], meta: { total: 0, page, limit, pages: 0 } };
    }
  }
}

export const adminUiService = new AdminUiService();
