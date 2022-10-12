-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "imdbItemId" TEXT,
    "userId" TEXT NOT NULL,
    "value" INTEGER,
    "interestLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_imdbItemId_fkey" FOREIGN KEY ("imdbItemId") REFERENCES "ImdbItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
