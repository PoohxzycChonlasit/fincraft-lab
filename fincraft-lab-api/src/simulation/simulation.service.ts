import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ActiveStatus,
  Prisma,
  UserStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { SURVIVAL_MONTHS_DEFINITION } from './constants/survival-months.definition';
import type { SurvivalMonthsRunRequestDto } from './dto/survival-months-run-request.dto';
import type {
  SimulationDetailResponseDto,
  SimulationRunResponseDto,
  SimulationSummaryResponseDto,
  SurvivalMonthsResultDto,
} from './dto/simulation-response.dto';
import { SimulationCalculatorService } from './simulation-calculator.service';

@Injectable()
export class SimulationService {
  private readonly supportedSlugs = new Set([SURVIVAL_MONTHS_DEFINITION.slug]);

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    private readonly calculatorService: SimulationCalculatorService,
  ) {}

  private async validateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    });

    if (!user) {
      throw new UnauthorizedException('User account not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('User account is disabled');
    }
  }

  async listSimulations(
    userId: string,
  ): Promise<SimulationSummaryResponseDto[]> {
    await this.validateUser(userId);

    const activeSimulations = await this.prisma.simulation.findMany({
      where: {
        status: ActiveStatus.ACTIVE,
        simulationType: {
          in: Array.from(this.supportedSlugs),
        },
      },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });

    return activeSimulations.map((sim) => ({
      id: sim.id,
      slug: sim.simulationType,
      name: sim.name,
      thaiName: SURVIVAL_MONTHS_DEFINITION.thaiName,
      summary: SURVIVAL_MONTHS_DEFINITION.summary,
      isActive: sim.status === ActiveStatus.ACTIVE,
    }));
  }

  async getSimulationDetail(
    userId: string,
    simulationId: string,
  ): Promise<SimulationDetailResponseDto> {
    await this.validateUser(userId);

    const sim = await this.prisma.simulation.findUnique({
      where: { id: simulationId },
    });

    if (
      !sim ||
      sim.status !== ActiveStatus.ACTIVE ||
      !this.supportedSlugs.has(sim.simulationType)
    ) {
      throw new NotFoundException('Simulation not found');
    }

    return {
      id: sim.id,
      slug: sim.simulationType,
      name: sim.name,
      thaiName: SURVIVAL_MONTHS_DEFINITION.thaiName,
      summary: SURVIVAL_MONTHS_DEFINITION.summary,
      description: sim.description,
      inputDefinitions: Array.from(SURVIVAL_MONTHS_DEFINITION.inputDefinitions),
      formulaExplanation: SURVIVAL_MONTHS_DEFINITION.formulaExplanation,
      assumptions: Array.from(SURVIVAL_MONTHS_DEFINITION.assumptions),
      limitations: Array.from(SURVIVAL_MONTHS_DEFINITION.limitations),
      sources: Array.from(SURVIVAL_MONTHS_DEFINITION.sources),
      disclaimer: SURVIVAL_MONTHS_DEFINITION.disclaimer,
      calculationVersion: SURVIVAL_MONTHS_DEFINITION.calculationVersion,
      isActive: sim.status === ActiveStatus.ACTIVE,
    };
  }

  async runSimulation(
    userId: string,
    simulationId: string,
    dto: SurvivalMonthsRunRequestDto,
  ): Promise<SimulationRunResponseDto> {
    await this.validateUser(userId);

    const sim = await this.prisma.simulation.findUnique({
      where: { id: simulationId },
    });

    if (
      !sim ||
      sim.status !== ActiveStatus.ACTIVE ||
      !this.supportedSlugs.has(sim.simulationType)
    ) {
      throw new NotFoundException('Simulation not found');
    }

    const calculated = this.calculatorService.calculateSurvivalMonths(dto);

    const inputsSnapshot: Prisma.InputJsonObject = {
      emergencyFund: calculated.normalizedInput.emergencyFund,
      essentialMonthlyExpenses:
        calculated.normalizedInput.essentialMonthlyExpenses,
    };

    const outputsSnapshot: Prisma.InputJsonObject = {
      calculationVersion: SURVIVAL_MONTHS_DEFINITION.calculationVersion,
      result: calculated.result as unknown as Prisma.InputJsonObject,
      statementEn: calculated.result.statementEn,
      statementTh: calculated.result.statementTh,
      assumptions: Array.from(SURVIVAL_MONTHS_DEFINITION.assumptions),
      limitations: Array.from(SURVIVAL_MONTHS_DEFINITION.limitations),
      disclaimer: SURVIVAL_MONTHS_DEFINITION.disclaimer,
      sources:
        SURVIVAL_MONTHS_DEFINITION.sources as unknown as Prisma.InputJsonValue[],
    };

    const run = await this.prisma.simulationRun.create({
      data: {
        userId,
        simulationId: sim.id,
        inputs: inputsSnapshot,
        outputs: outputsSnapshot,
      },
    });

    return {
      runId: run.id,
      simulation: {
        id: sim.id,
        slug: sim.simulationType,
        name: sim.name,
      },
      input: calculated.normalizedInput,
      result: calculated.result,
      assumptions: Array.from(SURVIVAL_MONTHS_DEFINITION.assumptions),
      limitations: Array.from(SURVIVAL_MONTHS_DEFINITION.limitations),
      sources: Array.from(SURVIVAL_MONTHS_DEFINITION.sources),
      disclaimer: SURVIVAL_MONTHS_DEFINITION.disclaimer,
      calculationVersion: SURVIVAL_MONTHS_DEFINITION.calculationVersion,
      createdAt: run.createdAt.toISOString(),
    };
  }

  async getSimulationRun(
    userId: string,
    runId: string,
  ): Promise<SimulationRunResponseDto> {
    await this.validateUser(userId);

    const run = await this.prisma.simulationRun.findUnique({
      where: { id: runId },
      include: { simulation: true },
    });

    if (!run || run.userId !== userId) {
      throw new NotFoundException('Simulation run not found');
    }

    const inputsObj = run.inputs as Record<string, string | number>;
    const outputsObj = run.outputs as Record<string, unknown>;
    const rawResult = outputsObj['result'] as SurvivalMonthsResultDto | undefined;

    return {
      runId: run.id,
      simulation: {
        id: run.simulation.id,
        slug: run.simulation.simulationType,
        name: run.simulation.name,
      },
      input: {
        emergencyFund:
          typeof inputsObj['emergencyFund'] === 'number' ||
          typeof inputsObj['emergencyFund'] === 'string'
            ? String(inputsObj['emergencyFund'])
            : '0.00',
        essentialMonthlyExpenses:
          typeof inputsObj['essentialMonthlyExpenses'] === 'number' ||
          typeof inputsObj['essentialMonthlyExpenses'] === 'string'
            ? String(inputsObj['essentialMonthlyExpenses'])
            : '0.00',
      },
      result: {
        survivalMonths: rawResult?.survivalMonths ?? '0.00',
        wholeMonthsCovered: rawResult?.wholeMonthsCovered ?? 0,
        remainingAmount: rawResult?.remainingAmount ?? '0.00',
        statementEn: rawResult?.statementEn ?? '',
        statementTh: rawResult?.statementTh ?? '',
      },
      assumptions: Array.isArray(outputsObj['assumptions'])
        ? (outputsObj['assumptions'] as string[])
        : Array.from(SURVIVAL_MONTHS_DEFINITION.assumptions),
      limitations: Array.isArray(outputsObj['limitations'])
        ? (outputsObj['limitations'] as string[])
        : Array.from(SURVIVAL_MONTHS_DEFINITION.limitations),
      sources: Array.from(SURVIVAL_MONTHS_DEFINITION.sources),
      disclaimer:
        typeof outputsObj['disclaimer'] === 'string'
          ? outputsObj['disclaimer']
          : SURVIVAL_MONTHS_DEFINITION.disclaimer,
      calculationVersion:
        typeof outputsObj['calculationVersion'] === 'string'
          ? outputsObj['calculationVersion']
          : SURVIVAL_MONTHS_DEFINITION.calculationVersion,
      createdAt: run.createdAt.toISOString(),
    };
  }
}
