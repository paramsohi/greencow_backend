import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dairy.local' },
    update: {},
    create: {
      email: 'admin@dairy.local',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      profile: {
        create: {
          fullName: 'Admin User',
          phone: '+1000000099',
          businessName: 'Dairy Management System',
          businessAddress: 'Admin Panel',
        },
      },
    },
  });

  console.log('✓ Admin user created:', admin.email);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@dairy.local' },
    update: {},
    create: {
      email: 'owner@dairy.local',
      passwordHash,
      role: 'OWNER',
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
