/*
  Warnings:

  - You are about to drop the column `time` on the `HotlineLog` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `HotlineLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `HotlineLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HotlineLog" DROP COLUMN "time",
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes_raw" TEXT,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;
