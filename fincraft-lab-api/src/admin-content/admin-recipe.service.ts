import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  calculateCraftInputHash,
  CraftInputHashResult,
} from '../common/craft/calculate-craft-input-hash';
import {
  ContentStatus,
  CraftRuleType,
  Prisma,
  UserStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { AdminRecipeResponseDto } from './dto/recipe-admin-response.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

const RECIPE_INCLUDE = {
  outputElement: true,
  inputs: {
    include: { element: true },
    orderBy: { inputOrder: 'asc' as const },
  },
};

type FullRecipePayload = Prisma.CraftRecipeGetPayload<{
  include: typeof RECIPE_INCLUDE;
}>;

@Injectable()
export class AdminRecipeService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  private async validateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    });
    if (!user) throw new UnauthorizedException('User account not found');
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('User account is disabled');
    }
  }

  private async validateElementExists(elementId: string): Promise<void> {
    const el = await this.prisma.element.findUnique({
      where: { id: elementId },
      select: { id: true },
    });
    if (!el) {
      throw new NotFoundException(`Element not found: ${elementId}`);
    }
  }

  private mapRecipeResponse(recipe: FullRecipePayload): AdminRecipeResponseDto {
    return {
      id: recipe.id,
      outputElementId: recipe.outputElementId,
      ruleType: recipe.ruleType,
      status: recipe.status,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString(),
      outputElement: {
        id: recipe.outputElement.id,
        slug: recipe.outputElement.slug,
        name: recipe.outputElement.name,
        categoryId: recipe.outputElement.categoryId,
        status: recipe.outputElement.status,
      },
      inputs: recipe.inputs.map((inp) => ({
        id: inp.id,
        recipeId: inp.recipeId,
        elementId: inp.elementId,
        inputOrder: inp.inputOrder,
        createdAt: inp.createdAt.toISOString(),
        element: {
          id: inp.element.id,
          slug: inp.element.slug,
          name: inp.element.name,
          categoryId: inp.element.categoryId,
          status: inp.element.status,
        },
      })),
    };
  }

  async getAdminRecipes(userId: string): Promise<AdminRecipeResponseDto[]> {
    await this.validateUser(userId);
    const recipes = await this.prisma.craftRecipe.findMany({
      include: RECIPE_INCLUDE,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });
    return recipes.map((r) => this.mapRecipeResponse(r));
  }

  async getAdminRecipeDetail(
    userId: string,
    recipeId: string,
  ): Promise<AdminRecipeResponseDto> {
    await this.validateUser(userId);
    const recipe = await this.prisma.craftRecipe.findUnique({
      where: { id: recipeId },
      include: RECIPE_INCLUDE,
    });
    if (!recipe) throw new NotFoundException('Craft recipe not found');
    return this.mapRecipeResponse(recipe);
  }

  async createAdminRecipe(
    userId: string,
    dto: CreateRecipeDto,
  ): Promise<AdminRecipeResponseDto> {
    await this.validateUser(userId);
    await this.validateElementExists(dto.outputElementId);
    await this.validateElementExists(dto.inputElementIds[0]);
    await this.validateElementExists(dto.inputElementIds[1]);

    let hashResult: CraftInputHashResult;
    try {
      hashResult = calculateCraftInputHash(
        dto.inputElementIds[0],
        dto.inputElementIds[1],
      );
    } catch (err: unknown) {
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Invalid craft input elements',
      );
    }

    const existing = await this.prisma.craftRecipe.findUnique({
      where: { inputHash: hashResult.inputHash },
    });
    if (existing) {
      throw new ConflictException('Equivalent craft recipe already exists');
    }

    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const recipe = await tx.craftRecipe.create({
          data: {
            outputElementId: dto.outputElementId,
            inputHash: hashResult.inputHash,
            ruleType: dto.ruleType ?? CraftRuleType.COMMUTATIVE,
            status: dto.status ?? ContentStatus.ACTIVE,
            inputs: {
              create: [
                {
                  elementId: hashResult.canonicalElementIds[0],
                  inputOrder: 0,
                },
                {
                  elementId: hashResult.canonicalElementIds[1],
                  inputOrder: 1,
                },
              ],
            },
          },
          include: RECIPE_INCLUDE,
        });
        return recipe;
      });
      return this.mapRecipeResponse(created);
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as Record<string, unknown>)['code'] === 'P2002'
      ) {
        throw new ConflictException('Equivalent craft recipe already exists');
      }
      throw err;
    }
  }

  async updateAdminRecipe(
    userId: string,
    recipeId: string,
    dto: UpdateRecipeDto,
  ): Promise<AdminRecipeResponseDto> {
    await this.validateUser(userId);
    const hasField =
      dto.inputElementIds !== undefined ||
      dto.outputElementId !== undefined ||
      dto.status !== undefined ||
      dto.ruleType !== undefined;

    if (!hasField) {
      throw new BadRequestException(
        'At least one editable field must be provided',
      );
    }

    const existing = await this.prisma.craftRecipe.findUnique({
      where: { id: recipeId },
    });
    if (!existing) throw new NotFoundException('Craft recipe not found');

    if (dto.outputElementId) {
      await this.validateElementExists(dto.outputElementId);
    }

    let hashResult: CraftInputHashResult | undefined;
    if (dto.inputElementIds) {
      await this.validateElementExists(dto.inputElementIds[0]);
      await this.validateElementExists(dto.inputElementIds[1]);
      try {
        hashResult = calculateCraftInputHash(
          dto.inputElementIds[0],
          dto.inputElementIds[1],
        );
      } catch (err: unknown) {
        throw new BadRequestException(
          err instanceof Error ? err.message : 'Invalid craft input elements',
        );
      }

      if (hashResult.inputHash !== existing.inputHash) {
        const conflict = await this.prisma.craftRecipe.findUnique({
          where: { inputHash: hashResult.inputHash },
        });
        if (conflict) {
          throw new ConflictException('Equivalent craft recipe already exists');
        }
      }
    }

    try {
      const updated = await this.prisma.$transaction(async (tx) => {
        if (hashResult) {
          await tx.craftRecipeInput.deleteMany({
            where: { recipeId },
          });
        }

        const recipe = await tx.craftRecipe.update({
          where: { id: recipeId },
          data: {
            ...(dto.outputElementId
              ? { outputElementId: dto.outputElementId }
              : {}),
            ...(hashResult ? { inputHash: hashResult.inputHash } : {}),
            ...(dto.status ? { status: dto.status } : {}),
            ...(dto.ruleType ? { ruleType: dto.ruleType } : {}),
            ...(hashResult
              ? {
                  inputs: {
                    create: [
                      {
                        elementId: hashResult.canonicalElementIds[0],
                        inputOrder: 0,
                      },
                      {
                        elementId: hashResult.canonicalElementIds[1],
                        inputOrder: 1,
                      },
                    ],
                  },
                }
              : {}),
          },
          include: RECIPE_INCLUDE,
        });
        return recipe;
      });
      return this.mapRecipeResponse(updated);
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as Record<string, unknown>)['code'] === 'P2002'
      ) {
        throw new ConflictException('Equivalent craft recipe already exists');
      }
      throw err;
    }
  }

  async archiveRecipe(
    userId: string,
    recipeId: string,
  ): Promise<AdminRecipeResponseDto> {
    await this.validateUser(userId);
    const existing = await this.prisma.craftRecipe.findUnique({
      where: { id: recipeId },
    });
    if (!existing) throw new NotFoundException('Craft recipe not found');

    const updated = await this.prisma.craftRecipe.update({
      where: { id: recipeId },
      data: { status: ContentStatus.INACTIVE },
      include: RECIPE_INCLUDE,
    });
    return this.mapRecipeResponse(updated);
  }
}
