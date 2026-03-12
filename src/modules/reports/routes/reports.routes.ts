import { Router } from 'express';
import { authGuard, ownershipGuard } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { customerLedger, dailySalesSummary, monthlySummary } from '../controllers/reports.controller';
import { customerLedgerSchema, userReportsQuerySchema } from '../validators/reports.validator';

export const reportRoutes = Router();

reportRoutes.get('/:userId/reports/daily-sales-summary', authGuard, ownershipGuard, validate(userReportsQuerySchema), dailySalesSummary);
reportRoutes.get('/:userId/reports/monthly-summary', authGuard, ownershipGuard, validate(userReportsQuerySchema), monthlySummary);
reportRoutes.get('/:userId/reports/customer-ledger/:customerId', authGuard, ownershipGuard, validate(customerLedgerSchema), customerLedger);
