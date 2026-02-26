#!/bin/bash
set -e
echo "WARNING: This will reset the database. Press Ctrl+C to cancel..."
sleep 3
cd apps/api
npx prisma migrate reset --force
npx ts-node prisma/seed.ts
echo "Database reset and seeded successfully"
