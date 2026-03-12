"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSale = exports.updateSale = exports.listSales = exports.createSale = void 0;
const async_handler_1 = require("../../../common/middleware/async-handler");
const sales_service_1 = require("../services/sales.service");
exports.createSale = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await sales_service_1.salesService.create(Number(req.params.userId), req.body);
    res.status(201).json({ success: true, message: 'Sale entry created', data });
});
exports.listSales = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await sales_service_1.salesService.list(Number(req.params.userId), req.query);
    res.status(200).json({ success: true, message: 'Sales entries fetched', data: result.items, meta: result.meta });
});
exports.updateSale = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await sales_service_1.salesService.update(Number(req.params.saleId), req.auth.userId, req.body);
    res.status(200).json({ success: true, message: 'Sale entry updated', data });
});
exports.deleteSale = (0, async_handler_1.asyncHandler)(async (req, res) => {
    await sales_service_1.salesService.remove(Number(req.params.saleId), req.auth.userId);
    res.status(200).json({ success: true, message: 'Sale entry deleted' });
});
//# sourceMappingURL=sales.controller.js.map