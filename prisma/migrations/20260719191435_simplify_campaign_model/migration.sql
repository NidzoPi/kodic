/*
  Warnings:

  - You are about to drop the column `prizeId` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `prizeId` on the `ScratchCard` table. All the data in the column will be lost.
  - You are about to drop the `Prize` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `discount` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCoupons` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaignId` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_prizeId_fkey";

-- DropForeignKey
ALTER TABLE "Prize" DROP CONSTRAINT "Prize_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "ScratchCard" DROP CONSTRAINT "ScratchCard_prizeId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "discount" INTEGER NOT NULL,
ADD COLUMN     "issuedCoupons" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCoupons" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "prizeId",
ADD COLUMN     "campaignId" TEXT NOT NULL,
ADD COLUMN     "discount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ScratchCard" DROP COLUMN "prizeId";

-- DropTable
DROP TABLE "Prize";

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
