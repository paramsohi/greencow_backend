"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
const prisma_1 = require("../../../config/prisma");
class AuthRepository {
    createUser(data) {
        return prisma_1.prisma.user.create({
            data,
            include: { profile: true },
        });
    }
    findByEmail(email) {
        return prisma_1.prisma.user.findFirst({
            where: {
                email,
                deletedAt: null,
            },
            include: { profile: true },
        });
    }
    findById(id) {
        return prisma_1.prisma.user.findFirst({
            where: { id, deletedAt: null },
            include: { profile: true },
        });
    }
    async saveRefreshToken(userId, tokenHash, expiresAt) {
        return prisma_1.prisma.refreshToken.create({
            data: { userId, tokenHash, expiresAt },
        });
    }
    revokeToken(tokenHash) {
        return prisma_1.prisma.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    findValidToken(tokenHash) {
        return prisma_1.prisma.refreshToken.findFirst({
            where: {
                tokenHash,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
        });
    }
    revokeAllUserTokens(userId) {
        return prisma_1.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
//# sourceMappingURL=auth.repository.js.map