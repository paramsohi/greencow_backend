"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const api_error_1 = require("../../../common/errors/api-error");
const crypto_1 = require("../../../common/utils/crypto");
const tokens_1 = require("../../../common/utils/tokens");
const auth_repository_1 = require("../repositories/auth.repository");
const toAuthResponse = (user, tokens) => ({
    user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
    },
    tokens,
});
class AuthService {
    async signup(input) {
        const existing = await auth_repository_1.authRepository.findByEmail(input.email);
        if (existing) {
            throw new api_error_1.ApiError(409, 'Email already exists');
        }
        const passwordHash = await (0, crypto_1.hashPassword)(input.password);
        const user = await auth_repository_1.authRepository.createUser({
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
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, tokens_1.signAccessToken)(payload);
        const refreshToken = (0, tokens_1.signRefreshToken)(payload);
        const decoded = (0, tokens_1.verifyRefreshToken)(refreshToken);
        await auth_repository_1.authRepository.saveRefreshToken(user.id, (0, crypto_1.sha256)(refreshToken), new Date(decoded.exp * 1000));
        return toAuthResponse(user, { accessToken, refreshToken });
    }
    async login(input) {
        const user = await auth_repository_1.authRepository.findByEmail(input.email);
        if (!user) {
            throw new api_error_1.ApiError(401, 'Invalid credentials');
        }
        const valid = await (0, crypto_1.comparePassword)(input.password, user.passwordHash);
        if (!valid) {
            throw new api_error_1.ApiError(401, 'Invalid credentials');
        }
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, tokens_1.signAccessToken)(payload);
        const refreshToken = (0, tokens_1.signRefreshToken)(payload);
        const decoded = (0, tokens_1.verifyRefreshToken)(refreshToken);
        await auth_repository_1.authRepository.saveRefreshToken(user.id, (0, crypto_1.sha256)(refreshToken), new Date(decoded.exp * 1000));
        return toAuthResponse(user, { accessToken, refreshToken });
    }
    async refresh(refreshToken) {
        const hashed = (0, crypto_1.sha256)(refreshToken);
        const storedToken = await auth_repository_1.authRepository.findValidToken(hashed);
        if (!storedToken) {
            throw new api_error_1.ApiError(401, 'Refresh token invalid or expired');
        }
        const payload = (0, tokens_1.verifyRefreshToken)(refreshToken);
        const accessToken = (0, tokens_1.signAccessToken)(payload);
        const newRefreshToken = (0, tokens_1.signRefreshToken)(payload);
        const decoded = (0, tokens_1.verifyRefreshToken)(newRefreshToken);
        await auth_repository_1.authRepository.revokeToken(hashed);
        await auth_repository_1.authRepository.saveRefreshToken(payload.userId, (0, crypto_1.sha256)(newRefreshToken), new Date(decoded.exp * 1000));
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    async logout(refreshToken) {
        await auth_repository_1.authRepository.revokeToken((0, crypto_1.sha256)(refreshToken));
    }
    async me(userId) {
        const user = await auth_repository_1.authRepository.findById(userId);
        if (!user) {
            throw new api_error_1.ApiError(404, 'User not found');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: user.profile,
        };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map