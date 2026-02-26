#!/bin/bash
set -e
echo "🚀 Setting up Cleus AI development environment..."
command -v node >/dev/null || { echo "❌ Node.js >= 20 required"; exit 1; }
command -v pnpm >/dev/null || { echo "❌ pnpm >= 9 required. Run: npm i -g pnpm"; exit 1; }
command -v docker >/dev/null || { echo "❌ Docker required"; exit 1; }
echo "✅ Prerequisites found"
pnpm install
cp -n .env.example apps/api/.env 2>/dev/null && echo "📄 Created apps/api/.env (fill in your API keys)" || echo "⚠️  apps/api/.env already exists"
cp -n .env.example apps/web/.env.local 2>/dev/null && echo "📄 Created apps/web/.env.local" || echo "⚠️  apps/web/.env.local already exists"
pnpm docker:up
sleep 3
pnpm db:migrate
pnpm db:seed
echo ""
echo "✅ Setup complete! Run 'pnpm dev' to start."
