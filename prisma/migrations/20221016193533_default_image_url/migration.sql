/*
  Warnings:

  - Made the column `imageUrl` on table `ImdbItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ImdbItem" ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "imageUrl" SET DEFAULT '';
