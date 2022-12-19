/*
  Warnings:

  - A unique constraint covering the columns `[ratingsImportRequestId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "ratingsImportRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_ratingsImportRequestId_key" ON "Notification"("ratingsImportRequestId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_ratingsImportRequestId_fkey" FOREIGN KEY ("ratingsImportRequestId") REFERENCES "RatingsImportRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
