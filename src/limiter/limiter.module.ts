import { Module } from '@nestjs/common';
import { LimiterService } from './limiter.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [LimiterService],
  exports: [LimiterService],
})
export class LimiterModule {}
