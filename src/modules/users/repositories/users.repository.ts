import { prisma } from '../../../config/prisma';

export class UsersRepository {
  findById(userId: number) {
    return prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: { profile: true },
    });
  }

  updateProfile(userId: number, data: {
    fullName?: string;
    phone?: string;
    businessName?: string;
    businessAddress?: string;
    dairySettings?: {
      buffaloes: number;
      cows: number;
      sheep: number;
    };
    hasCompletedDairySetup?: boolean;
    isActive?: boolean;
  }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isActive: data.isActive,
        profile: {
          upsert: {
            create: {
              fullName: data.fullName ?? 'Unnamed',
              phone: data.phone,
              businessName: data.businessName,
              businessAddress: data.businessAddress,
              dairySettings: data.dairySettings,
              hasCompletedDairySetup: data.hasCompletedDairySetup ?? false,
            },
            update: {
              ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
              ...(data.phone !== undefined ? { phone: data.phone } : {}),
              ...(data.businessName !== undefined ? { businessName: data.businessName } : {}),
              ...(data.businessAddress !== undefined ? { businessAddress: data.businessAddress } : {}),
              ...(data.dairySettings !== undefined ? { dairySettings: data.dairySettings } : {}),
              ...(data.hasCompletedDairySetup !== undefined ? { hasCompletedDairySetup: data.hasCompletedDairySetup } : {}),
            },
          },
        },
      },
      include: { profile: true },
    });
  }
}

export const usersRepository = new UsersRepository();
