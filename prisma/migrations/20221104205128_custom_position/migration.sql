-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "pictureUrl" SET DEFAULT 'https://twirpz.files.wordpress.com/2015/06/twitter-avi-gender-balanced-figure.png';

-- CreateTable
CREATE TABLE "CustomPosition" (
    "id" TEXT NOT NULL,
    "imdbItemId" TEXT,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomPosition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomPosition" ADD CONSTRAINT "CustomPosition_imdbItemId_fkey" FOREIGN KEY ("imdbItemId") REFERENCES "ImdbItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPosition" ADD CONSTRAINT "CustomPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
