-- AlterTable
ALTER TABLE "SyncroItem" RENAME CONSTRAINT "ImdbItem_pkey" TO "SyncroItem_pkey";

-- RenameForeignKey
ALTER TABLE "CustomPosition" RENAME CONSTRAINT "CustomPosition_imdbItemId_fkey" TO "CustomPosition_syncroItemId_fkey";

-- RenameForeignKey
ALTER TABLE "Interest" RENAME CONSTRAINT "Interest_imdbItemId_fkey" TO "Interest_syncroItemId_fkey";

-- RenameForeignKey
ALTER TABLE "Rating" RENAME CONSTRAINT "Rating_imdbItemId_fkey" TO "Rating_syncroItemId_fkey";
