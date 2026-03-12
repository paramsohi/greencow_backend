"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerLedger = exports.monthlySummary = exports.dailySalesSummary = void 0;
const async_handler_1 = require("../../../common/middleware/async-handler");
const reports_service_1 = require("../services/reports.service");
exports.dailySalesSummary = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await reports_service_1.reportsService.dailySalesSummary(Number(req.params.userId), req.query.date);
    res.status(200).json({ success: true, message: 'Daily sales summary fetched', data });
});
exports.monthlySummary = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await reports_service_1.reportsService.monthlySummary(Number(req.params.userId), req.query.month);
    res.status(200).json({ success: true, message: 'Monthly summary fetched', data });
});
exports.customerLedger = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await reports_service_1.reportsService.customerLedger(Number(req.params.userId), Number(req.params.customerId), req.query.fromDate, req.query.toDate);
    res.status(200).json({ success: true, message: 'Customer ledger fetched', data });
});
//# sourceMappingURL=reports.controller.js.map