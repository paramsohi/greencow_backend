import { ApiError } from '../../../common/errors/api-error';
import { usersRepository } from '../repositories/users.repository';

export class UsersService {
  async getById(userId: number) {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      isActive: user.isActive,
    };
  }

  async update(userId: number, payload: {
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
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const updated = await usersRepository.updateProfile(userId, payload);

    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      profile: updated.profile,
      isActive: updated.isActive,
    };
  }
}

export const usersService = new UsersService();
