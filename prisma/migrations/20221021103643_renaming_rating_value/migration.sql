/*
  Warnings:

  - You are about to drop the column `value` on the `Rating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rating" RENAME COLUMN "value" TO "ratingValue"
