import { ApiProperty } from '@nestjs/swagger';
import type {
  ElementGuidanceResponse,
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
      suggestedPartners: { type: [SuggestedPartnerSummaryDto] },
    },
  })
  data!: ElementGuidanceResponse;
}
