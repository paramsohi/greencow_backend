"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../../common/middleware/auth");
const validate_1 = require("../../../common/middleware/validate");
const users_controller_1 = require("../controllers/users.controller");
const users_validator_1 = require("../validators/users.validator");
exports.userRoutes = (0, express_1.Router)();
exports.userRoutes.get('/:userId', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(users_validator_1.userIdParamSchema), users_controller_1.getUser);
exports.userRoutes.patch('/:userId/profile', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(users_validator_1.updateUserSchema), users_controller_1.updateUser);
exports.userRoutes.patch('/:userId', auth_1.authGuard, auth_1.ownershipGuard, (0, validate_1.validate)(users_validator_1.updateUserSchema), users_controller_1.updateUser);
//# sourceMappingURL=users.routes.js.map