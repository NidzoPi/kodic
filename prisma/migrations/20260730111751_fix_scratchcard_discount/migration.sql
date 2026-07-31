/*
  Warnings:

  - You are about to alter the column `discount` on the `ScratchCard` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "ScratchCard" ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2);
