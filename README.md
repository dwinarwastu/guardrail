# Guardrail

> Production-grade rate limiter as a service — built to show real-world backend architecture.

Built with **NestJS**, **Redis**, and **PostgreSQL**. Exposes a simple API that any internal service can call to enforce rate limiting using a sliding window algorithm.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Rate Limit Storage | Redis (ioredis) |
| Database | PostgreSQL + TypeORM |
| Algorithm | Sliding Window Counter |
| Containerization | Docker + Docker Compose |

---

## How It Works

1. **Create a rule** — define a rate limit rule for a resource (e.g. `/api/login`) with a limit and window size
2. **Check** — internal service calls `POST /check` with the resource, identifier type, and identifier value
3. **Evaluate** — guardrail looks up the active rule, runs the sliding window algorithm against Redis, and returns the decision
4. **Response** — returns `allowed: true/false` with remaining count, reset time, and retry-after if blocked

Each identifier (IP, user ID, API key) is tracked independently per resource.

---

## Sliding Window Algorithm

Requests are tracked in a Redis Sorted Set where the score is the request timestamp. On each check:

1. Remove all entries outside the current window
2. Count remaining entries
3. If count is below the limit — allow and add the new entry
4. If count is at or above the limit — deny and return retry-after

This avoids the burst problem of fixed window counters while being more memory-efficient than sliding window log.

---

## Project Structure

```
src/
├── check/            # HTTP entry point, evaluate rate limit
├── rule/             # CRUD rule management
├── limiter/          # Core sliding window logic
├── redis/            # Redis client provider
└── common/
    ├── entities/
    ├── enums/
    └── interfaces/
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose

### Run with Docker

```bash
cp .env.example .env
# fill in your credentials
docker compose up -d
```

### Run locally

```bash
npm install
npm run start:dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port (default: `5432`) |
| `DB_USER` | PostgreSQL user |
| `DB_PASS` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port (default: `6379`) |

---

## API Reference

### Check rate limit

```
POST /check
```

```json
{
  "resource": "/api/login",
  "identifierType": "ip",
  "identifier": "192.168.1.1"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `resource` | `string` | Yes | Resource identifier, e.g. endpoint or service name |
| `identifierType` | `ip \| user_id \| api_key` | Yes | Type of the identifier |
| `identifier` | `string` | Yes | Actual identifier value |

**Response — allowed**

```json
{
  "allowed": true,
  "limit": 5,
  "remaining": 4,
  "resetAt": "2026-05-28T06:53:37.330Z"
}
```

**Response — blocked**

```json
{
  "allowed": false,
  "limit": 5,
  "remaining": 0,
  "resetAt": "2026-05-28T06:53:37.330Z",
  "retryAfter": 60
}
```

---

### Create a rule

```
POST /rule
```

```json
{
  "resource": "/api/login",
  "identifierType": "ip",
  "limit": 5,
  "windowSizeSeconds": 60
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `resource` | `string` | Yes | Resource to apply the rule to |
| `identifierType` | `ip \| user_id \| api_key` | Yes | Identifier type |
| `limit` | `number` | Yes | Max requests allowed in the window |
| `windowSizeSeconds` | `number` | Yes | Window size in seconds |
| `status` | `active \| inactive` | No | Default: `active` |

---

### List all rules

```
GET /rule
```

---

### Toggle rule status

```
PATCH /rule/:id/toggle
```

---

### Remove a rule

```
DELETE /rule/:id
```

---

## Identifier Types

| Type | Description | Example |
|---|---|---|
| `ip` | Client IP address | `192.168.1.1` |
| `user_id` | Authenticated user ID | `user-123` |
| `api_key` | API key | `sk_live_abc123` |

---

## Architecture Decisions

See [docs/adr](./docs/adr) for architecture decision records explaining the key design choices behind this service.
