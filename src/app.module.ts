import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckModule } from './check/check.module';
import { RuleModule } from './rule/rule.module';
import { LimiterModule } from './limiter/limiter.module';
import { Rule } from './common/entities/rule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [Rule],
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    CheckModule,
    RuleModule,
    LimiterModule,
  ],
})
export class AppModule {}
