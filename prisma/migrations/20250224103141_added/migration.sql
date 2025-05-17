-- CreateTable
CREATE TABLE "PhotoLikes" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PhotoLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhotoLikes_userId_photoId_key" ON "PhotoLikes"("userId", "photoId");

-- AddForeignKey
ALTER TABLE "PhotoLikes" ADD CONSTRAINT "PhotoLikes_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoLikes" ADD CONSTRAINT "PhotoLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
