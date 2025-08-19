-- AlterTable
ALTER TABLE "User"
ALTER COLUMN "role"
SET DEFAULT 'Operator';

UPDATE "User"
SET
  "role"='Operator'
WHERE
  "role"='User';
