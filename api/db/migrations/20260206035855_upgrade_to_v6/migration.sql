-- AlterTable
ALTER TABLE "_ArrestToLog" ADD CONSTRAINT "_ArrestToLog_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArrestToLog_AB_unique";
