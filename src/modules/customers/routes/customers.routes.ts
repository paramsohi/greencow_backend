import { Router } from 'express';
import { authGuard } from '../../../common/middleware/auth';
import { validate } from '../../../common/middleware/validate';
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from '../controllers/customers.controller';
import {
  createCustomerSchema,
  customerIdSchema,
  listCustomerSchema,
  updateCustomerSchema,
} from '../validators/customers.validator';

export const customerRoutes = Router();

customerRoutes.post('/users/:userId/customers', authGuard, validate(createCustomerSchema), createCustomer);
customerRoutes.get('/users/:userId/customers', authGuard, validate(listCustomerSchema), listCustomers);
customerRoutes.get('/customers/:customerId', authGuard, validate(customerIdSchema), getCustomer);
customerRoutes.patch('/customers/:customerId', authGuard, validate(updateCustomerSchema), updateCustomer);
customerRoutes.delete('/customers/:customerId', authGuard, validate(customerIdSchema), deleteCustomer);
