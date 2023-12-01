-- DropForeignKey
ALTER TABLE "Arrest" DROP CONSTRAINT "Arrest_arrestee_id_fkey";

-- AddForeignKey
ALTER TABLE "Arrest" ADD CONSTRAINT "Arrest_arrestee_id_fkey" FOREIGN KEY ("arrestee_id") REFERENCES "Arrestee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
