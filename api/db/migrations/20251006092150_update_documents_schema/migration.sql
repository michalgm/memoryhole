
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Coordinator', 'Operator', 'Restricted');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING ("role"::text::"Role");
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Operator'::"Role";

ALTER TABLE "collab_documents" RENAME TO "Document";
-- DropForeignKey
ALTER TABLE "Document" RENAME CONSTRAINT "collab_documents_created_by_id_fkey" TO "Document_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "Document" RENAME CONSTRAINT "collab_documents_last_edited_by_fkey" TO "Document_last_edited_by_fkey";

-- DropForeignKey
ALTER TABLE "Document" RENAME CONSTRAINT "collab_documents_parent_id_fkey" TO "Document_parent_id_fkey";

ALTER TABLE "Document" RENAME CONSTRAINT "collab_documents_pkey" TO "Document_pkey";

ALTER INDEX "collab_documents_name_key" RENAME TO "Document_name_key";

-- CreateIndex
ALTER INDEX "collab_documents_type_idx" RENAME TO "Document_type_idx";

-- CreateIndex
ALTER INDEX "collab_documents_created_by_id_idx" RENAME TO "Document_created_by_id_idx";

-- CreateIndex
ALTER INDEX "collab_documents_parent_id_idx" RENAME TO "Document_parent_id_idx";

-- CreateIndex
ALTER INDEX "collab_documents_created_at_idx" RENAME TO "Document_created_at_idx";

CREATE UNIQUE INDEX "Document_title_key" ON "Document"("title");

ALTER TABLE "Document" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'Restricted'::"Role";

