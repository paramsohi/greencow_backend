import { prisma } from '../../../config/prisma';

export class AuthRepository {
  createUser(data: any) {
    return prisma.user.create({
      data,
      include: { profile: true },
    });
  }

  findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: { profile: true },
    });
  }

  findById(id: number) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { profile: true },
    });
  }

  async saveRefreshToken(userId: number, tokenHash: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  revokeToken(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  findValidToken(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  revokeAllUserTokens(userId: number) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

export const authRepository = new AuthRepository();
