import { Injectable, NotFoundException } from '@nestjs/common';
import { LimiterService } from 'src/limiter/limiter.service';
import { RuleService } from 'src/rule/rule.service';
import { CheckRequestDto } from './dto/check-request.dto';
import { CheckResponseDto } from './dto/check-response.dto';

@Injectable()
export class CheckService {
  constructor(
    private readonly limiterService: LimiterService,
    private readonly ruleService: RuleService,
  ) {}

  async check(dto: CheckRequestDto): Promise<CheckResponseDto> {
    const rule = await this.ruleService.findActiveByResource(
      dto.resource,
      dto.identifierType,
    );

    if (!rule) {
      throw new NotFoundException(
        `No active rule found for resource "${dto.resource}" with identifier type "${dto.identifierType}"`,
      );
    }

    const result = await this.limiterService.check(rule, dto.identifier);

    return {
      allowed: result.allowed,
      limit: result.limit,
      remaining: result.remaining,
      resetAt: result.resetAt,
      retryAfter: result.retryAfter,
    };
  }
}
