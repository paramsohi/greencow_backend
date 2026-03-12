"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesService = exports.SalesService = void 0;
const api_error_1 = require("../../../common/errors/api-error");
const pagination_1 = require("../../../common/utils/pagination");
const sales_repository_1 = require("../repositories/sales.repository");
class SalesService {
    create(userId, body) {
        return sales_repository_1.salesRepository.create(userId, {
            ...body,
            saleDate: new Date(body.saleDate),
        });
    }
    async list(userId, query) {
        const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.parsePagination)({ query });
        const where = {
            ...(query.customerId ? { customerId: Number(query.customerId) } : {}),
            ...(query.productType ? { productType: { contains: String(query.productType) } } : {}),
            ...(query.fromDate || query.toDate
                ? {
                    saleDate: {
                        ...(query.fromDate ? { gte: new Date(String(query.fromDate)) } : {}),
                        ...(query.toDate ? { lte: new Date(String(query.toDate)) } : {}),
                    },
                }
                : {}),
        };
        const [items, total] = await Promise.all([
            sales_repository_1.salesRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
            sales_repository_1.salesRepository.count(userId, where),
        ]);
        return {
            items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getOwnedSale(saleId, authUserId) {
        const sale = await sales_repository_1.salesRepository.findById(saleId);
        if (!sale || sale.userId !== authUserId) {
            throw new api_error_1.ApiError(404, 'Sale entry not found');
        }
        return sale;
    }
    async update(saleId, authUserId, body) {
        const existing = await this.getOwnedSale(saleId, authUserId);
        const quantity = body.quantityLiters ?? Number(existing.quantityLiters);
        const rate = body.ratePerLiter ?? Number(existing.ratePerLiter);
        return sales_repository_1.salesRepository.update(saleId, {
            ...(body.customerId !== undefined ? { customerId: body.customerId } : {}),
            ...(body.saleDate ? { saleDate: new Date(body.saleDate) } : {}),
            ...(body.productType ? { productType: body.productType } : {}),
            ...(body.quantityLiters !== undefined ? { quantityLiters: body.quantityLiters } : {}),
            ...(body.ratePerLiter !== undefined ? { ratePerLiter: body.ratePerLiter } : {}),
            ...(body.notes !== undefined ? { notes: body.notes } : {}),
            totalAmount: quantity * rate,
        });
    }
    async remove(saleId, authUserId) {
        await this.getOwnedSale(saleId, authUserId);
        await sales_repository_1.salesRepository.softDelete(saleId);
    }
}
exports.SalesService = SalesService;
exports.salesService = new SalesService();
//# sourceMappingURL=sales.service.js.map