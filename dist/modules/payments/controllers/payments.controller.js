"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.updatePayment = exports.listPaymentsByCustomer = exports.listPayments = exports.createPayment = void 0;
const async_handler_1 = require("../../../common/middleware/async-handler");
const payments_service_1 = require("../services/payments.service");
exports.createPayment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await payments_service_1.paymentsService.create(Number(req.params.userId), req.body);
    res.status(201).json({ success: true, message: 'Payment record created', data });
});
exports.listPayments = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await payments_service_1.paymentsService.list(Number(req.params.userId), req.query);
    res.status(200).json({ success: true, message: 'Payment records fetched', data: result.items, meta: result.meta });
});
exports.listPaymentsByCustomer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await payments_service_1.paymentsService.listByCustomer(Number(req.params.customerId), req.auth.userId, req.query);
    res.status(200).json({ success: true, message: 'Payment records fetched', data: result.items, meta: result.meta });
});
exports.updatePayment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await payments_service_1.paymentsService.update(Number(req.params.paymentId), req.auth.userId, req.body);
    res.status(200).json({ success: true, message: 'Payment record updated', data });
});
exports.deletePayment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    await payments_service_1.paymentsService.remove(Number(req.params.paymentId), req.auth.userId);
    res.status(200).json({ success: true, message: 'Payment record deleted' });
});
//# sourceMappingURL=payments.controller.js.map