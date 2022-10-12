/*
  Warnings:

  - You are about to alter the column `avgRating` on the `ImdbItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "ImdbItem" ALTER COLUMN "avgRating" SET DATA TYPE DOUBLE PRECISION;
