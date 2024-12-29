-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "updated_by_id" INTEGER;

-- AddForeignKey
ALTER TABLE "SiteSetting" ADD CONSTRAINT "SiteSetting_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
