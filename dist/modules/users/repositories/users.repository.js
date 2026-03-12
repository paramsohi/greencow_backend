"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = exports.UsersRepository = void 0;
const prisma_1 = require("../../../config/prisma");
class UsersRepository {
    findById(userId) {
        return prisma_1.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            include: { profile: true },
        });
    }
    updateProfile(userId, data) {
        return prisma_1.prisma.user.update({
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
exports.UsersRepository = UsersRepository;
exports.usersRepository = new UsersRepository();
//# sourceMappingURL=users.repository.js.map