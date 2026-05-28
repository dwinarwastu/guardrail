import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { IdentifierType } from 'src/common/enums/identifier-type.enum';
import { RuleStatus } from 'src/common/enums/rule-status.enum';

export class CreateRuleDto {
  @ApiProperty({ example: '/api/login' })
  @IsString()
  resource: string;

  @ApiProperty({ enum: IdentifierType, example: IdentifierType.IP })
  @IsEnum(IdentifierType)
  identifierType: IdentifierType;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @Min(1)
  windowSizeSeconds: number;

  @ApiPropertyOptional({ enum: RuleStatus, example: RuleStatus.ACTIVE })
  @IsEnum(RuleStatus)
  @IsOptional()
  status?: RuleStatus;
}
