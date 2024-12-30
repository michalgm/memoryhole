/*
  Warnings:

  - Made the column `updated_at` on table `SiteSetting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SiteSetting" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "arrest_date_threshold" INTEGER;
