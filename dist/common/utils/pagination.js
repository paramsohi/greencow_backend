"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = void 0;
const parsePagination = (req) => {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
    const skip = (page - 1) * limit;
    const sortBy = String(req.query.sortBy ?? 'createdAt');
    const sortOrder = String(req.query.sortOrder ?? 'desc') === 'asc' ? 'asc' : 'desc';
    return { page, limit, skip, sortBy, sortOrder };
};
exports.parsePagination = parsePagination;
//# sourceMappingURL=pagination.js.map