/*
  Warnings:

  - You are about to drop the column `arrestee_id` on the `Log` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_arrestee_id_fkey";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "arrestee_id",
ADD COLUMN     "action_id" INTEGER;

-- CreateTable
CREATE TABLE "_ArrestToLog" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArrestToLog_AB_unique" ON "_ArrestToLog"("A", "B");

-- CreateIndex
CREATE INDEX "_ArrestToLog_B_index" ON "_ArrestToLog"("B");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "Action"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArrestToLog" ADD CONSTRAINT "_ArrestToLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Arrest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArrestToLog" ADD CONSTRAINT "_ArrestToLog_B_fkey" FOREIGN KEY ("B") REFERENCES "Log"("id") ON DELETE CASCADE ON UPDATE CASCADE;
