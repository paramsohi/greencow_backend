"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersService = exports.CustomersService = void 0;
const api_error_1 = require("../../../common/errors/api-error");
const pagination_1 = require("../../../common/utils/pagination");
const customers_repository_1 = require("../repositories/customers.repository");
class CustomersService {
    async create(userId, body) {
        return customers_repository_1.customersRepository.create(userId, body);
    }
    async list(userId, query) {
        const { page, limit, skip, sortBy, sortOrder } = (0, pagination_1.parsePagination)({ query });
        const search = typeof query.search === 'string' ? query.search : undefined;
        const where = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { phone: { contains: search } },
                ],
            }
            : {};
        const [items, total] = await Promise.all([
            customers_repository_1.customersRepository.list(userId, where, skip, limit, { [sortBy]: sortOrder }),
            customers_repository_1.customersRepository.count(userId, where),
        ]);
        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getById(customerId, authUserId) {
        const item = await customers_repository_1.customersRepository.findById(customerId);
        if (!item || item.userId !== authUserId) {
            throw new api_error_1.ApiError(404, 'Customer not found');
        }
        return item;
    }
    async update(customerId, authUserId, body) {
        const current = await this.getById(customerId, authUserId);
        return customers_repository_1.customersRepository.update(current.id, {
            ...(body.name !== undefined ? { name: body.name } : {}),
            ...(body.phone !== undefined ? { phone: body.phone } : {}),
            ...(body.address !== undefined ? { address: body.address } : {}),
            ...(body.openingBalance !== undefined ? { openingBalance: body.openingBalance } : {}),
        });
    }
    async remove(customerId, authUserId) {
        const current = await this.getById(customerId, authUserId);
        await customers_repository_1.customersRepository.softDelete(current.id);
    }
}
exports.CustomersService = CustomersService;
exports.customersService = new CustomersService();
//# sourceMappingURL=customers.service.js.map