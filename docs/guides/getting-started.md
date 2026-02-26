# Getting Started

## Prerequisites
- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose

## 1. Clone the repo
```bash
git clone https://github.com/your-org/cleus-ai.git && cd cleus-ai
```

## 2. Install dependencies
```bash
pnpm install
```

## 3. Configure environment
```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
# Fill in your API keys
```

## 4. Start infrastructure
```bash
pnpm docker:up
pnpm db:migrate
pnpm db:seed
```

## 5. Start development
```bash
pnpm dev
```

Visit **http://localhost:3000** to see the app.
