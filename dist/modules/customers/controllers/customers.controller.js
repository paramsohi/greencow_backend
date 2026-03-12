"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomer = exports.listCustomers = exports.createCustomer = void 0;
const async_handler_1 = require("../../../common/middleware/async-handler");
const customers_service_1 = require("../services/customers.service");
exports.createCustomer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.userId);
    const data = await customers_service_1.customersService.create(userId, req.body);
    res.status(201).json({ success: true, message: 'Customer created', data });
});
exports.listCustomers = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.userId);
    const result = await customers_service_1.customersService.list(userId, req.query);
    res.status(200).json({ success: true, message: 'Customers fetched', data: result.items, meta: result.meta });
});
exports.getCustomer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await customers_service_1.customersService.getById(Number(req.params.customerId), req.auth.userId);
    res.status(200).json({ success: true, message: 'Customer fetched', data });
});
exports.updateCustomer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await customers_service_1.customersService.update(Number(req.params.customerId), req.auth.userId, req.body);
    res.status(200).json({ success: true, message: 'Customer updated', data });
});
exports.deleteCustomer = (0, async_handler_1.asyncHandler)(async (req, res) => {
    await customers_service_1.customersService.remove(Number(req.params.customerId), req.auth.userId);
    res.status(200).json({ success: true, message: 'Customer deleted' });
});
//# sourceMappingURL=customers.controller.js.map