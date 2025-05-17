/*
  Warnings:

  - You are about to drop the `_UserComments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserComments" DROP CONSTRAINT "_UserComments_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserComments" DROP CONSTRAINT "_UserComments_B_fkey";

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_UserComments";

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
