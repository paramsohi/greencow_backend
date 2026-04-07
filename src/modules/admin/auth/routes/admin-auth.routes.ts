import { Router } from 'express';
import { validate } from '../../../../common/middleware/validate';
import { adminLogin, adminLogout } from '../controllers/admin-auth.controller';
import { adminLoginSchema, adminLogoutSchema } from '../validators/admin-auth.validator';

export const adminAuthRoutes = Router();

adminAuthRoutes.post('/login', validate(adminLoginSchema), adminLogin);
adminAuthRoutes.post('/logout', validate(adminLogoutSchema), adminLogout);
