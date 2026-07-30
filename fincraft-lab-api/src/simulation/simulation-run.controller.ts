import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { ApiGetSimulationRunOperation } from './openapi/simulation-openapi.decorators';
import { SimulationService } from './simulation.service';

@ApiTags('Simulations')
@ApiBearerAuth('access-token')
@Controller('simulation-runs')
export class SimulationRunController {
  constructor(private readonly simulationService: SimulationService) {}

  @Get(':runId')
  @HttpCode(HttpStatus.OK)
  @ApiGetSimulationRunOperation()
  async getSimulationRun(
    @CurrentUser() user: AccessTokenPayload,
    @Param('runId', new ParseUUIDPipe({ version: '4' }))
    runId: string,
  ) {
    const result = await this.simulationService.getSimulationRun(
      user.sub,
      runId,
    );
    return { data: result };
  }
}
