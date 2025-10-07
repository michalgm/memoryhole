/*
  Warnings:

  - You are about to drop the column `role` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "role",
ADD COLUMN     "accessRole" "Role" NOT NULL DEFAULT 'Restricted',
ADD COLUMN     "editRole" "Role" NOT NULL DEFAULT 'Coordinator';
