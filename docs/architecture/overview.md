# Architecture Overview

## System Design

Cleus is a monorepo containing three deployable applications communicating through a shared type system.

### Request Lifecycle

```
Browser → Nginx → Next.js Web App
                       ↓
              Express API Server
                    / | \
           Anthropic  OpenAI  Replicate
           (Claude)  (GPT-4o) (Images)
                    ↓
               PostgreSQL
               Redis Cache
                    ↓
              Bull Worker
           (async video/news jobs)
```

### Data Flow: Streaming Chat

1. User sends message → Next.js API route
2. API route opens SSE stream to Express
3. Express calls appropriate provider (OpenAI/Anthropic/etc.)
4. Provider streams tokens → Express forwards chunks → browser renders progressively
5. On completion, full message persisted to PostgreSQL

### Scalability Notes

- Stateless API servers allow horizontal scaling behind a load balancer
- Redis used for both caching (news, model lists) and Bull job queues
- Video generation offloaded to background workers to avoid API timeouts
- Database connection pooling via PgBouncer in production
