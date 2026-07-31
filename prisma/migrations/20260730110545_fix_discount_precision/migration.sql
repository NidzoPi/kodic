/*
  Warnings:

  - You are about to alter the column `discount` on the `Campaign` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `discount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2);
