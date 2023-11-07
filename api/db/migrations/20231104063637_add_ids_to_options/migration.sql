-- AlterTable
ALTER TABLE "OptionSet" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "OptionSet_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OptionSetValues" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "OptionSetValues_pkey" PRIMARY KEY ("id");
