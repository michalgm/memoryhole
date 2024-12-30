/*
 Warnings:

 - Made the column `updated_at` on table `SiteSetting` required. This step will fail if there are existing NULL values in that column.
 */
-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "arrest_date_threshold" INTEGER;

