/*
  Warnings:

  - You are about to drop the column `interestLevel` on the `Rating` table. All the data in the column will be lost.
  - Made the column `ratingValue` on table `Rating` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
update "Rating" r set "ratingValue" = 1 where "ratingValue"  is null;

ALTER TABLE "Rating" DROP COLUMN "interestLevel",
ALTER COLUMN "ratingValue" SET NOT NULL;

-- CreateTable
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "imdbItemId" TEXT,
    "userId" TEXT NOT NULL,
    "interestLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_imdbItemId_fkey" FOREIGN KEY ("imdbItemId") REFERENCES "ImdbItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
