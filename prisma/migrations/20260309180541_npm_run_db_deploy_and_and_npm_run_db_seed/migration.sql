/*
  Warnings:

  - You are about to alter the column `address` on the `customers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `description` on the `expense_records` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `notes` on the `payment_records` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `token_hash` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `notes` on the `sales_entries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `business_address` on the `user_profiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `password_hash` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `customers` MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `expense_records` MODIFY `description` VARCHAR(191) NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `payment_records` MODIFY `payment_method` VARCHAR(191) NOT NULL,
    MODIFY `notes` VARCHAR(191) NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `token_hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sales_entries` MODIFY `product_type` VARCHAR(191) NOT NULL,
    MODIFY `notes` VARCHAR(191) NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user_profiles` MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `business_address` VARCHAR(191) NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` MODIFY `password_hash` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;
