-- CreateEnum
CREATE TYPE "ImdbItemType" AS ENUM ('tvSeries', 'movie');

-- CreateTable
CREATE TABLE "ImdbItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ImdbItemType" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "avgRating" DECIMAL(65,30) NOT NULL,
    "ratingCount" BIGINT NOT NULL,

    CONSTRAINT "ImdbItem_pkey" PRIMARY KEY ("id")
);
