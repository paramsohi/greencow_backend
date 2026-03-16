"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../../common/middleware/auth");
const validate_1 = require("../../../common/middleware/validate");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../validators/auth.validator");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post('/signup', (0, validate_1.validate)(auth_validator_1.signupSchema), auth_controller_1.signup);
exports.authRoutes.post('/login', (0, validate_1.validate)(auth_validator_1.loginSchema), auth_controller_1.login);
exports.authRoutes.post('/phone/request-otp', (0, validate_1.validate)(auth_validator_1.requestPhoneOtpSchema), auth_controller_1.requestPhoneOtp);
exports.authRoutes.post('/phone/verify-otp', (0, validate_1.validate)(auth_validator_1.verifyPhoneOtpSchema), auth_controller_1.verifyPhoneOtp);
exports.authRoutes.post('/logout', (0, validate_1.validate)(auth_validator_1.logoutSchema), auth_controller_1.logout);
exports.authRoutes.post('/refresh-token', (0, validate_1.validate)(auth_validator_1.refreshSchema), auth_controller_1.refreshToken);
exports.authRoutes.get('/me', auth_1.authGuard, auth_controller_1.me);
//# sourceMappingURL=auth.routes.js.map