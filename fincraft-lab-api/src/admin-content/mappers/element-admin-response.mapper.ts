import {
  DiscoveryDetail,
  Element,
  ElementCategory,
} from '../../database/generated/prisma/client';
import {
  AdminDiscoveryDetailDto,
  AdminElementDetailDto,
  AdminElementSummaryDto,
} from '../dto/element-admin-response.dto';
import { DiscoveryDetailSourceDto } from '../dto/upsert-discovery-detail.dto';

export type ElementWithRelations = Element & {
  category: ElementCategory;
  discoveryDetail?: DiscoveryDetail | null;
};

export class ElementAdminResponseMapper {
  static toSummaryDto(element: ElementWithRelations): AdminElementSummaryDto {
    return {
      id: element.id,
      categoryId: element.categoryId,
      categoryName: element.category.name,
      name: element.name,
      slug: element.slug,
      iconUrl: element.iconUrl,
      emoji: element.emoji,
      elementType: element.elementType,
      isStarter: element.isStarter,
      status: element.status,
      hasDiscoveryDetail: Boolean(element.discoveryDetail),
      createdAt: element.createdAt.toISOString(),
      updatedAt: element.updatedAt.toISOString(),
    };
  }

  static toDetailDto(element: ElementWithRelations): AdminElementDetailDto {
    const summary = this.toSummaryDto(element);

    let discoveryDetailDto: AdminDiscoveryDetailDto | null = null;
    if (element.discoveryDetail) {
      const detail = element.discoveryDetail;
      discoveryDetailDto = {
        id: detail.id,
        elementId: detail.elementId,
        shortDescription: detail.shortDescription,
        realLesson: detail.realLesson,
        example: detail.example,
        possibleBenefit: detail.possibleBenefit,
        possibleTradeoff: detail.possibleTradeoff,
        hiddenRisk: detail.hiddenRisk,
        worksWhen: detail.worksWhen,
        becomesDifficultWhen: detail.becomesDifficultWhen,
        whatChangesOutcome: detail.whatChangesOutcome,
        realityLevel: detail.realityLevel,
        safetyLabel: detail.safetyLabel,
        sources:
          (detail.sources as unknown as DiscoveryDetailSourceDto[]) || [],
        createdAt: detail.createdAt.toISOString(),
        updatedAt: detail.updatedAt.toISOString(),
      };
    }

    return {
      ...summary,
      discoveryDetail: discoveryDetailDto,
    };
  }
}
