#!/bin/bash
# Docker Database Initialization Script
# This script runs automatically when the PostgreSQL container starts for the first time
# It creates the test database alongside the development database

set -e

# Create test database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE invoiceforge_test;
    GRANT ALL PRIVILEGES ON DATABASE invoiceforge_test TO $POSTGRES_USER;
EOSQL

echo "✅ Test database created successfully"
