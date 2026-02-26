# Cleus API Reference

Base URL: `https://api.cleus.ai`

## Authentication

All protected endpoints require a valid JWT in a `token` cookie or `Authorization: Bearer <token>` header.

## Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in, receive cookie |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET  | `/api/auth/me` | Get current user profile |

### Chat
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chat/stream` | Stream chat completion |
| GET  | `/api/chat/conversations` | List conversations |
| POST | `/api/chat/conversations` | Create conversation |
| DELETE | `/api/chat/conversations/:id` | Delete conversation |

### Images
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/images/generate` | Generate images from prompt |
| POST | `/api/images/edit` | Edit image with prompt |
| GET  | `/api/images/history` | Get generation history |

### Videos
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/videos/generate` | Queue video generation |
| GET  | `/api/videos/status/:jobId` | Poll job status |
| GET  | `/api/videos/history` | Get video history |
