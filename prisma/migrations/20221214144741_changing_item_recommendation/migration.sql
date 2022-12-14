-- AlterTable
ALTER TABLE "ItemRecommendation" ADD COLUMN     "toUserId" TEXT;

-- AddForeignKey
ALTER TABLE "ItemRecommendation" ADD CONSTRAINT "ItemRecommendation_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
