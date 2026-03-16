"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const api_error_1 = require("../errors/api-error");
const validate = (schema) => {
    return (req, _res, next) => {
        const result = schema.safeParse({
            body: req.body ?? {},
            params: req.params ?? {},
            query: req.query ?? {},
        });
        if (!result.success) {
            return next(new api_error_1.ApiError(400, 'Validation failed', result.error.flatten()));
        }
        const parsed = result.data;
        // Express 5 exposes req.query/req.params via getters; avoid reassigning them.
        req.body = parsed.body;
        return next();
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map