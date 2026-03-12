"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt_1.default.hash('Password@123', 10);
    const owner = await prisma.user.upsert({
        where: { email: 'owner@dairy.local' },
        update: {},
        create: {
            email: 'owner@dairy.local',
            passwordHash,
            role: client_1.UserRole.OWNER,
            profile: {
                create: {
                    fullName: 'Dairy Owner',
                    phone: '+1000000000',
                    businessName: 'Happy Cows Dairy',
                    businessAddress: 'Main Market Road',
                },
            },
        },
    });
    const customer = await prisma.customer.create({
        data: {
            userId: owner.id,
            name: 'John Retailer',
            phone: '+1000000001',
            address: 'Town Square',
            openingBalance: 1500,
        },
    });
    await prisma.salesEntry.create({
        data: {
            userId: owner.id,
            customerId: customer.id,
            saleDate: new Date(),
            productType: 'Cow Milk',
            quantityLiters: 25,
            ratePerLiter: 60,
            totalAmount: 1500,
            notes: 'Morning sale',
        },
    });
    await prisma.paymentRecord.create({
        data: {
            userId: owner.id,
            customerId: customer.id,
            paymentDate: new Date(),
            amount: 1000,
            paymentMethod: 'cash',
            reference: 'seed-payment',
            notes: 'Advance',
        },
    });
    await prisma.expenseRecord.create({
        data: {
            userId: owner.id,
            expenseDate: new Date(),
            category: 'Feed',
            amount: 450,
            description: 'Cattle feed purchase',
        },
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map