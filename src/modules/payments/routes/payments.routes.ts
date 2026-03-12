import { Router } from 'express';
import { authGuard, ownershipGuard } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { createPayment, deletePayment, listPayments, updatePayment } from '../controllers/payments.controller';
import {
  createPaymentSchema,
  listPaymentsSchema,
  paymentIdSchema,
  updatePaymentSchema,
} from '../validators/payments.validator';

export const paymentRoutes = Router();

paymentRoutes.post('/users/:userId/payments', authGuard, ownershipGuard, validate(createPaymentSchema), createPayment);
paymentRoutes.get('/users/:userId/payments', authGuard, ownershipGuard, validate(listPaymentsSchema), listPayments);
paymentRoutes.patch('/payments/:paymentId', authGuard, validate(updatePaymentSchema), updatePayment);
paymentRoutes.delete('/payments/:paymentId', authGuard, validate(paymentIdSchema), deletePayment);
