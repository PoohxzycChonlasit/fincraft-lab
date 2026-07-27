import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ActiveStatus,
  ContentStatus,
  UserStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { AvailableElementResponse } from './types/available-element-response.type';

@Injectable()
export class ElementService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicElements(): Promise<AvailableElementResponse[]> {
    return this.prisma.element.findMany({
      where: {
        status: ContentStatus.ACTIVE,
        isStarter: true,
        category: { status: ActiveStatus.ACTIVE },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        emoji: true,
        iconUrl: true,
        elementType: true,
        isStarter: true,
        category: {
          select: {
            id: true,
            name: true,
            sortOrder: true,
          },
        },
      },
      orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
    });
  }

  /**
   * Retrieves all active Elements available to the specified user.
   *
   * Available Elements consist of:
   * 1. Active Starter Elements in active Categories.
   * 2. Active non-Starter Elements in active Categories unlocked by the user.
   *
   * Ordered by:
   * 1. category.sortOrder ASC
   * 2. isStarter DESC
   * 3. name ASC
   *
   * Zero DB writes performed.
   */
  async getAvailableElements(
    userId: string,
  ): Promise<AvailableElementResponse[]> {
    // 1. Verify User account and active status
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

    // 2. Query available elements
    const elements = await this.prisma.element.findMany({
      where: {
        status: ContentStatus.ACTIVE,
        category: {
          status: ActiveStatus.ACTIVE,
        },
        OR: [
          { isStarter: true },
          {
            isStarter: false,
            userElements: {
              some: { userId },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        emoji: true,
        iconUrl: true,
        elementType: true,
        isStarter: true,
        category: {
          select: {
            id: true,
            name: true,
            sortOrder: true,
          },
        },
      },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { isStarter: 'desc' },
        { name: 'asc' },
      ],
    });

    return elements;
  }
}
