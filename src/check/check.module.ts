import { Module } from '@nestjs/common';
import { CheckController } from './check.controller';
import { CheckService } from './check.service';
import { LimiterModule } from 'src/limiter/limiter.module';
import { RuleModule } from 'src/rule/rule.module';

@Module({
  imports: [LimiterModule, RuleModule],
  controllers: [CheckController],
  providers: [CheckService],
})
export class CheckModule {}
