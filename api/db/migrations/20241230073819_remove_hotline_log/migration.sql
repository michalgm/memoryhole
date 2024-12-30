/*
  Warnings:

  - You are about to drop the `HotlineLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HotlineLog" DROP CONSTRAINT "HotlineLog_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "HotlineLog" DROP CONSTRAINT "HotlineLog_updated_by_id_fkey";

-- DropTable
DROP TABLE "HotlineLog";
