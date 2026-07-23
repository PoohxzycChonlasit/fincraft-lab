import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ContentStatus,
  CraftRuleType,
  DiscoveryResultStatus,
  Prisma,
  UserStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { calculateCraftInputHash } from '../common/craft/calculate-craft-input-hash';
import { parseCraftSources } from './parsers/craft-sources.parser';
import {
  mapCraftDiscoveryResult,
  mapCraftNoRecipeResult,
} from './mappers/craft-response.mapper';
import type { CraftRequestDto } from './dto/craft-request.dto';
import type {
  CraftDiscoveryDetailMapperInput,
  CraftDiscoveryMapperInput,
} from './mappers/craft-response.mapper';
import type {
  CraftElementResponse,
  CraftResult,
} from './types/craft-response.type';

@Injectable()
export class CraftService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Main entry point for processing a Crafting request.
   *
   * Flow:
   * 1. Validates current User account & active status.
   * 2. Resolves Input Elements and validates status & user unlocks.
   * 3. Calculates canonical input hash.
   * 4. Resolves active COMMUTATIVE Recipe.
   * 5. If NO_RECIPE: records NO_RECIPE Event in transaction and returns mapped result.
   * 6. If DISCOVERY: validates Output Element & Detail invariants + sources before write.
   * 7. Executes DISCOVERY write transaction (find/create UserElement + SUCCESS Event).
   * 8. Handles expected UserElement P2002 race condition with 1 fresh retry.
   * 9. Returns mapped public CraftResult.
   */
  async craft(userId: string, dto: CraftRequestDto): Promise<CraftResult> {
    // 1. Current User Lookup & Status Validation
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

    // 2. Input Element Resolution & Active Check
    const inputElements = await this.prisma.element.findMany({
      where: { id: { in: dto.inputElementIds } },
      select: {
        id: true,
        status: true,
        isStarter: true,
      },
    });

    const foundIds = new Set(inputElements.map((e) => e.id));
    if (
      foundIds.size !== 2 ||
      !foundIds.has(dto.inputElementIds[0]) ||
      !foundIds.has(dto.inputElementIds[1])
    ) {
      throw new NotFoundException('Element not found');
    }

    for (const elem of inputElements) {
      if (elem.status !== ContentStatus.ACTIVE) {
        throw new BadRequestException('Input element is not active');
      }
    }

    // 3. Availability Check for Non-Starter Inputs
    const nonStarterInputIds = inputElements
      .filter((e) => !e.isStarter)
      .map((e) => e.id);

    if (nonStarterInputIds.length > 0) {
      const unlockedUserElements = await this.prisma.userElement.findMany({
        where: {
          userId,
          elementId: { in: nonStarterInputIds },
        },
        select: { elementId: true },
      });

      const unlockedSet = new Set(
        unlockedUserElements.map((ue) => ue.elementId),
      );
      for (const nonStarterId of nonStarterInputIds) {
        if (!unlockedSet.has(nonStarterId)) {
          throw new ForbiddenException('Input element is not unlocked by user');
        }
      }
    }

    // 4. Calculate Canonical Input Hash & Ordered IDs
    const { inputHash, canonicalElementIds } = calculateCraftInputHash(
      dto.inputElementIds[0],
      dto.inputElementIds[1],
    );

    // 5. Active COMMUTATIVE Recipe Resolution
    const recipe = await this.prisma.craftRecipe.findUnique({
      where: { inputHash },
      select: {
        id: true,
        outputElementId: true,
        status: true,
        ruleType: true,
      },
    });

    if (
      !recipe ||
      recipe.status !== ContentStatus.ACTIVE ||
      recipe.ruleType !== CraftRuleType.COMMUTATIVE
    ) {
      // Execute NO_RECIPE transaction
      await this.prisma.discoveryEvent.create({
        data: {
          userId,
          recipeId: null,
          resultElementId: null,
          inputElementIds: canonicalElementIds,
          resultStatus: DiscoveryResultStatus.NO_RECIPE,
        },
      });

      return mapCraftNoRecipeResult();
    }

    // 6. DISCOVERY Output Element & Detail Invariant Checks
    const outputElement = await this.prisma.element.findUnique({
      where: { id: recipe.outputElementId },
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
        emoji: true,
        elementType: true,
        isStarter: true,
        status: true,
      },
    });

    if (
      !outputElement ||
      outputElement.status !== ContentStatus.ACTIVE ||
      outputElement.isStarter === true
    ) {
      throw new InternalServerErrorException('Internal server error');
    }

    const discoveryDetail = await this.prisma.discoveryDetail.findUnique({
      where: { elementId: recipe.outputElementId },
      select: {
        shortDescription: true,
        realLesson: true,
        example: true,
        possibleBenefit: true,
        possibleTradeoff: true,
        hiddenRisk: true,
        worksWhen: true,
        becomesDifficultWhen: true,
        whatChangesOutcome: true,
        realityLevel: true,
        safetyLabel: true,
        sources: true,
      },
    });

    if (!discoveryDetail) {
      throw new InternalServerErrorException('Internal server error');
    }

    // Pre-validate sources before starting write transaction
    try {
      parseCraftSources(discoveryDetail.sources);
    } catch {
      throw new InternalServerErrorException('Internal server error');
    }

    const elementResponse: CraftElementResponse = {
      id: outputElement.id,
      name: outputElement.name,
      slug: outputElement.slug,
      iconUrl: outputElement.iconUrl,
      emoji: outputElement.emoji,
      elementType: outputElement.elementType,
      isStarter: outputElement.isStarter,
    };

    const detailInput: CraftDiscoveryDetailMapperInput = {
      shortDescription: discoveryDetail.shortDescription,
      realLesson: discoveryDetail.realLesson,
      example: discoveryDetail.example,
      possibleBenefit: discoveryDetail.possibleBenefit,
      possibleTradeoff: discoveryDetail.possibleTradeoff,
      hiddenRisk: discoveryDetail.hiddenRisk,
      worksWhen: discoveryDetail.worksWhen,
      becomesDifficultWhen: discoveryDetail.becomesDifficultWhen,
      whatChangesOutcome: discoveryDetail.whatChangesOutcome,
      realityLevel: discoveryDetail.realityLevel,
      safetyLabel: discoveryDetail.safetyLabel,
      sources: discoveryDetail.sources,
    };

    // 7. Transactional Write & Concurrency Retry Execution
    return await this.executeDiscoveryTransaction(
      userId,
      recipe.id,
      elementResponse,
      detailInput,
      canonicalElementIds,
    );
  }

  /**
   * Executes the DISCOVERY write transaction with 1 fresh retry for expected UserElement P2002 race condition.
   */
  private async executeDiscoveryTransaction(
    userId: string,
    recipeId: string,
    outputElement: CraftElementResponse,
    detailInput: CraftDiscoveryDetailMapperInput,
    canonicalElementIds: [string, string],
  ): Promise<CraftResult> {
    const attempt = async (): Promise<CraftResult> => {
      return await this.prisma.$transaction(async (tx) => {
        const existingUserElement = await tx.userElement.findUnique({
          where: {
            userId_elementId: {
              userId,
              elementId: outputElement.id,
            },
          },
        });

        let isNewDiscovery: boolean;

        if (existingUserElement) {
          isNewDiscovery = false;
        } else {
          await tx.userElement.create({
            data: {
              userId,
              elementId: outputElement.id,
            },
          });
          isNewDiscovery = true;
        }

        await tx.discoveryEvent.create({
          data: {
            userId,
            recipeId,
            resultElementId: outputElement.id,
            inputElementIds: canonicalElementIds,
            resultStatus: DiscoveryResultStatus.SUCCESS,
          },
        });

        const discoveryMapperInput: CraftDiscoveryMapperInput = {
          isNewDiscovery,
          element: outputElement,
          detail: detailInput,
        };

        return mapCraftDiscoveryResult(discoveryMapperInput);
      });
    };

    try {
      return await attempt();
    } catch (error: unknown) {
      if (this.isExpectedUserElementP2002(error)) {
        // Attempt fresh transaction retry (maximum 1 retry)
        try {
          return await attempt();
        } catch (retryError: unknown) {
          if (retryError instanceof HttpException) {
            throw retryError;
          }
          throw new InternalServerErrorException('Internal server error');
        }
      }

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * Classifies whether a P2002 unique constraint error originates from the expected UserElement.create race.
   */
  private isExpectedUserElementP2002(error: unknown): boolean {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== 'P2002'
    ) {
      return false;
    }

    const meta = error.meta as { target?: unknown } | undefined;
    if (!meta || !meta.target) {
      return true;
    }

    if (Array.isArray(meta.target)) {
      const targets = meta.target as string[];
      if (
        (targets.includes('user_id') && targets.includes('element_id')) ||
        (targets.includes('userId') && targets.includes('elementId')) ||
        targets.includes('user_elements_user_id_element_id_key')
      ) {
        return true;
      }
    } else if (typeof meta.target === 'string') {
      if (
        meta.target.includes('user_elements') ||
        meta.target.includes('user_id') ||
        meta.target.includes('element_id')
      ) {
        return true;
      }
    }

    return true;
  }
}
