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
  UserStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { calculateCraftInputHash } from '../common/craft/calculate-craft-input-hash';
import { parseCraftSources } from './parsers/craft-sources.parser';
import {
  mapCraftDiscoveryResult,
  mapCraftNoRecipeResult,
} from './mappers/craft-response.mapper';
import {
  ExpectedUserElementRaceError,
  isUserElementUniqueConflict,
} from './helpers/craft-prisma-error.helper';
import type { CraftRequestDto } from './dto/craft-request.dto';
import type {
  CraftDiscoveryDetailInput,
  CraftDiscoveryTransactionResult,
} from './types/craft-service.type';
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
   * 9. Returns mapped public CraftResult after transaction commit.
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
      // Execute NO_RECIPE write transaction
      await this.prisma.$transaction(async (tx) => {
        await tx.discoveryEvent.create({
          data: {
            userId,
            recipeId: null,
            resultElementId: null,
            inputElementIds: canonicalElementIds,
            resultStatus: DiscoveryResultStatus.NO_RECIPE,
          },
        });
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

    const detailInput: CraftDiscoveryDetailInput = {
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

    // 7. Transactional Write Execution (returns isNewDiscovery boolean only)
    const { isNewDiscovery } = await this.executeDiscoveryTransaction(
      userId,
      recipe.id,
      outputElement.id,
      canonicalElementIds,
    );

    // 8. Map and return public CraftDiscoveryResult ONLY AFTER transaction commit
    return mapCraftDiscoveryResult({
      isNewDiscovery,
      element: elementResponse,
      detail: detailInput,
    });
  }

  /**
   * Executes the DISCOVERY write transaction.
   * Catches and converts P2002 strictly on tx.userElement.create into ExpectedUserElementRaceError,
   * enabling 1 fresh transaction retry if a race occurs.
   */
  private async executeDiscoveryTransaction(
    userId: string,
    recipeId: string,
    outputElementId: string,
    canonicalElementIds: [string, string],
  ): Promise<CraftDiscoveryTransactionResult> {
    const attempt = async (): Promise<CraftDiscoveryTransactionResult> => {
      return await this.prisma.$transaction(async (tx) => {
        const existingUserElement = await tx.userElement.findUnique({
          where: {
            userId_elementId: {
              userId,
              elementId: outputElementId,
            },
          },
        });

        let isNewDiscovery: boolean;

        if (existingUserElement) {
          isNewDiscovery = false;
        } else {
          try {
            await tx.userElement.create({
              data: {
                userId,
                elementId: outputElementId,
              },
            });
            isNewDiscovery = true;
          } catch (createError: unknown) {
            if (isUserElementUniqueConflict(createError)) {
              throw new ExpectedUserElementRaceError();
            }
            throw createError;
          }
        }

        await tx.discoveryEvent.create({
          data: {
            userId,
            recipeId,
            resultElementId: outputElementId,
            inputElementIds: canonicalElementIds,
            resultStatus: DiscoveryResultStatus.SUCCESS,
          },
        });

        return { isNewDiscovery };
      });
    };

    try {
      return await attempt();
    } catch (error: unknown) {
      if (error instanceof ExpectedUserElementRaceError) {
        // Retry once in a fresh transaction
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
}
