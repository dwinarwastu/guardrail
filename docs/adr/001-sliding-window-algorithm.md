# ADR 001: Sliding Window Counter over Fixed Window

## Status
Accepted

## Context
Rate limiting requires counting requests within a time window.
Three common algorithms considered: fixed window counter, sliding window log, and sliding window counter.

## Decision
Use sliding window counter.

## Reasons
- **Fixed window** has a burst problem — a client can send 2x the limit by hitting the boundary between two windows
- **Sliding window log** is accurate but memory-intensive — stores every request timestamp
- **Sliding window counter** is a good balance — accurate enough, memory-efficient, and fast

## Consequences
- Slightly less accurate than sliding window log at window boundaries
- Acceptable trade-off for the memory and performance gain
