-- AlterTable
ALTER TABLE "OptionSetValue" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "OptionSetValue_option_set_id_order_idx" ON "OptionSetValue"("option_set_id", "order");
