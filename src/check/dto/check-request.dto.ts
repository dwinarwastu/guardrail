import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { IdentifierType } from 'src/common/enums/identifier-type.enum';

export class CheckRequestDto {
  @ApiProperty({ example: '/api/login' })
  @IsString()
  resource: string;

  @ApiProperty({ enum: IdentifierType, example: IdentifierType.IP })
  @IsEnum(IdentifierType)
  identifierType: IdentifierType;

  @ApiProperty({ example: '192.168.1.1' })
  @IsString()
  identifier: string;
}
