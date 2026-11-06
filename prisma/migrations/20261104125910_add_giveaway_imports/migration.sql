-- CreateEnum
CREATE TYPE "GiveawayImportStatus" AS ENUM ('PENDING', 'IMPORTED', 'DISMISSED');

-- CreateTable
CREATE TABLE "GiveawayImport" (
    "id" TEXT NOT NULL,
    "sourcePostId" TEXT NOT NULL,
    "sourcePageId" TEXT NOT NULL,
    "sourcePageName" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "originalUrl" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "status" "GiveawayImportStatus" NOT NULL DEFAULT 'PENDING',
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "giveawayId" TEXT,

    CONSTRAINT "GiveawayImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayImport_sourcePostId_key" ON "GiveawayImport"("sourcePostId");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayImport_giveawayId_key" ON "GiveawayImport"("giveawayId");

-- CreateIndex
CREATE INDEX "GiveawayImport_status_importedAt_idx" ON "GiveawayImport"("status", "importedAt");

-- CreateIndex
CREATE INDEX "GiveawayImport_sourcePageId_idx" ON "GiveawayImport"("sourcePageId");

-- AddForeignKey
ALTER TABLE "GiveawayImport" ADD CONSTRAINT "GiveawayImport_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "Giveaway"("id") ON DELETE SET NULL ON UPDATE CASCADE;
