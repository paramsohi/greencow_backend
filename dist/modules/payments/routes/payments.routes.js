"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../../common/middleware/auth");
const validate_1 = require("../../../common/middleware/validate");
const payments_controller_1 = require("../controllers/payments.controller");
const payments_validator_1 = require("../validators/payments.validator");
exports.paymentRoutes = (0, express_1.Router)();
exports.paymentRoutes.post('/users/:userId/payments', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(payments_validator_1.createPaymentSchema), payments_controller_1.createPayment);
exports.paymentRoutes.get('/users/:userId/payments', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(payments_validator_1.listPaymentsSchema), payments_controller_1.listPayments);
exports.paymentRoutes.patch('/payments/:paymentId', auth_1.authGuard, (0, validate_1.validate)(payments_validator_1.updatePaymentSchema), payments_controller_1.updatePayment);
exports.paymentRoutes.delete('/payments/:paymentId', auth_1.authGuard, (0, validate_1.validate)(payments_validator_1.paymentIdSchema), payments_controller_1.deletePayment);
//# sourceMappingURL=payments.routes.js.map