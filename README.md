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
├── apps/
│   ├── web/                        # Next.js 14 frontend
│   │   ├── src/
│   │   │   ├── app/                # Next.js App Router pages
│   │   │   │   ├── (auth)/         # Login, Register pages
│   │   │   │   ├── chat/           # Main chat interface
│   │   │   │   ├── image-gen/      # Image generation page
│   │   │   │   ├── video-gen/      # Video generation page
│   │   │   │   ├── story/          # Story Mode page
│   │   │   │   ├── characters/     # AI Characters page
│   │   │   │   ├── news/           # News feed page
│   │   │   │   ├── group-discuss/  # Group Discussion page
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── chat/
│   │   │   │   │   ├── ChatWindow.tsx
│   │   │   │   │   ├── MessageBubble.tsx
│   │   │   │   │   ├── ChatInput.tsx
│   │   │   │   │   ├── ModelSelector.tsx
│   │   │   │   │   └── ConversationSidebar.tsx
│   │   │   │   ├── image-gen/
│   │   │   │   │   ├── ImageGenerator.tsx
│   │   │   │   │   └── ImageGallery.tsx
│   │   │   │   ├── video-gen/
│   │   │   │   │   ├── VideoGenerator.tsx
│   │   │   │   │   └── VideoPlayer.tsx
│   │   │   │   ├── story/
│   │   │   │   │   ├── StoryConfigurator.tsx
│   │   │   │   │   ├── StoryReader.tsx
│   │   │   │   │   └── CharacterBuilder.tsx
│   │   │   │   ├── characters/
│   │   │   │   │   ├── CharacterCard.tsx
│   │   │   │   │   ├── CharacterCreator.tsx
│   │   │   │   │   └── VoiceCall.tsx
│   │   │   │   ├── news/
│   │   │   │   │   ├── NewsFeed.tsx
│   │   │   │   │   └── NewsArticle.tsx
│   │   │   │   └── group-discussion/
│   │   │   │       ├── GroupDiscussion.tsx
│   │   │   │       └── DebateFeed.tsx
│   │   │   ├── lib/
│   │   │   │   ├── api/
│   │   │   │   │   ├── chat.ts
│   │   │   │   │   ├── image-gen.ts
│   │   │   │   │   ├── video-gen.ts
│   │   │   │   │   ├── story.ts
│   │   │   │   │   └── group-discussion.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── constants.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useStream.ts
│   │   │   │   └── useSocket.ts
│   │   │   ├── store/
│   │   │   │   ├── chat.store.ts
│   │   │   │   └── app.store.ts
│   │   │   └── types/
│   │   ├── public/
│   │   │   └── avatars/
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── api/                        # Express REST + WebSocket API
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── chat.ts
│   │   │   │   ├── images.ts
│   │   │   │   ├── videos.ts
│   │   │   │   ├── story.ts
│   │   │   │   ├── characters.ts
│   │   │   │   ├── news.ts
│   │   │   │   ├── group-discussion.ts
│   │   │   │   └── webhooks.ts
│   │   │   ├── services/
│   │   │   │   ├── ai-provider.service.ts  # Routes to OpenAI/Anthropic/Google/Cleus
│   │   │   │   ├── image-gen.service.ts    # Replicate image generation
│   │   │   │   ├── video-gen.service.ts    # Replicate video generation
│   │   │   │   ├── story.service.ts
│   │   │   │   ├── news.service.ts
│   │   │   │   ├── socket.service.ts
│   │   │   │   └── stripe.service.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── rate-limiter.ts
│   │   │   │   └── error-handler.ts
│   │   │   ├── models/             # Prisma client wrappers
│   │   │   ├── utils/
│   │   │   │   └── logger.ts
│   │   │   └── index.ts            # App entry point
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # DB schema (User, Conversation, Message, ...)
│   │   │   └── seed.ts
│   │   └── package.json
│   │
│   └── worker/                     # Bull queue workers for async jobs
│       ├── src/
│       │   ├── jobs/
│       │   │   ├── video-gen.job.ts
│       │   │   ├── image-gen.job.ts
│       │   │   └── news-fetch.job.ts
│       │   └── index.ts
│       └── package.json
│
├── packages/
│   ├── ui/                         # Shared React component library
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Avatar.tsx
│   │       └── index.ts
│   ├── shared/                     # Shared TypeScript types
│   │   └── src/
│   │       └── types.ts
│   └── config/                     # Shared ESLint / TS configs
│       ├── eslint-base.js
│       └── tsconfig.base.json
│
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml      # Local dev stack (Postgres, Redis, services)
│   ├── k8s/                        # Kubernetes manifests (production)
│   │   ├── api-deployment.yaml
│   │   ├── web-deployment.yaml
│   │   ├── worker-deployment.yaml
│   │   └── ingress.yaml
│   └── terraform/                  # IaC for cloud resources
│       ├── main.tf
│       └── variables.tf
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml               # Lint → Test → Build → Deploy
│
├── docs/
│   ├── api.md                      # API reference
│   ├── architecture.md
│   └── deployment.md
│
├── scripts/
│   ├── setup.sh                    # One-command dev setup
│   └── seed-characters.ts
│
├── .env.example
├── .gitignore
├── turbo.json                      # Turborepo pipeline config
├── package.json                    # Root workspace
└── README.md
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
