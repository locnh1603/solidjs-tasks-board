#!/bin/bash
set -euo pipefail

echo "🧹 Cleaning project artifacts..."

# Clean node_modules (root + all subprojects)
find . -type d -name "node_modules" -prune -exec rm -rf {} +

# Clean build outputs
find . -type d \( -name "dist" -o -name "build" -o -name "out" -o -name "coverage" -o -name "temp" \) -prune -exec rm -rf {} +

# Remove Turborepo cache
rm -rf .turbo

# Remove PNPM store cache (local project-level)
rm -rf .pnpm-store

# Remove Vitest & Jest caches if exist
rm -rf .vitest .jest-cache

# Optional: remove lock files (useful if regenerating dependencies)
# rm -f pnpm-lock.yaml package-lock.json yarn.lock

echo "✅ Cleanup complete."
