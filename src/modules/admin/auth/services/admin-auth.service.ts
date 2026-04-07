import { ApiError } from '../../../../common/errors/api-error';
import { comparePassword, sha256 } from '../../../../common/utils/crypto';
import { JwtPayload, signAccessToken, signRefreshToken, verifyRefreshToken } from '../../../../common/utils/tokens';
import { authRepository } from '../../../auth/repositories/auth.repository';

export class AdminAuthService {
  async adminLogin(input: { email: string; password: string }): Promise<{
    user: { id: number; email: string; role: string; profile: any };
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const user = await authRepository.findByEmail(input.email);
    if (!user || user.role !== 'ADMIN') {
      throw new ApiError(401, 'Invalid admin credentials');
    }

    const passwordValid = await comparePassword(input.password, user.passwordHash);
    if (!passwordValid) {
      throw new ApiError(401, 'Invalid admin credentials');
    }

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const decoded = verifyRefreshToken(refreshToken) as JwtPayload & { exp: number };
    await authRepository.saveRefreshToken(user.id, sha256(refreshToken), new Date(decoded.exp * 1000));

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      tokens: { accessToken, refreshToken },
    };
  }

  async adminLogout(refreshToken: string): Promise<void> {
    await authRepository.revokeToken(sha256(refreshToken));
  }
}

export const adminAuthService = new AdminAuthService();
