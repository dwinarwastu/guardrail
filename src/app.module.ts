import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckModule } from './check/check.module';
import { RuleModule } from './rule/rule.module';
import { LimiterModule } from './limiter/limiter.module';

@Module({
  imports: [CheckModule, RuleModule, LimiterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
