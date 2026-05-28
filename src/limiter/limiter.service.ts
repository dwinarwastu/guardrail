import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './limiter.module';
import { CheckResult } from 'src/common/interfaces/check-result.interface';
import { Rule } from 'src/common/entities/rule.entity';

@Injectable()
export class LimiterService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async check(rule: Rule, identifier: string): Promise<CheckResult> {
    const now = Date.now();
    const windowMs = rule.windowSizeSeconds * 1000;
    const windowStart = now - windowMs;
    const key = `guardrail:${rule.resource}:${rule.identifierType}:${identifier}`;

    const pipeline = this.redis.pipeline();

    pipeline.zremrangebyscore(key, 0, windowStart);

    pipeline.zcard(key);

    pipeline.zadd(key, now, `${now}-${Math.random()}`);

    pipeline.expire(key, rule.windowSizeSeconds + 1);

    const results = await pipeline.exec();
    const count = (results?.[1]?.[1] as number) ?? 0;

    const allowed = count < rule.limit;
    const remaining = Math.max(0, rule.limit - count - 1);

    const oldest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
    const oldestTimestamp = oldest.length > 1 ? parseInt(oldest[1]) : now;
    const resetAt = new Date(oldestTimestamp + windowMs);

    if (!allowed) {
      await this.redis.zremrangebyscore(key, now, now);

      const retryAfter = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
      return {
        allowed: false,
        limit: rule.limit,
        remaining: 0,
        resetAt,
        retryAfter,
      };
    }

    return { allowed: true, limit: rule.limit, remaining, resetAt };
  }
}
