import { Router } from 'express';
import { authGuard, ownershipGuard } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { getUser, updateUser } from '../controllers/users.controller';
import { updateUserSchema, userIdParamSchema } from '../validators/users.validator';

export const userRoutes = Router();

userRoutes.get('/:userId', authGuard, ownershipGuard, validate(userIdParamSchema), getUser);
userRoutes.patch('/:userId/profile', authGuard, ownershipGuard, validate(updateUserSchema), updateUser);
userRoutes.patch('/:userId', authGuard, ownershipGuard, validate(updateUserSchema), updateUser);
