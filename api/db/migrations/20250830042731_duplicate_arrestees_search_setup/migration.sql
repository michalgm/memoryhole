CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- CreateTable
CREATE TABLE
  "IgnoredDuplicateArrest" (
    "id" SERIAL NOT NULL,
    "arrest1_id" INTEGER NOT NULL,
    "arrest2_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    CONSTRAINT "IgnoredDuplicateArrest_pkey" PRIMARY KEY ("id")
  );

-- CreateIndex
CREATE UNIQUE INDEX "IgnoredDuplicateArrest_arrest1_id_arrest2_id_key" ON "IgnoredDuplicateArrest" ("arrest1_id", "arrest2_id");

-- CreateIndex
CREATE INDEX "Arrest_date_idx" ON "Arrest" ("date");

-- CreateIndex
CREATE INDEX "Arrest_arrest_city_idx" ON "Arrest" ("arrest_city");

-- CreateIndex
CREATE INDEX "Arrestee_last_name_idx" ON "Arrestee" ("last_name");

-- CreateIndex
CREATE INDEX "Arrestee_first_name_idx" ON "Arrestee" ("first_name");

-- CreateIndex
CREATE INDEX "Arrestee_preferred_name_idx" ON "Arrestee" ("preferred_name");

-- AddForeignKey
ALTER TABLE "IgnoredDuplicateArrest"
ADD CONSTRAINT "IgnoredDuplicateArrest_arrest1_id_fkey" FOREIGN KEY ("arrest1_id") REFERENCES "Arrest" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IgnoredDuplicateArrest"
ADD CONSTRAINT "IgnoredDuplicateArrest_arrest2_id_fkey" FOREIGN KEY ("arrest2_id") REFERENCES "Arrest" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IgnoredDuplicateArrest"
ADD CONSTRAINT "IgnoredDuplicateArrest_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
