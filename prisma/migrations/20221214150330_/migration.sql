-- RenameForeignKey
ALTER TABLE "ItemRecommendation" RENAME CONSTRAINT "ItemRecommendation_userId_fkey" TO "ItemRecommendation_fromUserId_fkey";
