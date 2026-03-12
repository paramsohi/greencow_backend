"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../../common/middleware/auth");
const validate_1 = require("../../../common/middleware/validate");
const reports_controller_1 = require("../controllers/reports.controller");
const reports_validator_1 = require("../validators/reports.validator");
exports.reportRoutes = (0, express_1.Router)();
exports.reportRoutes.get('/:userId/reports/daily-sales-summary', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(reports_validator_1.userReportsQuerySchema), reports_controller_1.dailySalesSummary);
exports.reportRoutes.get('/:userId/reports/monthly-summary', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(reports_validator_1.userReportsQuerySchema), reports_controller_1.monthlySummary);
exports.reportRoutes.get('/:userId/reports/customer-ledger/:customerId', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(reports_validator_1.customerLedgerSchema), reports_controller_1.customerLedger);
//# sourceMappingURL=reports.routes.js.map