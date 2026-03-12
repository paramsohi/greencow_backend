import { ApiError } from '../../../common/errors/api-error';
import { comparePassword, hashPassword, sha256 } from '../../../common/utils/crypto';
import {
  JwtPayload,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../../common/utils/tokens';
import { authRepository } from '../repositories/auth.repository';
import { AuthResponseDto } from '../dto/auth.dto';

const toAuthResponse = (
  user: {
    id: number;
    email: string;
    role: string;
    profile: {
      fullName: string;
      phone: string | null;
      businessName: string | null;
      businessAddress: string | null;
    } | null;
  },
  tokens: { accessToken: string; refreshToken: string },
): AuthResponseDto => ({
  user: {
    id: user.id,
    email: user.email,
    role: user.role,
    profile: user.profile,
  },
  tokens,
});

export class AuthService {
  async signup(input: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    businessName?: string;
    businessAddress?: string;
  }): Promise<AuthResponseDto> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ApiError(409, 'Email already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.createUser({
      email: input.email,
      passwordHash,
      profile: {
        create: {
          fullName: input.fullName,
          phone: input.phone,
          businessName: input.businessName,
          businessAddress: input.businessAddress,
        },
      },
    });

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const decoded = verifyRefreshToken(refreshToken) as JwtPayload & { exp: number };
    await authRepository.saveRefreshToken(user.id, sha256(refreshToken), new Date(decoded.exp * 1000));

    return toAuthResponse(user, { accessToken, refreshToken });
  }

  async login(input: { email: string; password: string }): Promise<AuthResponseDto> {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const decoded = verifyRefreshToken(refreshToken) as JwtPayload & { exp: number };
    await authRepository.saveRefreshToken(user.id, sha256(refreshToken), new Date(decoded.exp * 1000));

    return toAuthResponse(user, { accessToken, refreshToken });
  }

  async refresh(refreshToken: string) {
    const hashed = sha256(refreshToken);
    const storedToken = await authRepository.findValidToken(hashed);
    if (!storedToken) {
      throw new ApiError(401, 'Refresh token invalid or expired');
    }

    const payload = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);
    const decoded = verifyRefreshToken(newRefreshToken) as JwtPayload & { exp: number };

    await authRepository.revokeToken(hashed);
    await authRepository.saveRefreshToken(payload.userId, sha256(newRefreshToken), new Date(decoded.exp * 1000));

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    await authRepository.revokeToken(sha256(refreshToken));
  }

  async me(userId: number) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
  }
}

export const authService = new AuthService();
