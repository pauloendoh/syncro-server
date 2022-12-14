/*
  Warnings:

  - You are about to drop the column `userId` on the `ItemRecommendation` table. All the data in the column will be lost.
  - Added the required column `fromUserId` to the `ItemRecommendation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey

-- AlterTable
ALTER TABLE "ItemRecommendation" RENAME COLUMN "userId" TO "fromUserId";
