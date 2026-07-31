-- CreateTable
CREATE TABLE "MasterData" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT,
    "center" TEXT,
    "purpose" TEXT,
    "mapUrl" TEXT,
    "formUrl" TEXT,
    "driveUrl" TEXT,
    "mentorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterData_mentorId_key" ON "MasterData"("mentorId");

-- AddForeignKey
ALTER TABLE "MasterData" ADD CONSTRAINT "MasterData_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
