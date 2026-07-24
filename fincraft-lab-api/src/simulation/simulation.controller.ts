import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { SurvivalMonthsRunRequestDto } from './dto/survival-months-run-request.dto';
import {
  ApiGetSimulationDetailOperation,
  ApiListSimulationsOperation,
  ApiRunSimulationOperation,
} from './openapi/simulation-openapi.decorators';
import { SimulationService } from './simulation.service';

@ApiTags('Simulations')
@ApiBearerAuth('access-token')
@Controller('simulations')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiListSimulationsOperation()
  async listSimulations(@CurrentUser() user: AccessTokenPayload) {
    const result = await this.simulationService.listSimulations(user.sub);
    return { data: result };
  }

  @Get(':simulationId')
  @HttpCode(HttpStatus.OK)
  @ApiGetSimulationDetailOperation()
  async getSimulationDetail(
    @CurrentUser() user: AccessTokenPayload,
    @Param('simulationId', new ParseUUIDPipe({ version: '4' }))
    simulationId: string,
  ) {
    const result = await this.simulationService.getSimulationDetail(
      user.sub,
      simulationId,
    );
    return { data: result };
  }

  @Post(':simulationId/runs')
  @HttpCode(HttpStatus.CREATED)
  @ApiRunSimulationOperation()
  async runSimulation(
    @CurrentUser() user: AccessTokenPayload,
    @Param('simulationId', new ParseUUIDPipe({ version: '4' }))
    simulationId: string,
    @Body() dto: SurvivalMonthsRunRequestDto,
  ) {
    const result = await this.simulationService.runSimulation(
      user.sub,
      simulationId,
      dto,
    );
    return { data: result };
  }
}
