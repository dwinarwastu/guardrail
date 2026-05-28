# ADR 002: Redis Sorted Set for Sliding Window Storage

## Status
Accepted

## Context
The sliding window algorithm needs to store request timestamps and query them by time range efficiently.

## Decision
Use Redis Sorted Set (ZSET) where score = request timestamp and member = unique request ID.

## Reasons
- **ZREMRANGEBYSCORE** — removes expired entries in O(log N) time
- **ZCARD** — counts remaining entries in O(1) time
- **Atomic pipeline** — remove + count + add in one round trip via Redis pipeline
- **TTL support** — key expires automatically after window size, no manual cleanup needed

## Alternatives considered
- Redis String + INCR — simpler but fixed window only, no sliding support
- Redis Hash — no native range query by score

## Consequences
- Memory usage scales with request volume per key
- Acceptable for typical rate limiting use cases
