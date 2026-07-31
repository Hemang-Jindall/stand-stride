-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('FACILITATOR', 'COORDINATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';
