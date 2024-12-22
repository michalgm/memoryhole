-- CreateTable
CREATE TABLE "SiteSetting"(
    "id" text NOT NULL,
    "description" text,
    "value" jsonb NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

INSERT INTO "SiteSetting"
    VALUES ('siteHelp', NULL, '"Help"');

