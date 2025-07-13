-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rol" "Rol" NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
