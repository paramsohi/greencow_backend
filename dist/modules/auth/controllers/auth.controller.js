"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.refreshToken = exports.login = exports.signup = void 0;
const async_handler_1 = require("../../../common/middleware/async-handler");
const auth_service_1 = require("../services/auth.service");
exports.signup = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await auth_service_1.authService.signup(req.body);
    res.status(201).json({ success: true, message: 'Signup successful', data });
});
exports.login = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await auth_service_1.authService.login(req.body);
    res.status(200).json({ success: true, message: 'Login successful', data });
});
exports.refreshToken = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await auth_service_1.authService.refresh(req.body.refreshToken);
    res.status(200).json({ success: true, message: 'Token refreshed', data });
});
exports.logout = (0, async_handler_1.asyncHandler)(async (req, res) => {
    await auth_service_1.authService.logout(req.body.refreshToken);
    res.status(200).json({ success: true, message: 'Logout successful' });
});
exports.me = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await auth_service_1.authService.me(req.auth.userId);
    res.status(200).json({ success: true, message: 'Current user fetched', data });
});
//# sourceMappingURL=auth.controller.js.map