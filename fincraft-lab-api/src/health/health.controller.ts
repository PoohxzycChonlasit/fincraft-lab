import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { HealthService } from './health.service';
import type { HealthStatus } from './health.service';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'System health status indicator' })
  status!: string;

  @ApiProperty({ example: 'fincraft-lab-api', description: 'Application service identifier' })
  service!: string;

  @ApiProperty({ example: '2026-07-24T10:30:00.000Z', description: 'Current ISO-8601 server timestamp' })
  timestamp!: string;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Check API service health status',
    description: 'Public health telemetry endpoint verifying API availability and system timestamp.',
  })
  @ApiOkResponse({
    description: 'System is healthy and operational',
    type: HealthResponseDto,
  })
  getHealth(): HealthStatus {
    return this.healthService.getHealth();
  }
}
