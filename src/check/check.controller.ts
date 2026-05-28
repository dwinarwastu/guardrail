import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckService } from './check.service';
import { CheckRequestDto } from './dto/check-request.dto';
import { CheckResponseDto } from './dto/check-response.dto';

@ApiTags('check')
@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Post()
  @ApiOperation({ summary: 'Check if request is allowed' })
  async check(@Body() dto: CheckRequestDto): Promise<CheckResponseDto> {
    return this.checkService.check(dto);
  }
}
