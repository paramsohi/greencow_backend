import { Router } from 'express';
import { authRoutes } from './auth/routes';
import { userRoutes } from './users/routes';
import { customerRoutes } from './customers/routes';
import { salesRoutes } from './sales/routes';
import { paymentRoutes } from './payments/routes';
import { expenseRoutes } from './expenses/routes';
import { reportRoutes } from './reports/routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/', customerRoutes);
apiRouter.use('/', salesRoutes);
apiRouter.use('/', paymentRoutes);
apiRouter.use('/', expenseRoutes);
apiRouter.use('/users', reportRoutes);
