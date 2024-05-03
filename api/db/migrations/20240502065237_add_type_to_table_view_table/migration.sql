/*
  Warnings:

  - Added the required column `type` to the `TableView` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TableView" ADD COLUMN     "type" TEXT NOT NULL;
