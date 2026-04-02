"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../../common/middleware/auth");
const validate_1 = require("../../../common/middleware/validate");
const sales_controller_1 = require("../controllers/sales.controller");
const sales_validator_1 = require("../validators/sales.validator");
exports.salesRoutes = (0, express_1.Router)();
exports.salesRoutes.post('/users/:userId/sales', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(sales_validator_1.createSaleSchema), sales_controller_1.createSale);
exports.salesRoutes.get('/users/:userId/sales', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(sales_validator_1.listSalesSchema), sales_controller_1.listSales);
exports.salesRoutes.get('/customers/:customerId/sales', auth_1.authGuard, (0, validate_1.validate)(sales_validator_1.customerSalesListSchema), sales_controller_1.listSalesByCustomer);
exports.salesRoutes.patch('/sales/:saleId', auth_1.authGuard, (0, validate_1.validate)(sales_validator_1.updateSaleSchema), sales_controller_1.updateSale);
exports.salesRoutes.delete('/sales/:saleId', auth_1.authGuard, (0, validate_1.validate)(sales_validator_1.saleIdSchema), sales_controller_1.deleteSale);
//# sourceMappingURL=sales.routes.js.map