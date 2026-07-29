-- AlterTable
ALTER TABLE "Performance" ADD COLUMN     "certificateEligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "overallProgress" INTEGER NOT NULL DEFAULT 0;
