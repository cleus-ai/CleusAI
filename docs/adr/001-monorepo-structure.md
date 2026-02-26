# ADR 001: Monorepo with Turborepo

**Status:** Accepted  
**Date:** 2024-01-15

## Context
The platform spans a Next.js frontend, Express API, and Bull worker. Shared types and components would cause drift if maintained in separate repos.

## Decision
Use a pnpm workspace monorepo managed by Turborepo. Three apps (`web`, `api`, `worker`) and four packages (`ui`, `shared`, `logger`, `analytics`).

## Consequences
- Single `pnpm install` installs all dependencies
- Turborepo's task pipeline caches build artifacts
- Shared TypeScript types are co-versioned with consuming apps
- CI runs only affected workspaces on each PR
