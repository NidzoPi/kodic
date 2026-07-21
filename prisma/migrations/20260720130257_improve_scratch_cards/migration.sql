/*
  Warnings:

  - Added the required column `discount` to the `ScratchCard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ScratchCard" DROP CONSTRAINT "ScratchCard_userId_fkey";

-- AlterTable
ALTER TABLE "ScratchCard" ADD COLUMN     "discount" INTEGER NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ScratchCard" ADD CONSTRAINT "ScratchCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
