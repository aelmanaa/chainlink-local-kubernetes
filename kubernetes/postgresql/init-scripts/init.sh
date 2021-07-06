#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT NOW();
EOSQL

echo "init chainlink user "

psql --username "$POSTGRES_USER"  --dbname "$POSTGRES_DB" -c "SELECT FROM pg_catalog.pg_roles WHERE  rolname = '__CHAINLINK_USER__'"  | grep -q 1 || psql --username "$POSTGRES_USER"  --dbname "$POSTGRES_DB" -c "CREATE ROLE __CHAINLINK_USER__ LOGIN PASSWORD '__CHAINLINK_PASSWORD__';"

echo "create chainlink DB"

psql --username "$POSTGRES_USER"  --dbname "$POSTGRES_DB" -c "SELECT FROM pg_database WHERE datname = '__CHAINLINK_DB__'"  | grep -q 1 || psql --username "$POSTGRES_USER"  --dbname "$POSTGRES_DB" -c "CREATE DATABASE \"__CHAINLINK_DB__\";"

echo "grant chainlink user access to chainlink DB"

psql --username "$POSTGRES_USER"  --dbname "$POSTGRES_DB" -c "GRANT ALL PRIVILEGES ON DATABASE \"__CHAINLINK_DB__\" TO __CHAINLINK_USER__;"