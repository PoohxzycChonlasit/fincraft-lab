import { ApiProperty } from '@nestjs/swagger';
import type {
  ElementGuidanceResponse,
  ElementLearningDetail,
  SuggestedPartnerSummary,
} from '../types/element-guidance-response.type';

export class SuggestedPartnerSummaryDto implements SuggestedPartnerSummary {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  emoji!: string;

  @ApiProperty({ nullable: true })
  iconUrl!: string | null;

  @ApiProperty()
  elementType!: string;

  @ApiProperty()
  categoryName!: string;
}

export class ElementLearningDetailDto implements ElementLearningDetail {
  @ApiProperty()
  shortDescription!: string;

  @ApiProperty()
  realLesson!: string;

  @ApiProperty({ required: false })
  example?: string;

  @ApiProperty({ required: false })
  possibleBenefit?: string;

  @ApiProperty({ required: false })
  possibleTradeoff?: string;

  @ApiProperty({ required: false })
  hiddenRisk?: string;

  @ApiProperty({ required: false })
  worksWhen?: string;

  @ApiProperty({ required: false })
  becomesDifficultWhen?: string;

  @ApiProperty({ required: false })
  whatChangesOutcome?: string;

  @ApiProperty({ required: false, type: 'array' })
  sources?: Array<Record<string, unknown>>;
}

export class ElementGuidanceDetailDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  emoji!: string;

  @ApiProperty({ nullable: true })
  iconUrl!: string | null;

  @ApiProperty()
  elementType!: string;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  })
  category!: {
    id: string;
    name: string;
  };

  @ApiProperty()
  description!: string;
}

export class ElementGuidanceEnvelopeDto {
  @ApiProperty({
    type: 'object',
    properties: {
      element: { type: ElementGuidanceDetailDto },
      learningDetail: { type: ElementLearningDetailDto, required: false },
      suggestedPartners: { type: [SuggestedPartnerSummaryDto] },
    },
  })
  data!: ElementGuidanceResponse;
}
