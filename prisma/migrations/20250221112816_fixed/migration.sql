/*
  Warnings:

  - You are about to drop the column `photTitle` on the `Photos` table. All the data in the column will be lost.
  - Added the required column `photoTitle` to the `Photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photos" DROP COLUMN "photTitle",
ADD COLUMN     "photoTitle" TEXT NOT NULL,
ALTER COLUMN "likes" SET DEFAULT 0;
