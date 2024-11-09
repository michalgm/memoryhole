-- AlterTable
ALTER TABLE "Arrest"
    ADD COLUMN "action_id" INTEGER;

-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "action_ids" INTEGER[];

-- CreateTable
CREATE TABLE "Action"(
    "id" serial NOT NULL,
    "name" text NOT NULL,
    "description" text NOT NULL,
    "start_date" timestamp(3) NOT NULL,
    "end_date" timestamp(3),
    "jurisdiction" text NOT NULL,
    "city" text NOT NULL,
    "custom_fields" jsonb,
    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Arrest"
    ADD CONSTRAINT "Arrest_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "Action"("id") ON DELETE SET NULL ON UPDATE CASCADE;

