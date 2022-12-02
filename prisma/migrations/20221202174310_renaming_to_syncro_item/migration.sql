/*
  Warnings:

  - You are about to drop the column `imdbItemId` on the `CustomPosition` table. All the data in the column will be lost.
  - You are about to drop the column `imdbItemId` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `imdbItemId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the `ImdbItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
ALTER TYPE "ImdbItemType" RENAME TO "SyncroItemType";


-- DropForeignKey
ALTER TABLE "CustomPosition" RENAME COLUMN "imdbItemId" TO "syncroItemId";

-- DropForeignKey
ALTER TABLE "Interest" RENAME COLUMN "imdbItemId" TO "syncroItemId";


-- DropForeignKey
ALTER TABLE "Rating" RENAME COLUMN "imdbItemId" TO "syncroItemId";


ALTER TABLE "ImdbItem" RENAME TO "SyncroItem";



