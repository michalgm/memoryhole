#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE DATABASE memoryhole_prod;
CREATE DATABASE memoryhole_dev;
CREATE DATABASE memoryhole_test;
CREATE USER memoryhole_prod WITH CREATEDB ENCRYPTED PASSWORD 'prod_password';
GRANT ALL PRIVILEGES ON DATABASE memoryhole_prod TO memoryhole_prod;
CREATE USER memoryhole_dev WITH CREATEDB ENCRYPTED PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE memoryhole_dev TO memoryhole_dev;
-- Grant usage and create privileges on the public schema to the memoryhole_dev user
GRANT USAGE, CREATE ON SCHEMA public TO memoryhole_dev;

-- Optionally, grant all privileges on all tables and sequences in the public schema to the memoryhole_dev user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO memoryhole_dev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO memoryhole_dev;

CREATE USER memoryhole_test WITH CREATEDB ENCRYPTED PASSWORD 'test_password';
GRANT ALL PRIVILEGES ON DATABASE memoryhole_test TO memoryhole_test;

EOSQL
# CREATE DATABASE memoryhole_shadow;
# CREATE USER memoryhole_shadow WITH  ENCRYPTED PASSWORD 'shadow_password';
# GRANT ALL PRIVILEGES ON DATABASE memoryhole_shadow TO memoryhole_shadow;
