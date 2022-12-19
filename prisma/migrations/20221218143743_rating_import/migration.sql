-- CreateEnum
CREATE TYPE "RatingsImportRequestStatus" AS ENUM ('started', 'finishedSuccessfully', 'errorWhileInitialScraping');

-- CreateEnum
CREATE TYPE "RatingsImportRequestImportFrom" AS ENUM ('MyAnimeList');

-- CreateEnum
CREATE TYPE "RatingsImportItemStatus" AS ENUM ('waiting', 'importedSuccessfully', 'alreadyRated', 'errorOrNotFound', 'isMovie');

-- CreateTable
CREATE TABLE "RatingsImportRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "importFrom" "RatingsImportRequestImportFrom" NOT NULL DEFAULT 'MyAnimeList',
    "status" "RatingsImportRequestStatus" NOT NULL DEFAULT 'started',
    "remainingItemsQty" INTEGER NOT NULL,

    CONSTRAINT "RatingsImportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingsImportItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "RatingsImportRequestStatus" NOT NULL,
    "syncroItemId" TEXT,
    "ratingValue" INTEGER NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "originalLink" TEXT NOT NULL,
    "errorQty" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RatingsImportItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RatingsImportRequest" ADD CONSTRAINT "RatingsImportRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingsImportItem" ADD CONSTRAINT "RatingsImportItem_syncroItemId_fkey" FOREIGN KEY ("syncroItemId") REFERENCES "SyncroItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
