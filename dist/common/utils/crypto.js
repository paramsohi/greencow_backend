"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../config/env");
const hashPassword = (value) => bcrypt_1.default.hash(value, env_1.env.BCRYPT_SALT_ROUNDS);
exports.hashPassword = hashPassword;
const comparePassword = (plain, hash) => bcrypt_1.default.compare(plain, hash);
exports.comparePassword = comparePassword;
const sha256 = (value) => crypto_1.default.createHash('sha256').update(value, 'utf8').digest('hex');
exports.sha256 = sha256;
//# sourceMappingURL=crypto.js.map