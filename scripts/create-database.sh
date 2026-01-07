#!/bin/bash

echo "Creating PostgreSQL database..."

PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE devshowcase;" 2>/dev/null || echo "Database 'devshowcase' already exists or could not be created."

echo "Database 'devshowcase' is ready!"

