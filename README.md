# Cleus AI — Platform Repository

> Uncensored, multimodal AI platform. Text · Images · Video · Group Discussion · Story Mode · AI Characters.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

Cleus is a full-stack AI platform that aggregates multiple large language models (GPT-4o, Gemini, Claude, Llama, Grok) alongside its own uncensored inference model. It provides:

- **Uncensored chat** — no content filters
- **Multimodal input** — image + text combined queries
- **Image generation** — text-to-image, image-to-image editing
- **Video generation** — text-to-video, image-to-video
- **Group Discussion Mode** — multiple LLMs debate, then reach consensus
- **Story Mode** — structured long-form narrative generation with characters & settings
- **AI Characters** — create and chat with custom AI personas, with voice
- **Unbiased News Feed** — aggregated headlines stripped of editorial bias

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                         Browser                            │
│                    Next.js (App Router)                    │
└─────────────────────────┬──────────────────────────────────┘
                          │ HTTP + WebSocket
┌─────────────────────────▼──────────────────────────────────┐
│                    Express API Server                       │
│       Auth · Chat · Images · Video · Story · News          │
└──────┬───────────────┬──────────────────┬──────────────────┘
       │               │                  │
┌──────▼───┐    ┌──────▼─────┐    ┌───────▼──────┐
│ Postgres │    │   Redis     │    │  Bull Worker  │
│ (Prisma) │    │(Cache+Queue)│    │ (async jobs)  │
└──────────┘    └────────────┘    └───────┬───────┘
                                          │
           ┌──────────────────────────────┼────────────────┐
           │                             │                  │
    ┌──────▼──────┐             ┌────────▼──────┐   ┌──────▼──────┐
    │  AI Provider│             │   Replicate    │   │   Firebase  │
    │  (OpenAI,   │             │ (Image/Video   │   │  (Storage)  │
    │  Anthropic, │             │  Generation)   │   └─────────────┘
    │  Google,    │             └────────────────┘
    │  Cleus-LLM) │
    └─────────────┘
```

---

## Repository Structure

```
cleus-ai/
│
├── .env.example                          # All environment variable stubs
├── .gitignore
├── turbo.json                            # Turborepo pipeline config
├── package.json                          # Root pnpm workspace
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── workflows/
│       ├── ci-cd.yml                     # Lint → Test → Docker build → Deploy
│       ├── e2e.yml                       # Playwright E2E on main branch
│       └── pr-checks.yml                 # Lint + type-check on every PR
│
├── apps/
│   │
│   ├── web/                              # Next.js 14 (App Router) frontend
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── public/
│   │   │   ├── avatars/                  # Model & character avatar images
│   │   │   ├── fonts/                    # Self-hosted fonts
│   │   │   ├── icons/                    # App icons / favicons
│   │   │   └── og-images/               # OpenGraph images per page
│   │   └── src/
│   │       ├── app/                      # Next.js file-system routing
│   │       │   ├── layout.tsx            # Root layout (providers, fonts, metadata)
│   │       │   ├── auth/
│   │       │   │   ├── login/page.tsx
│   │       │   │   ├── register/page.tsx
│   │       │   │   ├── forgot-password/  # Password reset flow
│   │       │   │   └── verify-email/     # Email verification
│   │       │   ├── chat/page.tsx         # Main chat interface
│   │       │   ├── image-gen/
│   │       │   │   └── history/          # Past generations gallery
│   │       │   ├── video-gen/
│   │       │   │   └── history/
│   │       │   ├── story/
│   │       │   │   ├── create/           # Story configurator
│   │       │   │   └── browse/           # Browse published stories
│   │       │   ├── characters/
│   │       │   │   ├── browse/           # Browse 100+ public characters
│   │       │   │   └── create/           # Character creator
│   │       │   ├── news/
│   │       │   │   └── category/         # Category-filtered news feed
│   │       │   ├── group-discuss/
│   │       │   │   └── history/          # Past group discussions
│   │       │   ├── settings/
│   │       │   │   ├── profile/page.tsx
│   │       │   │   ├── billing/page.tsx
│   │       │   │   ├── api-keys/page.tsx
│   │       │   │   └── notifications/
│   │       │   └── admin/                # Admin panel (staff only)
│   │       │       ├── users/page.tsx
│   │       │       ├── analytics/page.tsx
│   │       │       ├── moderation/       # Content moderation queue
│   │       │       └── models/           # Model config management
│   │       ├── components/
│   │       │   ├── ui/                   # Low-level design system
│   │       │   │   ├── Avatar.tsx
│   │       │   │   ├── Badge.tsx
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── Modal.tsx
│   │       │   │   └── Tooltip.tsx
│   │       │   ├── layouts/
│   │       │   │   ├── ChatLayout.tsx    # Sidebar + main content layout
│   │       │   │   └── DashboardLayout.tsx
│   │       │   ├── shared/
│   │       │   │   ├── AppProviders.tsx  # QueryClient, Auth, Toaster
│   │       │   │   └── MainNav.tsx       # Icon sidebar navigation
│   │       │   ├── chat/
│   │       │   │   ├── ChatWindow.tsx
│   │       │   │   ├── ChatInput.tsx
│   │       │   │   ├── MessageBubble.tsx
│   │       │   │   ├── ModelSelector.tsx
│   │       │   │   └── ConversationSidebar.tsx
│   │       │   ├── image-gen/
│   │       │   │   └── ImageGenerator.tsx
│   │       │   ├── video-gen/
│   │       │   │   └── VideoGenerator.tsx
│   │       │   ├── group-discussion/
│   │       │   │   └── GroupDiscussion.tsx
│   │       │   ├── story/                # Story mode components
│   │       │   ├── settings/             # Settings page sections
│   │       │   ├── billing/
│   │       │   │   └── PricingCard.tsx
│   │       │   └── admin/                # Admin dashboard widgets
│   │       ├── hooks/
│   │       │   ├── useAuth.ts
│   │       │   ├── useCredits.ts         # Live credit balance + plan
│   │       │   ├── useImageHistory.ts
│   │       │   ├── useSocket.ts
│   │       │   └── useStream.ts          # Generic SSE stream hook
│   │       ├── lib/
│   │       │   ├── api/                  # Typed fetch wrappers
│   │       │   │   ├── auth.ts
│   │       │   │   ├── chat.ts
│   │       │   │   ├── group-discussion.ts
│   │       │   │   ├── image-gen.ts
│   │       │   │   └── video-gen.ts
│   │       │   ├── constants.ts          # Model list, style presets, limits
│   │       │   ├── utils/                # Shared utility functions
│   │       │   └── validators/           # Client-side Zod schemas
│   │       ├── middleware/               # Next.js edge middleware (auth guard)
│   │       ├── store/
│   │       │   ├── app.store.ts          # Global: user, theme, sidebar
│   │       │   └── chat.store.ts         # Conversations, messages, streaming
│   │       └── styles/
│   │           └── globals.css           # Tailwind imports + CSS vars
│   │
│   ├── api/                              # Express REST + Socket.IO API
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma             # Full DB schema (13 models)
│   │   │   └── seed.ts                   # Dev seed: users, characters
│   │   ├── tests/
│   │   │   ├── integration/
│   │   │   │   └── auth.test.ts
│   │   │   └── unit/
│   │   │       └── ai-provider.test.ts
│   │   └── src/
│   │       ├── index.ts                  # Express + Socket.IO server entry
│   │       ├── config/
│   │       │   └── index.ts              # Typed config from env vars
│   │       ├── routes/
│   │       │   ├── auth.ts               # Register, login, logout, /me
│   │       │   ├── chat.ts               # Streaming chat + conversation CRUD
│   │       │   ├── images.ts             # Generate, edit, history
│   │       │   ├── videos.ts             # Queue generation, poll status
│   │       │   └── news.ts               # Fetch aggregated headlines
│   │       ├── services/
│   │       │   ├── ai-provider.service.ts  # Route to OpenAI/Anthropic/Google/Cleus
│   │       │   ├── image-gen.service.ts    # Replicate image generation
│   │       │   ├── news.service.ts         # NewsAPI aggregation
│   │       │   ├── socket.service.ts       # Socket.IO event handlers
│   │       │   ├── stripe.service.ts       # Checkout + webhook handling
│   │       │   ├── providers/              # Per-provider SDK wrappers
│   │       │   └── external/              # Third-party integrations
│   │       ├── middleware/
│   │       │   ├── auth.ts               # JWT cookie / Bearer auth
│   │       │   ├── error-handler.ts      # Centralised error → JSON response
│   │       │   ├── rate-limiter.ts       # 120 req/min global, 10/min strict
│   │       │   └── validate.ts           # Zod schema middleware factory
│   │       ├── jobs/
│   │       │   └── video.queue.ts        # Bull queue definition
│   │       ├── models/                   # Prisma query helpers / repositories
│   │       ├── events/                   # Domain events (future EventEmitter)
│   │       ├── types/                    # Express request augmentation
│   │       ├── utils/
│   │       │   ├── logger.ts             # Winston logger
│   │       │   └── prisma.ts             # Prisma singleton
│   │       └── validators/               # Shared Zod schemas
│   │
│   └── worker/                           # Bull background job processors
│       ├── package.json
│       └── src/
│           ├── index.ts                  # Queue wiring + SIGTERM handler
│           ├── config/
│           ├── jobs/
│           │   ├── image.queue.ts
│           │   ├── news.queue.ts
│           │   └── video.queue.ts
│           ├── processors/
│           │   ├── image.processor.ts    # Async batch image generation
│           │   ├── news.processor.ts     # Scheduled news fetch (*/15 min)
│           │   └── video.processor.ts    # Replicate video via polling
│           └── utils/
│               ├── logger.ts
│               └── prisma.ts
│
├── packages/
│   ├── analytics/                        # Tracking: PostHog / Mixpanel wrapper
│   │   ├── package.json
│   │   └── src/index.ts
│   ├── config/
│   │   ├── eslint/                       # Shared ESLint config
│   │   ├── prettier/                     # Shared Prettier config
│   │   └── typescript/                   # Shared tsconfig bases
│   ├── logger/                           # createLogger(service) factory
│   │   ├── package.json
│   │   └── src/index.ts
│   ├── shared/                           # Types + constants + validators
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── types.ts                  # All shared TypeScript interfaces
│   │       ├── constants/
│   │       │   ├── models.ts             # Model → provider map, context windows
│   │       │   └── plans.ts              # FREE / PRO / ENTERPRISE limits
│   │       ├── validators/
│   │       │   └── index.ts              # Zod: email, password, username, prompt
│   │       └── utils/
│   └── ui/                               # Shared React component library
│       ├── package.json
│       └── src/
│           ├── index.ts
│           ├── components/
│           │   ├── composed/             # Modal, Tooltip, Dropdown, ConfirmDialog
│           │   │   └── index.ts
│           │   ├── layout/               # Page shells, grid, containers
│           │   └── primitives/           # Button, Input, Badge, Avatar, Spinner
│           │       └── index.ts
│           ├── hooks/                    # useClickOutside, useDebounce, etc.
│           ├── styles/                   # Component CSS / Tailwind plugins
│           └── utils/                    # cn(), formatters, etc.
│
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml            # Postgres + Redis + web + api + worker
│   │   └── nginx/
│   │       └── nginx.conf                # Reverse proxy + SSL termination
│   ├── helm/
│   │   └── cleus/                        # Helm chart for Kubernetes
│   │       ├── charts/
│   │       └── templates/
│   ├── k8s/
│   │   ├── base/                         # Base Kustomize manifests
│   │   │   ├── api-deployment.yaml
│   │   │   ├── ingress.yaml
│   │   │   ├── kustomization.yaml
│   │   │   ├── web-deployment.yaml
│   │   │   └── worker-deployment.yaml
│   │   ├── configs/                      # ConfigMaps, Secrets templates
│   │   └── overlays/
│   │       ├── production/               # 4× API, 3× web replicas
│   │       │   └── kustomization.yaml
│   │       └── staging/                  # 1× replica, staging namespace
│   │           └── kustomization.yaml
│   ├── monitoring/
│   │   ├── grafana/
│   │   │   └── dashboards/
│   │   │       └── api-metrics.json      # Request rate, error rate, latency
│   │   └── prometheus/
│   │       └── prometheus.yml            # Scrape configs for API + PG + Node
│   └── terraform/
│       ├── environments/
│       │   ├── production/
│       │   │   └── main.tf               # RDS + Redis + EKS wiring
│       │   └── staging/
│       └── modules/
│           ├── cdn/                      # CloudFront + S3 for static assets
│           ├── eks/                      # EKS cluster definition
│           ├── rds/
│           │   └── main.tf               # PostgreSQL 16 RDS instance
│           ├── redis/
│           │   └── main.tf               # ElastiCache Redis 7
│           └── vpc/                      # VPC, subnets, security groups
│
├── docs/
│   ├── adr/                              # Architecture Decision Records
│   │   ├── 001-monorepo-structure.md
│   │   └── 002-streaming-architecture.md
│   ├── api/
│   │   └── README.md                     # Full API endpoint reference
│   ├── architecture/
│   │   └── overview.md                   # System design + request lifecycle
│   └── guides/
│       └── getting-started.md
│
├── tests/
│   ├── e2e/                              # Playwright end-to-end tests
│   │   ├── fixtures/
│   │   │   └── users.ts                  # Test user credentials
│   │   ├── specs/
│   │   │   ├── auth.spec.ts
│   │   │   ├── chat.spec.ts
│   │   │   └── image-gen.spec.ts
│   │   └── support/
│   │       └── global-setup.ts           # Seed test DB before suite
│   └── load/
│       └── scenarios/
│           └── chat-load.js              # k6 load test (50 VU, 2 min)
│
└── tools/
    ├── generators/
    │   └── create-route.ts               # Scaffold a new API route file
    └── scripts/
        ├── create-migration.sh           # prisma migrate dev wrapper
        └── reset-db.sh                   # Nuke + re-seed dev database
```

---

## Features

| Feature | Description |
|---|---|
| **Uncensored Chat** | Direct access to unfiltered LLMs. Supports image attachments (multimodal). |
| **Multi-model Access** | Switch between GPT-4o, Gemini 1.5 Pro, Claude 3, Grok 2, Llama 3, and Cleus in one UI. |
| **Group Discussion** | Pose a question to 2–5 models simultaneously; watch them debate and reach a consensus. |
| **Image Generation** | Text-to-image via Flux 1.1 Pro, SDXL, or the proprietary NanoBanana Pro model. |
| **Image Editing** | Reference image + prompt → transformed output. |
| **Video Generation** | Text-to-video and image-to-video via Replicate-hosted models. |
| **Story Mode** | Configure title, plot, characters, places, and writing style. Generate full stories or chapter-by-chapter. |
| **AI Characters** | Browse 100+ characters or build your own. Supports real-time voice calls. |
| **News Feed** | Aggregated headlines with source links, minimal editorial filter. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, SWR |
| **Backend** | Node.js, Express, Socket.IO |
| **Database** | PostgreSQL + Prisma ORM |
| **Cache / Queue** | Redis + Bull |
| **AI — LLMs** | Anthropic SDK, OpenAI SDK, Google Generative AI SDK |
| **AI — Images** | Replicate (Flux, SDXL, NanoBanana Pro) |
| **AI — Video** | Replicate (Luma, Kling) |
| **Auth** | JWT + Firebase Auth |
| **Storage** | Firebase Storage |
| **Payments** | Stripe |
| **Monorepo** | pnpm Workspaces + Turborepo |
| **CI/CD** | GitHub Actions → Docker → VPS / Kubernetes |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Docker + Docker Compose
- PostgreSQL (or use the Docker Compose setup)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/cleus-ai.git
cd cleus-ai
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
# Edit both files with your API keys
```

### 3. Start Infrastructure

```bash
pnpm docker:up          # Starts Postgres + Redis
pnpm db:migrate         # Run Prisma migrations
pnpm db:seed            # Seed default AI characters and models
```

### 4. Start Development Servers

```bash
pnpm dev                # Starts all apps concurrently via Turborepo
```

| Service | URL |
|---|---|
| Web | http://localhost:3000 |
| API | http://localhost:8080 |
| API Health | http://localhost:8080/health |

---

## Environment Variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection URL |
| `JWT_SECRET` | Secret for signing JWTs |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `GOOGLE_API_KEY` | Google Generative AI key |
| `REPLICATE_API_TOKEN` | Replicate API token (image/video gen) |
| `STRIPE_SECRET_KEY` | Stripe secret key |

---

## Development

```bash
pnpm dev              # All services
pnpm dev --filter web # Web only
pnpm dev --filter api # API only

pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm build            # Production build
```

### Database

```bash
pnpm db:migrate       # Apply migrations
pnpm db:push          # Push schema without migration file
pnpm db:seed          # Seed dev data
npx prisma studio     # GUI at http://localhost:5555
```

---

## Deployment

### Docker Compose (Single Server)

```bash
# Build and start all services
docker compose -f infra/docker/docker-compose.yml up -d --build
```

### Kubernetes

```bash
kubectl apply -f infra/k8s/
```

### CI/CD

Pushes to `main` automatically:
1. Lint + type-check + test
2. Build Docker images and push to GHCR
3. Deploy to production via SSH

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org) for commit messages.

---

## License

MIT © Cleus AI
