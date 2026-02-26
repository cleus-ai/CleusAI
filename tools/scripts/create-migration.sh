#!/bin/bash
# Usage: ./tools/scripts/create-migration.sh <migration_name>
set -e
NAME=$1
if [ -z "$NAME" ]; then echo "Usage: $0 <migration_name>"; exit 1; fi
cd apps/api && npx prisma migrate dev --name "$NAME"
echo "Migration '$NAME' created successfully"
