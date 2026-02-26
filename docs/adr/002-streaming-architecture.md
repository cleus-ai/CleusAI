# ADR 002: SSE Streaming for Chat

**Status:** Accepted  
**Date:** 2024-01-20

## Context
LLM responses can take 10–30 seconds. Buffering full responses creates poor UX.

## Decision
Use HTTP chunked transfer / SSE to stream tokens from the API to the browser. The API proxies streams directly from provider SDKs.

## Consequences
- Frontend renders tokens as they arrive (progressive UX)
- No WebSocket needed for basic chat (reduces infra complexity)
- Group Discussion mode uses WebSockets for multi-model simultaneous streams
