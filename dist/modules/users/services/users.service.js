"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = exports.UsersService = void 0;
const api_error_1 = require("../../../common/errors/api-error");
const users_repository_1 = require("../repositories/users.repository");
class UsersService {
    async getById(userId) {
        const user = await users_repository_1.usersRepository.findById(userId);
        if (!user) {
            throw new api_error_1.ApiError(404, 'User not found');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: user.profile,
            isActive: user.isActive,
        };
    }
    async update(userId, payload) {
        const user = await users_repository_1.usersRepository.findById(userId);
        if (!user) {
            throw new api_error_1.ApiError(404, 'User not found');
        }
        const updated = await users_repository_1.usersRepository.updateProfile(userId, payload);
        return {
            id: updated.id,
            email: updated.email,
            role: updated.role,
            profile: updated.profile,
            isActive: updated.isActive,
        };
    }
}
exports.UsersService = UsersService;
exports.usersService = new UsersService();
//# sourceMappingURL=users.service.js.map