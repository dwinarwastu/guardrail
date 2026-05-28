import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from 'src/common/entities/rule.entity';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  controllers: [RuleController],
  providers: [RuleService],
  exports: [RuleService],
})
export class RuleModule {}
