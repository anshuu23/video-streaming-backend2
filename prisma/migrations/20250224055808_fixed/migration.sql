-- DropForeignKey
ALTER TABLE "Photos" DROP CONSTRAINT "Photos_id_fkey";

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
