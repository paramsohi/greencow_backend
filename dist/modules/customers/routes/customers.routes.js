"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../../common/middleware/auth");
const validate_1 = require("../../../common/middleware/validate");
const customers_controller_1 = require("../controllers/customers.controller");
const customers_validator_1 = require("../validators/customers.validator");
exports.customerRoutes = (0, express_1.Router)();
exports.customerRoutes.post('/users/:userId/customers', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(customers_validator_1.createCustomerSchema), customers_controller_1.createCustomer);
exports.customerRoutes.get('/users/:userId/customers', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(customers_validator_1.listCustomerSchema), customers_controller_1.listCustomers);
exports.customerRoutes.get('/customers/:customerId', auth_1.authGuard, (0, validate_1.validate)(customers_validator_1.customerIdSchema), customers_controller_1.getCustomer);
exports.customerRoutes.patch('/customers/:customerId', auth_1.authGuard, (0, validate_1.validate)(customers_validator_1.updateCustomerSchema), customers_controller_1.updateCustomer);
exports.customerRoutes.delete('/customers/:customerId', auth_1.authGuard, (0, validate_1.validate)(customers_validator_1.customerIdSchema), customers_controller_1.deleteCustomer);
//# sourceMappingURL=customers.routes.js.map