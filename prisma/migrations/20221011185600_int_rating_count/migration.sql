/*
  Warnings:

  - You are about to alter the column `ratingCount` on the `ImdbItem` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "ImdbItem" ALTER COLUMN "ratingCount" SET DATA TYPE INTEGER;
