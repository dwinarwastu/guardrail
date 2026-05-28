# ADR 003: Rate Limiter as a Standalone Service

## Status
Accepted

## Context
Rate limiting can be implemented as a library (embedded in each service) or as a standalone service.

## Decision
Build as a standalone service with a REST API.

## Reasons
- **Centralized** — one place to manage all rate limit rules across multiple services
- **Language agnostic** — any service regardless of tech stack can consume the API
- **Consistent enforcement** — no risk of different services having different rule implementations
- **Auditable** — all rate limit decisions go through one service, easier to monitor

## When to reconsider
If latency becomes critical (sub-millisecond), consider embedding rate limiting as a library or middleware instead — the HTTP round trip adds overhead.

## Consequences
- Extra network hop per request
- Single point of failure if guardrail goes down — mitigate with caching or circuit breaker on the consumer side
