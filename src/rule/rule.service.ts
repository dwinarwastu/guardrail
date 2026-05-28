import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from 'src/common/entities/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';
import { IdentifierType } from 'src/common/enums/identifier-type.enum';
import { RuleStatus } from 'src/common/enums/rule-status.enum';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
  ) {}

  async create(dto: CreateRuleDto): Promise<Rule> {
    const rule = this.ruleRepository.create({
      ...dto,
      status: dto.status ?? RuleStatus.ACTIVE,
    });
    return this.ruleRepository.save(rule);
  }

  async findAll(): Promise<Rule[]> {
    return this.ruleRepository.find();
  }

  async findActiveByResource(
    resource: string,
    identifierType: IdentifierType,
  ): Promise<Rule | null> {
    return this.ruleRepository.findOne({
      where: { resource, identifierType, status: RuleStatus.ACTIVE },
    });
  }

  async remove(id: string): Promise<void> {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) throw new NotFoundException('Rule not found');
    await this.ruleRepository.remove(rule);
  }

  async toggleStatus(id: string): Promise<Rule> {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) throw new NotFoundException('Rule not found');
    rule.status =
      rule.status === RuleStatus.ACTIVE
        ? RuleStatus.INACTIVE
        : RuleStatus.ACTIVE;
    return this.ruleRepository.save(rule);
  }
}
