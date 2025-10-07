/*
  Warnings:

  - You are about to drop the column `accessRole` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `editRole` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "accessRole",
DROP COLUMN "editRole",
ADD COLUMN     "access_role" "Role" NOT NULL DEFAULT 'Restricted',
ADD COLUMN     "edit_role" "Role" NOT NULL DEFAULT 'Coordinator';
