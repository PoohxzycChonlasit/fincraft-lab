import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ActiveStatus,
  ContentStatus,
  UserStatus,
} from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { AvailableElementResponse } from './types/available-element-response.type';
import type {
  ElementGuidanceResponse,
  SuggestedPartnerSummary,
} from './types/element-guidance-response.type';

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

  async getAvailableElements(
    userId: string,
  ): Promise<AvailableElementResponse[]> {
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

    return this.prisma.element.findMany({
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
  }

  async getElementGuidance(
    elementId: string,
  ): Promise<ElementGuidanceResponse> {
    const element = await this.prisma.element.findFirst({
      where: {
        id: elementId,
        status: ContentStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        emoji: true,
        iconUrl: true,
        elementType: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        discoveryDetail: {
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
            sources: true,
          },
        },
      },
    });

    if (!element) {
      throw new NotFoundException('Element not found');
    }

    // Find active recipes where this element is an input
    const recipeInputs = await this.prisma.craftRecipeInput.findMany({
      where: {
        elementId: elementId,
        recipe: {
          status: ContentStatus.ACTIVE,
        },
      },
      select: {
        recipeId: true,
      },
    });

    const recipeIds = recipeInputs.map((ri) => ri.recipeId);

    // Find other input elements in those same recipes (excluding source elementId)
    const partnerInputs = await this.prisma.craftRecipeInput.findMany({
      where: {
        recipeId: { in: recipeIds },
        elementId: { not: elementId },
        element: {
          status: ContentStatus.ACTIVE,
          isStarter: true,
          category: { status: ActiveStatus.ACTIVE },
        },
      },
      select: {
        element: {
          select: {
            id: true,
            name: true,
            slug: true,
            emoji: true,
            iconUrl: true,
            elementType: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        element: { name: 'asc' },
      },
    });

    // Deduplicate partners
    const partnerMap = new Map<string, SuggestedPartnerSummary>();
    for (const item of partnerInputs) {
      const p = item.element;
      if (!partnerMap.has(p.id)) {
        partnerMap.set(p.id, {
          id: p.id,
          name: p.name,
          slug: p.slug,
          emoji: p.emoji,
          iconUrl: p.iconUrl,
          elementType: p.elementType,
          categoryName: p.category.name,
        });
      }
    }

    const suggestedPartners = Array.from(partnerMap.values()).slice(0, 4);
    const detail = element.discoveryDetail;
    const learningDetail = detail
      ? {
          shortDescription: detail.shortDescription,
          realLesson: detail.realLesson,
          ...(detail.example ? { example: detail.example } : {}),
          ...(detail.possibleBenefit
            ? { possibleBenefit: detail.possibleBenefit }
            : {}),
          ...(detail.possibleTradeoff
            ? { possibleTradeoff: detail.possibleTradeoff }
            : {}),
          ...(detail.hiddenRisk ? { hiddenRisk: detail.hiddenRisk } : {}),
          ...(detail.worksWhen ? { worksWhen: detail.worksWhen } : {}),
          ...(detail.becomesDifficultWhen
            ? { becomesDifficultWhen: detail.becomesDifficultWhen }
            : {}),
          ...(detail.whatChangesOutcome
            ? { whatChangesOutcome: detail.whatChangesOutcome }
            : {}),
          ...(Array.isArray(detail.sources)
            ? { sources: detail.sources as Array<Record<string, unknown>> }
            : {}),
        }
      : undefined;

    return {
      element: {
        id: element.id,
        name: element.name,
        slug: element.slug,
        emoji: element.emoji,
        iconUrl: element.iconUrl,
        elementType: element.elementType,
        category: element.category,
        description:
          element.discoveryDetail?.shortDescription ||
          `Financial element: ${element.name}. Combine with other elements on the canvas to discover financial concepts.`,
      },
      learningDetail,
      suggestedPartners,
    };
  }
}
