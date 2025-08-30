-- This is an empty migration.
UPDATE "SiteSetting"
SET
  VALUE['operator']=VALUE['user']
WHERE
  id='default_restrictions';

UPDATE "SiteSetting"
SET
  VALUE=VALUE-'user'
WHERE
  id='default_restrictions';