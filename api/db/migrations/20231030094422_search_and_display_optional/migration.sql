-- AlterTable
ALTER TABLE "Arrest" ALTER COLUMN "display_field" DROP NOT NULL,
ALTER COLUMN "search_field" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Arrestee" ALTER COLUMN "display_field" DROP NOT NULL,
ALTER COLUMN "search_field" DROP NOT NULL;
