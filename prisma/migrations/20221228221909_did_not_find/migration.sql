-- CreateTable
CREATE TABLE "DidNotFind" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "DidNotFind_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DidNotFind" ADD CONSTRAINT "DidNotFind_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
