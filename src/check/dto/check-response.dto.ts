import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckResponseDto {
  @ApiProperty({ example: true })
  allowed: boolean;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 9 })
  remaining: number;

  @ApiProperty({ example: '2026-05-12T08:00:00.000Z' })
  resetAt: Date;

  @ApiPropertyOptional({ example: 30 })
  retryAfter?: number;
}
