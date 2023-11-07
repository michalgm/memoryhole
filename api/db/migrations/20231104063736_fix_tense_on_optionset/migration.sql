/*
  Warnings:

  - You are about to drop the `OptionSetValues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OptionSetValues" DROP CONSTRAINT "OptionSetValues_option_set_fkey";

-- DropTable
DROP TABLE "OptionSetValues";

-- CreateTable
CREATE TABLE "OptionSetValue" (
    "option_set" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "OptionSetValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OptionSetValue_option_set_label_idx" ON "OptionSetValue"("option_set", "label");

-- CreateIndex
CREATE UNIQUE INDEX "OptionSetValue_option_set_value_key" ON "OptionSetValue"("option_set", "value");

-- AddForeignKey
ALTER TABLE "OptionSetValue" ADD CONSTRAINT "OptionSetValue_option_set_fkey" FOREIGN KEY ("option_set") REFERENCES "OptionSet"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
