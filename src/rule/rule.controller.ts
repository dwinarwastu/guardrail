import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { Rule } from 'src/common/entities/rule.entity';

@ApiTags('rule')
@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rate limit rule' })
  async create(@Body() dto: CreateRuleDto): Promise<Rule> {
    return this.ruleService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all rules' })
  async findAll(): Promise<Rule[]> {
    return this.ruleService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a rule' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.ruleService.remove(id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle rule active status' })
  async toggleStatus(@Param('id') id: string): Promise<Rule> {
    return this.ruleService.toggleStatus(id);
  }
}
