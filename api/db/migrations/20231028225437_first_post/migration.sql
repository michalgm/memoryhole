-- CreateTable
CREATE TABLE "Arrestee" (
    "id" SERIAL NOT NULL,
    "display_field" TEXT NOT NULL,
    "search_field" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "preferred_name" TEXT,
    "pronoun" TEXT,
    "dob" TIMESTAMP(3),
    "email" TEXT,
    "phone_1" TEXT,
    "phone_2" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "notes" TEXT,
    "custom_fields" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdby_id" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedby_id" INTEGER,

    CONSTRAINT "Arrestee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomSchema" (
    "id" SERIAL NOT NULL,
    "table" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "updatedby_id" INTEGER,

    CONSTRAINT "CustomSchema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "notes" TEXT,
    "needs_followup" BOOLEAN NOT NULL DEFAULT false,
    "custom_fields" JSONB,
    "arrestee_id" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdby_id" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedby_id" INTEGER,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotlineLog" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT,
    "notes" TEXT,
    "custom_fields" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdby_id" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedby_id" INTEGER,

    CONSTRAINT "HotlineLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrest" (
    "id" SERIAL NOT NULL,
    "display_field" TEXT NOT NULL,
    "search_field" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "location" TEXT,
    "charges" TEXT,
    "arrest_city" TEXT,
    "jurisdiction" TEXT,
    "citation_number" TEXT,
    "arrestee_id" INTEGER,
    "custom_fields" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdby_id" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedby_id" INTEGER,

    CONSTRAINT "Arrest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "custom_fields" JSONB,
    "role" TEXT DEFAULT 'User',
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Arrestee_search_field_idx" ON "Arrestee"("search_field");

-- CreateIndex
CREATE INDEX "Arrest_search_field_idx" ON "Arrest"("search_field");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Arrestee" ADD CONSTRAINT "Arrestee_createdby_id_fkey" FOREIGN KEY ("createdby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrestee" ADD CONSTRAINT "Arrestee_updatedby_id_fkey" FOREIGN KEY ("updatedby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSchema" ADD CONSTRAINT "CustomSchema_updatedby_id_fkey" FOREIGN KEY ("updatedby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_arrestee_id_fkey" FOREIGN KEY ("arrestee_id") REFERENCES "Arrestee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_createdby_id_fkey" FOREIGN KEY ("createdby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_updatedby_id_fkey" FOREIGN KEY ("updatedby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotlineLog" ADD CONSTRAINT "HotlineLog_createdby_id_fkey" FOREIGN KEY ("createdby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotlineLog" ADD CONSTRAINT "HotlineLog_updatedby_id_fkey" FOREIGN KEY ("updatedby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrest" ADD CONSTRAINT "Arrest_arrestee_id_fkey" FOREIGN KEY ("arrestee_id") REFERENCES "Arrestee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrest" ADD CONSTRAINT "Arrest_createdby_id_fkey" FOREIGN KEY ("createdby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrest" ADD CONSTRAINT "Arrest_updatedby_id_fkey" FOREIGN KEY ("updatedby_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
