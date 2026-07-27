import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { calculateCraftInputHash } from '../common/craft/calculate-craft-input-hash';
import {
  ActiveStatus,
  ContentStatus,
  CraftRuleType,
  DiscoveryResultStatus,
  UserStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { CraftRequestDto } from './dto/craft-request.dto';
import {
  ExpectedUserElementRaceError,
  isUserElementUniqueConflict,
} from './helpers/craft-prisma-error.helper';
import {
  mapCraftDiscoveryResult,
  mapCraftNoRecipeResult,
} from './mappers/craft-response.mapper';
import { parseCraftSources } from './parsers/craft-sources.parser';
import type {
  CraftDiscoveryDetailInput,
  CraftDiscoveryTransactionResult,
} from './types/craft-service.type';
import type {
  CraftElementResponse,
  CraftResult,
} from './types/craft-response.type';

type RecipeData = {
  recipeId: string;
  canonicalElementIds: [string, string];
  outputElementId: string;
};

@Injectable()
export class CraftService {
  constructor(private readonly prisma: PrismaService) {}

  async craft(userId: string, dto: CraftRequestDto): Promise<CraftResult> {
    await this.validateUserAccount(userId);
    await this.resolveAndValidateInputElements(userId, dto.inputElementIds);
    const recipeData = await this.resolveRecipe(dto.inputElementIds);

    if (!recipeData) {
      await this.recordNoRecipe(userId, dto.inputElementIds);
      return mapCraftNoRecipeResult();
    }

    const { recipeId, canonicalElementIds, outputElementId } = recipeData;
    const { elementResponse, detailInput } =
      await this.resolveAndValidateOutputElement(outputElementId);
    const { isNewDiscovery } = await this.executeDiscoveryTransaction(
      userId,
      recipeId,
      outputElementId,
      canonicalElementIds,
    );

    return mapCraftDiscoveryResult({
      isNewDiscovery,
      element: elementResponse,
      detail: detailInput,
    });
  }

  async preview(dto: CraftRequestDto): Promise<CraftResult> {
    await this.resolveAndValidatePublicInputElements(dto.inputElementIds);
    const recipeData = await this.resolveRecipe(dto.inputElementIds);
    if (!recipeData) return mapCraftNoRecipeResult();

    const { elementResponse, detailInput } =
      await this.resolveAndValidateOutputElement(recipeData.outputElementId);
    return mapCraftDiscoveryResult({
      isNewDiscovery: false,
      element: elementResponse,
      detail: detailInput,
    });
  }

  private async validateUserAccount(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    });
    if (!user) throw new UnauthorizedException('User account not found');
    if (user.status !== UserStatus.ACTIVE)
      throw new ForbiddenException('User account is disabled');
  }

  private async resolveAndValidateInputElements(
    userId: string,
    inputElementIds: string[],
  ): Promise<void> {
    const inputElements = await this.prisma.element.findMany({
      where: { id: { in: inputElementIds } },
      select: { id: true, status: true, isStarter: true },
    });
    const foundIds = new Set(inputElements.map((element) => element.id));
    if (
      foundIds.size !== 2 ||
      !foundIds.has(inputElementIds[0]) ||
      !foundIds.has(inputElementIds[1])
    ) {
      throw new NotFoundException('Element not found');
    }
    for (const element of inputElements) {
      if (element.status !== ContentStatus.ACTIVE)
        throw new BadRequestException('Input element is not active');
    }

    const nonStarterInputIds = inputElements
      .filter((element) => !element.isStarter)
      .map((element) => element.id);
    if (nonStarterInputIds.length === 0) return;
    const unlockedUserElements = await this.prisma.userElement.findMany({
      where: { userId, elementId: { in: nonStarterInputIds } },
      select: { elementId: true },
    });
    const unlockedSet = new Set(
      unlockedUserElements.map((element) => element.elementId),
    );
    for (const elementId of nonStarterInputIds) {
      if (!unlockedSet.has(elementId))
        throw new ForbiddenException('Input element is not unlocked by user');
    }
  }

  private async resolveAndValidatePublicInputElements(
    inputElementIds: string[],
  ): Promise<void> {
    const inputElements = await this.prisma.element.findMany({
      where: { id: { in: inputElementIds } },
      select: {
        id: true,
        status: true,
        isStarter: true,
        category: { select: { status: true } },
      },
    });
    const foundIds = new Set(inputElements.map((element) => element.id));
    if (
      foundIds.size !== 2 ||
      !foundIds.has(inputElementIds[0]) ||
      !foundIds.has(inputElementIds[1])
    ) {
      throw new NotFoundException('Public element not found');
    }
    const hasInvalidElement = inputElements.some(
      (element) =>
        element.status !== ContentStatus.ACTIVE ||
        element.isStarter !== true ||
        element.category.status !== ActiveStatus.ACTIVE,
    );
    if (hasInvalidElement)
      throw new BadRequestException(
        'Only active starter elements can be previewed',
      );
  }

  private async resolveRecipe(
    inputElementIds: string[],
  ): Promise<RecipeData | null> {
    const { inputHash, canonicalElementIds } = calculateCraftInputHash(
      inputElementIds[0],
      inputElementIds[1],
    );
    const recipe = await this.prisma.craftRecipe.findUnique({
      where: { inputHash },
      select: { id: true, outputElementId: true, status: true, ruleType: true },
    });
    if (
      !recipe ||
      recipe.status !== ContentStatus.ACTIVE ||
      recipe.ruleType !== CraftRuleType.COMMUTATIVE
    )
      return null;
    return {
      recipeId: recipe.id,
      canonicalElementIds,
      outputElementId: recipe.outputElementId,
    };
  }

  private async recordNoRecipe(
    userId: string,
    inputElementIds: string[],
  ): Promise<void> {
    const { canonicalElementIds } = calculateCraftInputHash(
      inputElementIds[0],
      inputElementIds[1],
    );
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
  }

  private async resolveAndValidateOutputElement(
    outputElementId: string,
  ): Promise<{
    elementResponse: CraftElementResponse;
    detailInput: CraftDiscoveryDetailInput;
  }> {
    const outputElement = await this.prisma.element.findUnique({
      where: { id: outputElementId },
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
      where: { elementId: outputElementId },
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
    if (!discoveryDetail)
      throw new InternalServerErrorException('Internal server error');
    try {
      parseCraftSources(discoveryDetail.sources);
    } catch {
      throw new InternalServerErrorException('Internal server error');
    }

    return {
      elementResponse: {
        id: outputElement.id,
        name: outputElement.name,
        slug: outputElement.slug,
        iconUrl: outputElement.iconUrl,
        emoji: outputElement.emoji,
        elementType: outputElement.elementType,
        isStarter: outputElement.isStarter,
      },
      detailInput: {
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
      },
    };
  }

  private async executeDiscoveryTransaction(
    userId: string,
    recipeId: string,
    outputElementId: string,
    canonicalElementIds: [string, string],
  ): Promise<CraftDiscoveryTransactionResult> {
    const attempt = async (): Promise<CraftDiscoveryTransactionResult> =>
      this.prisma.$transaction(async (tx) => {
        const existingUserElement = await tx.userElement.findUnique({
          where: { userId_elementId: { userId, elementId: outputElementId } },
        });
        let isNewDiscovery: boolean;
        if (existingUserElement) {
          isNewDiscovery = false;
        } else {
          try {
            await tx.userElement.create({
              data: { userId, elementId: outputElementId },
            });
            isNewDiscovery = true;
          } catch (createError: unknown) {
            if (isUserElementUniqueConflict(createError))
              throw new ExpectedUserElementRaceError();
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

    try {
      return await attempt();
    } catch (error: unknown) {
      if (error instanceof ExpectedUserElementRaceError) {
        try {
          return await attempt();
        } catch (retryError: unknown) {
          if (retryError instanceof HttpException) throw retryError;
          throw new InternalServerErrorException('Internal server error');
        }
      }
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
