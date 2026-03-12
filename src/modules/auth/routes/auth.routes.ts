import { Router } from 'express';
import { authGuard } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { login, logout, me, refreshToken, signup } from '../controllers/auth.controller';
import { loginSchema, logoutSchema, refreshSchema, signupSchema } from '../validators/auth.validator';

export const authRoutes = Router();

authRoutes.post('/signup', validate(signupSchema), signup);
authRoutes.post('/login', validate(loginSchema), login);
authRoutes.post('/logout', validate(logoutSchema), logout);
authRoutes.post('/refresh-token', validate(refreshSchema), refreshToken);
authRoutes.get('/me', authGuard, me);
