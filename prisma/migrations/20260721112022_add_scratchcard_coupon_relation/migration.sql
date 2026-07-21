/*
  Warnings:

  - A unique constraint covering the columns `[scratchCardId]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scratchCardId` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "scratchCardId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_scratchCardId_key" ON "Coupon"("scratchCardId");

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_scratchCardId_fkey" FOREIGN KEY ("scratchCardId") REFERENCES "ScratchCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
