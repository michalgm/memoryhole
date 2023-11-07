/*
  Warnings:

  - You are about to drop the column `description` on the `OptionSet` table. All the data in the column will be lost.
  - You are about to drop the column `option_set` on the `OptionSetValue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[option_set_id,value]` on the table `OptionSetValue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `option_set_id` to the `OptionSetValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OptionSetValue" DROP CONSTRAINT "OptionSetValue_option_set_fkey";

-- DropIndex
DROP INDEX "OptionSetValue_option_set_label_idx";

-- DropIndex
DROP INDEX "OptionSetValue_option_set_value_key";

-- AlterTable
ALTER TABLE "OptionSet" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "OptionSetValue" DROP COLUMN "option_set",
ADD COLUMN     "option_set_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "OptionSetValue_option_set_id_label_idx" ON "OptionSetValue"("option_set_id", "label");

-- CreateIndex
CREATE UNIQUE INDEX "OptionSetValue_option_set_id_value_key" ON "OptionSetValue"("option_set_id", "value");

-- AddForeignKey
ALTER TABLE "OptionSetValue" ADD CONSTRAINT "OptionSetValue_option_set_id_fkey" FOREIGN KEY ("option_set_id") REFERENCES "OptionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
