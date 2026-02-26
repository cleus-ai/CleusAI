#!/bin/bash
echo "🧹 Cleaning build artifacts..."
find . -name ".next" -type d -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.tsbuildinfo" -not -path "*/node_modules/*" -delete 2>/dev/null || true
rm -rf .turbo
echo "✅ Clean complete"
