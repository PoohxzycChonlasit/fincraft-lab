import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ActiveStatus, UserStatus } from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { AdminCategoryResponseDto } from './dto/category-admin-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class AdminCategoryService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
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

  async getAdminCategories(
    userId: string,
  ): Promise<AdminCategoryResponseDto[]> {
    await this.validateUser(userId);

    const categories = await this.prisma.elementCategory.findMany({
      include: {
        _count: {
          select: { elements: true },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      sortOrder: cat.sortOrder,
      status: cat.status,
      elementCount: cat._count.elements,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
    }));
  }

  async getAdminCategoryDetail(
    userId: string,
    categoryId: string,
  ): Promise<AdminCategoryResponseDto> {
    await this.validateUser(userId);

    const cat = await this.prisma.elementCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { elements: true },
        },
      },
    });

    if (!cat) {
      throw new NotFoundException('Element category not found');
    }

    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      sortOrder: cat.sortOrder,
      status: cat.status,
      elementCount: cat._count.elements,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
    };
  }

  async createAdminCategory(
    userId: string,
    dto: CreateCategoryDto,
  ): Promise<AdminCategoryResponseDto> {
    await this.validateUser(userId);

    const trimmedName = dto.name.trim();

    const existingName = await this.prisma.elementCategory.findUnique({
      where: { name: trimmedName },
    });

    if (existingName) {
      throw new ConflictException('Element category name already exists');
    }

    const cat = await this.prisma.elementCategory.create({
      data: {
        name: trimmedName,
        description: dto.description ? dto.description.trim() : null,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? ActiveStatus.ACTIVE,
      },
    });

    return {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      sortOrder: cat.sortOrder,
      status: cat.status,
      elementCount: 0,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
    };
  }

  async updateAdminCategory(
    userId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ): Promise<AdminCategoryResponseDto> {
    await this.validateUser(userId);

    const hasEditableField =
      dto !== undefined &&
      dto !== null &&
      (dto.name !== undefined ||
        dto.description !== undefined ||
        dto.sortOrder !== undefined ||
        dto.status !== undefined);

    if (!hasEditableField) {
      throw new BadRequestException(
        'At least one editable field must be provided',
      );
    }

    if (dto.name === null) {
      throw new BadRequestException('Category name cannot be null');
    }

    const existing = await this.prisma.elementCategory.findUnique({
      where: { id: categoryId },
    });

    if (!existing) {
      throw new NotFoundException('Element category not found');
    }

    if (dto.name !== undefined) {
      const trimmedName = dto.name.trim();
      if (trimmedName !== existing.name) {
        const conflict = await this.prisma.elementCategory.findUnique({
          where: { name: trimmedName },
        });

        if (conflict) {
          throw new ConflictException('Element category name already exists');
        }
      }
    }

    const updated = await this.prisma.elementCategory.update({
      where: { id: categoryId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description ? dto.description.trim() : null }
          : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
      include: {
        _count: { select: { elements: true } },
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      sortOrder: updated.sortOrder,
      status: updated.status,
      elementCount: updated._count.elements,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async archiveCategory(
    userId: string,
    categoryId: string,
  ): Promise<AdminCategoryResponseDto> {
    await this.validateUser(userId);

    const existing = await this.prisma.elementCategory.findUnique({
      where: { id: categoryId },
    });

    if (!existing) {
      throw new NotFoundException('Element category not found');
    }

    const updated = await this.prisma.elementCategory.update({
      where: { id: categoryId },
      data: { status: ActiveStatus.INACTIVE },
      include: {
        _count: { select: { elements: true } },
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      sortOrder: updated.sortOrder,
      status: updated.status,
      elementCount: updated._count.elements,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
