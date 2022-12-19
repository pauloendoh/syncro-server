-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_syncroItemId_fkey";

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_syncroItemId_fkey" FOREIGN KEY ("syncroItemId") REFERENCES "SyncroItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
