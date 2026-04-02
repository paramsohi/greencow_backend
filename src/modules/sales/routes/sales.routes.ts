import { Router } from 'express';
import { authGuard, ownershipGuard } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import { createSale, deleteSale, listSales, listSalesByCustomer, updateSale } from '../controllers/sales.controller';
import { createSaleSchema, customerSalesListSchema, listSalesSchema, saleIdSchema, updateSaleSchema } from '../validators/sales.validator';

export const salesRoutes = Router();

salesRoutes.post('/users/:userId/sales', authGuard, ownershipGuard, validate(createSaleSchema), createSale);
salesRoutes.get('/users/:userId/sales', authGuard, ownershipGuard, validate(listSalesSchema), listSales);
salesRoutes.get('/customers/:customerId/sales', authGuard, validate(customerSalesListSchema), listSalesByCustomer);
salesRoutes.patch('/sales/:saleId', authGuard, validate(updateSaleSchema), updateSale);
salesRoutes.delete('/sales/:saleId', authGuard, validate(saleIdSchema), deleteSale);
