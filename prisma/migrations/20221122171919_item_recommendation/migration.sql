/*
  Warnings:

  - A unique constraint covering the columns `[itemRecommendationId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "itemRecommendationId" TEXT;

-- CreateTable
CREATE TABLE "ItemRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_itemRecommendationId_key" ON "Notification"("itemRecommendationId");

-- AddForeignKey
ALTER TABLE "ItemRecommendation" ADD CONSTRAINT "ItemRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRecommendation" ADD CONSTRAINT "ItemRecommendation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ImdbItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_itemRecommendationId_fkey" FOREIGN KEY ("itemRecommendationId") REFERENCES "ItemRecommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
