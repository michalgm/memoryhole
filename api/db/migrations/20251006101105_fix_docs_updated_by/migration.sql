-- AlterTable
ALTER TABLE "Document" RENAME COLUMN "last_edited_by" TO "updated_by_id";

-- AddForeignKey
ALTER TABLE "Document" RENAME CONSTRAINT "Document_last_edited_by_fkey" TO "Document_updated_by_id_fkey";
