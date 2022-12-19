-- AlterTable
ALTER TABLE "RatingsImportItem" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "RatingsImportItem" ADD CONSTRAINT "RatingsImportItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
