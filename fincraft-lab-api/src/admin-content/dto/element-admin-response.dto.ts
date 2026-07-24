import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContentStatus,
  ElementType,
  RealityLevel,
  SafetyLabel,
} from '../../database/generated/prisma/client';
import { DiscoveryDetailSourceDto } from './upsert-discovery-detail.dto';

export class AdminDiscoveryDetailDto {
  @ApiProperty({
    example: 'd1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'DiscoveryDetail UUID v4',
  })
  id!: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Parent Element UUID v4',
  })
  elementId!: string;

  @ApiProperty({
    example: 'Regular inflows of money earned through labor...',
    description: 'Short summary description',
  })
  shortDescription!: string;

  @ApiProperty({
    example: 'Earned income forms the top-line foundation...',
    description: 'Core educational concept lesson',
  })
  realLesson!: string;

  @ApiPropertyOptional({
    example: 'A salaried worker receives THB 30,000 monthly...',
    nullable: true,
    description: 'Practical scenario example or null',
  })
  example!: string | null;

  @ApiPropertyOptional({
    example: 'Provides predictable cash inflows...',
    nullable: true,
    description: 'Possible financial benefit or null',
  })
  possibleBenefit!: string | null;

  @ApiPropertyOptional({
    example: 'Requires ongoing commitment of time...',
    nullable: true,
    description: 'Possible tradeoff or null',
  })
  possibleTradeoff!: string | null;

  @ApiPropertyOptional({
    example: 'Over-relying on a single income stream...',
    nullable: true,
    description: 'Hidden risk explanation or null',
  })
  hiddenRisk!: string | null;

  @ApiPropertyOptional({
    example: 'Employment conditions are stable...',
    nullable: true,
    description: 'When this financial concept works or null',
  })
  worksWhen!: string | null;

  @ApiPropertyOptional({
    example: 'Macroeconomic recessions occur...',
    nullable: true,
    description: 'When this becomes difficult or null',
  })
  becomesDifficultWhen!: string | null;

  @ApiPropertyOptional({
    example: 'Market demand for skills...',
    nullable: true,
    description: 'Factors that change outcomes or null',
  })
  whatChangesOutcome!: string | null;

  @ApiProperty({
    enum: RealityLevel,
    example: RealityLevel.GROUNDED,
    description: 'Model reality grounding level',
  })
  realityLevel!: RealityLevel;

  @ApiProperty({
    enum: SafetyLabel,
    example: SafetyLabel.EDUCATION_ONLY,
    description: 'Educational safety disclaimer label',
  })
  safetyLabel!: SafetyLabel;

  @ApiProperty({
    type: [DiscoveryDetailSourceDto],
    description: 'Array of authoritative source citations',
  })
  sources!: DiscoveryDetailSourceDto[];

  @ApiProperty({
    example: '2026-07-24T12:00:00.000Z',
    description: 'ISO-8601 creation timestamp',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-07-24T12:00:00.000Z',
    description: 'ISO-8601 update timestamp',
  })
  updatedAt!: string;
}

export class AdminElementSummaryDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Element UUID v4',
  })
  id!: string;

  @ApiProperty({
    example: 'c1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Category UUID v4',
  })
  categoryId!: string;

  @ApiProperty({
    example: 'Money Flow',
    description: 'Category display name',
  })
  categoryName!: string;

  @ApiProperty({
    example: 'Earned Income',
    description: 'Element display name',
  })
  name!: string;

  @ApiProperty({
    example: 'income',
    description: 'Unique URL slug',
  })
  slug!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icons/income.png',
    nullable: true,
    description: 'HTTPS icon URL or null',
  })
  iconUrl!: string | null;

  @ApiProperty({
    example: '💵',
    description: 'Emoji icon',
  })
  emoji!: string;

  @ApiProperty({
    enum: ElementType,
    example: ElementType.BASE,
    description: 'Element classification type',
  })
  elementType!: ElementType;

  @ApiProperty({
    example: true,
    description: 'Whether this element is a starter element',
  })
  isStarter!: boolean;

  @ApiProperty({
    enum: ContentStatus,
    example: ContentStatus.ACTIVE,
    description: 'Content activation status',
  })
  status!: ContentStatus;

  @ApiProperty({
    example: true,
    description: 'Whether educational DiscoveryDetail is attached',
  })
  hasDiscoveryDetail!: boolean;

  @ApiProperty({
    example: '2026-07-24T12:00:00.000Z',
    description: 'ISO-8601 creation timestamp',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-07-24T12:00:00.000Z',
    description: 'ISO-8601 update timestamp',
  })
  updatedAt!: string;
}

export class AdminElementDetailDto extends AdminElementSummaryDto {
  @ApiPropertyOptional({
    type: AdminDiscoveryDetailDto,
    nullable: true,
    description: 'Complete DiscoveryDetail object or null',
  })
  discoveryDetail!: AdminDiscoveryDetailDto | null;
}

export class AdminElementListEnvelopeDto {
  @ApiProperty({
    type: [AdminElementSummaryDto],
    description: 'Array of Admin Element summary records',
  })
  data!: AdminElementSummaryDto[];
}

export class AdminElementDetailEnvelopeDto {
  @ApiProperty({
    type: AdminElementDetailDto,
    description: 'Admin Element detail record',
  })
  data!: AdminElementDetailDto;
}
