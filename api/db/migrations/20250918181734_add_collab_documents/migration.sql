-- CreateTable
CREATE TABLE "collab_documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "type" TEXT NOT NULL,
    "content" BYTEA NOT NULL,
    "html_content" TEXT,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "last_edited_by" INTEGER,

    CONSTRAINT "collab_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collab_documents_name_key" ON "collab_documents"("name");

-- CreateIndex
CREATE INDEX "collab_documents_type_idx" ON "collab_documents"("type");

-- CreateIndex
CREATE INDEX "collab_documents_created_by_id_idx" ON "collab_documents"("created_by_id");

-- CreateIndex
CREATE INDEX "collab_documents_parent_id_idx" ON "collab_documents"("parent_id");

-- CreateIndex
CREATE INDEX "collab_documents_created_at_idx" ON "collab_documents"("created_at");

-- AddForeignKey
ALTER TABLE "collab_documents" ADD CONSTRAINT "collab_documents_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collab_documents" ADD CONSTRAINT "collab_documents_last_edited_by_fkey" FOREIGN KEY ("last_edited_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collab_documents" ADD CONSTRAINT "collab_documents_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "collab_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
