#!/bin/bash
DB_PROD_PASSWORD="${DB_PROD_PASSWORD:-prod_password}"
DB_DEV_PASSWORD="${DB_DEV_PASSWORD:-dev_password}"
DB_TEST_PASSWORD="${DB_TEST_PASSWORD:-test_password}"
DB_SHADOW_PASSWORD="${DB_SHADOW_PASSWORD:-shadow_password}"

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE DATABASE memoryhole_prod;
CREATE DATABASE memoryhole_dev;
CREATE DATABASE memoryhole_test;
CREATE DATABASE memoryhole_shadow;

CREATE USER memoryhole_prod WITH CREATEDB ENCRYPTED PASSWORD '${DB_PROD_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE memoryhole_prod TO memoryhole_prod;
CREATE USER memoryhole_dev WITH CREATEDB ENCRYPTED PASSWORD '${DB_DEV_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE memoryhole_dev TO memoryhole_dev;
CREATE USER memoryhole_test WITH CREATEDB ENCRYPTED PASSWORD '${DB_TEST_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE memoryhole_test TO memoryhole_test;
CREATE USER memoryhole_shadow WITH CREATEDB ENCRYPTED PASSWORD '${DB_SHADOW_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE memoryhole_shadow TO memoryhole_shadow;
\c memoryhole_prod;
GRANT ALL ON SCHEMA public TO memoryhole_prod;
\c memoryhole_dev;
GRANT ALL ON SCHEMA public TO memoryhole_dev;
\c memoryhole_test;
GRANT ALL ON SCHEMA public TO memoryhole_test;
\c memoryhole_shadow;
GRANT ALL ON SCHEMA public TO memoryhole_shadow;
EOSQL
