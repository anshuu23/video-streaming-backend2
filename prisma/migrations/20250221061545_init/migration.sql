-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "isDelted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photos" (
    "id" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "photTitle" TEXT NOT NULL,
    "photoDesc" TEXT NOT NULL,
    "photoTags" TEXT[],
    "likes" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL,
    "photoId" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserComments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserComments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserComments_B_index" ON "_UserComments"("B");

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserComments" ADD CONSTRAINT "_UserComments_A_fkey" FOREIGN KEY ("A") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserComments" ADD CONSTRAINT "_UserComments_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
