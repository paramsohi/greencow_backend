"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(8080),
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().min(8).max(15).default(10),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(900000),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(200),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000'),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map