"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = void 0;
const async_handler_1 = require("../../../common/middleware/async-handler");
const users_service_1 = require("../services/users.service");
exports.getUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.userId);
    const data = await users_service_1.usersService.getById(userId);
    res.status(200).json({ success: true, message: 'User fetched', data });
});
exports.updateUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const userId = Number(req.params.userId);
    const data = await users_service_1.usersService.update(userId, req.body);
    res.status(200).json({ success: true, message: 'User updated', data });
});
//# sourceMappingURL=users.controller.js.map