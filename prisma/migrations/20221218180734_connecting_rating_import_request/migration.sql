/*
  Warnings:

  - Added the required column `requestId` to the `RatingsImportItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RatingsImportItem" ADD COLUMN     "requestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RatingsImportItem" ADD CONSTRAINT "RatingsImportItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "RatingsImportRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
