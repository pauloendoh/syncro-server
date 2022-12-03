-- AlterEnum
ALTER TYPE "SyncroItemType" ADD VALUE 'game';

-- AlterTable
ALTER TABLE "SyncroItem" ADD COLUMN     "igdbUrl" TEXT;
