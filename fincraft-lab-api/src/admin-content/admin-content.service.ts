import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ContentStatus,
  ElementType,
  Prisma,
  UserStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateElementDto } from './dto/create-element.dto';
import {
  AdminElementDetailDto,
  AdminElementSummaryDto,
} from './dto/element-admin-response.dto';
import { UpdateElementDto } from './dto/update-element.dto';
import { UpsertDiscoveryDetailDto } from './dto/upsert-discovery-detail.dto';
import { ElementAdminResponseMapper } from './mappers/element-admin-response.mapper';

@Injectable()
export class AdminContentService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getAdminElements(
    userId: string,
    query?: {
      status?: ContentStatus;
      elementType?: ElementType;
      categoryId?: string;
    },
  ): Promise<AdminElementSummaryDto[]> {
    await this.validateUser(userId);

    const where: Prisma.ElementWhereInput = {};
    if (query?.status) where.status = query.status;
    if (query?.elementType) where.elementType = query.elementType;
    if (query?.categoryId) where.categoryId = query.categoryId;

    const elements = await this.prisma.element.findMany({
      where,
      include: {
        category: true,
        discoveryDetail: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return elements.map((el) => ElementAdminResponseMapper.toSummaryDto(el));
  }

  async getAdminElementDetail(
    userId: string,
    elementId: string,
  ): Promise<AdminElementDetailDto> {
    await this.validateUser(userId);

    const element = await this.prisma.element.findUnique({
      where: { id: elementId },
      include: {
        category: true,
        discoveryDetail: true,
      },
    });

    if (!element) {
      throw new NotFoundException('Element not found');
    }

    return ElementAdminResponseMapper.toDetailDto(element);
  }

  async createAdminElement(
    userId: string,
    dto: CreateElementDto,
  ): Promise<AdminElementDetailDto> {
    await this.validateUser(userId);

    const normalizedSlug = dto.slug.trim().toLowerCase();

    const category = await this.prisma.elementCategory.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Element category not found');
    }

    const existingSlug = await this.prisma.element.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existingSlug) {
      throw new ConflictException('Element slug already exists');
    }

    try {
      const element = await this.prisma.element.create({
        data: {
          name: dto.name,
          slug: normalizedSlug,
          categoryId: dto.categoryId,
          emoji: dto.emoji,
          elementType: dto.elementType,
          isStarter: dto.isStarter ?? false,
          status: dto.status ?? ContentStatus.PENDING,
          iconUrl: dto.iconUrl ?? null,
        },
        include: {
          category: true,
          discoveryDetail: true,
        },
      });

      return ElementAdminResponseMapper.toDetailDto(element);
    } catch (error: unknown) {
      this.handleDuplicateError(error);
      throw error;
    }
  }

  async updateAdminElement(
    userId: string,
    elementId: string,
    dto: UpdateElementDto,
  ): Promise<AdminElementDetailDto> {
    await this.validateUser(userId);

    const hasEditableField =
      dto !== undefined &&
      dto !== null &&
      (dto.name !== undefined ||
        dto.categoryId !== undefined ||
        dto.emoji !== undefined ||
        dto.status !== undefined ||
        dto.iconUrl !== undefined);

    if (!hasEditableField) {
      throw new BadRequestException(
        'At least one editable field must be provided',
      );
    }

    if (dto.name === null) {
      throw new BadRequestException('Element name cannot be null');
    }
    if (dto.categoryId === null) {
      throw new BadRequestException('Element categoryId cannot be null');
    }
    if (dto.emoji === null) {
      throw new BadRequestException('Element emoji cannot be null');
    }
    if (dto.status === null) {
      throw new BadRequestException('Element status cannot be null');
    }

    const existingElement = await this.prisma.element.findUnique({
      where: { id: elementId },
    });

    if (!existingElement) {
      throw new NotFoundException('Element not found');
    }

    if (dto.categoryId !== undefined) {
      const category = await this.prisma.elementCategory.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Element category not found');
      }
    }

    const data: Prisma.ElementUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.categoryId !== undefined)
      data.category = { connect: { id: dto.categoryId } };
    if (dto.emoji !== undefined) data.emoji = dto.emoji;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.iconUrl !== undefined) data.iconUrl = dto.iconUrl;

    const updated = await this.prisma.element.update({
      where: { id: elementId },
      data,
      include: {
        category: true,
        discoveryDetail: true,
      },
    });

    return ElementAdminResponseMapper.toDetailDto(updated);
  }

  async upsertDiscoveryDetail(
    userId: string,
    elementId: string,
    dto: UpsertDiscoveryDetailDto,
  ): Promise<AdminElementDetailDto> {
    await this.validateUser(userId);

    const element = await this.prisma.element.findUnique({
      where: { id: elementId },
    });

    if (!element) {
      throw new NotFoundException('Element not found');
    }

    const detailData = {
      shortDescription: dto.shortDescription,
      realLesson: dto.realLesson,
      example: dto.example ?? null,
      possibleBenefit: dto.possibleBenefit ?? null,
      possibleTradeoff: dto.possibleTradeoff ?? null,
      hiddenRisk: dto.hiddenRisk ?? null,
      worksWhen: dto.worksWhen ?? null,
      becomesDifficultWhen: dto.becomesDifficultWhen ?? null,
      whatChangesOutcome: dto.whatChangesOutcome ?? null,
      realityLevel: dto.realityLevel,
      safetyLabel: dto.safetyLabel,
      sources: dto.sources as unknown as Prisma.InputJsonValue,
    };

    await this.prisma.discoveryDetail.upsert({
      where: { elementId },
      create: {
        element: { connect: { id: elementId } },
        ...detailData,
      },
      update: detailData,
    });

    const reloaded = await this.prisma.element.findUniqueOrThrow({
      where: { id: elementId },
      include: {
        category: true,
        discoveryDetail: true,
      },
    });

    return ElementAdminResponseMapper.toDetailDto(reloaded);
  }

  private handleDuplicateError(error: unknown): void {
    if (this.isElementSlugConflict(error)) {
      throw new ConflictException('Element slug already exists');
    }
  }

  private isElementSlugConflict(error: unknown): boolean {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== 'P2002'
    ) {
      return false;
    }

    const meta = error.meta as
      | {
          modelName?: string;
          target?: unknown;
          driverAdapterError?: {
            cause?: {
              constraint?: {
                fields?: unknown;
              };
              originalMessage?: string;
            };
          };
        }
      | undefined;

    if (!meta) {
      return false;
    }

    const target = meta.target;
    if (Array.isArray(target)) {
      if (target.includes('slug')) {
        return true;
      }
    } else if (typeof target === 'string') {
      if (target === 'slug' || target.includes('elements_slug_key')) {
        return true;
      }
    }

    const driverFields = meta.driverAdapterError?.cause?.constraint?.fields;
    if (Array.isArray(driverFields)) {
      if (driverFields.includes('slug')) {
        return true;
      }
    }

    const originalMsg = meta.driverAdapterError?.cause?.originalMessage;
    if (
      typeof originalMsg === 'string' &&
      originalMsg.includes('elements_slug_key')
    ) {
      return true;
    }

    return false;
  }
}
