-- CreateTable
CREATE TABLE "OptionSet" (
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "OptionSetValues" (
    "option_set" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OptionSet_name_key" ON "OptionSet"("name");

-- CreateIndex
CREATE INDEX "OptionSetValues_option_set_label_idx" ON "OptionSetValues"("option_set", "label");

-- CreateIndex
CREATE UNIQUE INDEX "OptionSetValues_option_set_value_key" ON "OptionSetValues"("option_set", "value");

-- AddForeignKey
ALTER TABLE "OptionSetValues" ADD CONSTRAINT "OptionSetValues_option_set_fkey" FOREIGN KEY ("option_set") REFERENCES "OptionSet"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
