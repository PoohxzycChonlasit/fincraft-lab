import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ElementType,
  RealityLevel,
  SafetyLabel,
} from '../../database/generated/prisma/client';

export class CraftSourceDto {
  @ApiProperty({
    example: 'Stock Exchange of Thailand',
    description: 'Source title',
  })
  title!: string;

  @ApiProperty({ example: 'SET', description: 'Organization name' })
  organization!: string;

  @ApiProperty({
    example: 'https://www.setinvestnow.com',
    description: 'Reference URL',
  })
  url!: string;
}

export class CraftElementDto {
  @ApiProperty({
    example: 'ec01e7f9-d265-404c-aa33-863533437595',
    description: 'Discovered element UUID v4',
  })
  id!: string;

  @ApiProperty({
    example: 'Fixed Baseline Expenses',
    description: 'Element display name',
  })
  name!: string;

  @ApiProperty({ example: 'essential-baseline', description: 'Element slug' })
  slug!: string;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
    description: 'Icon URL',
  })
  iconUrl!: string | null;

  @ApiProperty({ example: '⚓', description: 'Display emoji' })
  emoji!: string;

  @ApiProperty({
    enum: ElementType,
    example: ElementType.CONCEPT,
    description: 'Element type',
  })
  elementType!: ElementType;

  @ApiProperty({ example: false, description: 'Whether starter element' })
  isStarter!: boolean;
}

export class CraftDiscoveryDetailDto {
  @ApiProperty({
    example: 'The non-negotiable fixed minimum monthly outlay...',
    description: 'Short description',
  })
  shortDescription!: string;

  @ApiProperty({
    example: 'Establishing a clear fixed baseline expense figure...',
    description: 'Real lesson',
  })
  realLesson!: string;

  @ApiPropertyOptional({
    example: 'A household calculates fixed baseline expenses...',
    nullable: true,
  })
  example!: string | null;

  @ApiPropertyOptional({
    example: 'Provides an accurate baseline for budgeting...',
    nullable: true,
  })
  possibleBenefit!: string | null;

  @ApiPropertyOptional({
    example: 'Focuses tightly on mandatory baseline outlays...',
    nullable: true,
  })
  possibleTradeoff!: string | null;

  @ApiPropertyOptional({
    example: 'Underestimating baseline expenses...',
    nullable: true,
  })
  hiddenRisk!: string | null;

  @ApiPropertyOptional({
    example: 'Fixed housing, utility, food tracked monthly...',
    nullable: true,
  })
  worksWhen!: string | null;

  @ApiPropertyOptional({ example: 'Utility tariffs rise...', nullable: true })
  becomesDifficultWhen!: string | null;

  @ApiPropertyOptional({
    example: 'Household size, housing location...',
    nullable: true,
  })
  whatChangesOutcome!: string | null;

  @ApiProperty({
    enum: RealityLevel,
    example: RealityLevel.GROUNDED,
    description: 'Reality level',
  })
  realityLevel!: RealityLevel;

  @ApiProperty({
    enum: SafetyLabel,
    example: SafetyLabel.EDUCATION_ONLY,
    description: 'Safety label',
  })
  safetyLabel!: SafetyLabel;

  @ApiProperty({ type: [CraftSourceDto], description: 'Reference sources' })
  sources!: CraftSourceDto[];
}

export class CraftDiscoveryResultDto {
  @ApiProperty({
    example: 'DISCOVERY',
    description: 'Craft result outcome type',
  })
  outcome!: 'DISCOVERY';

  @ApiProperty({
    example: true,
    description: 'True if first time unlocked by user, false if rediscovered',
  })
  isNewDiscovery!: boolean;

  @ApiProperty({ type: CraftElementDto })
  element!: CraftElementDto;

  @ApiProperty({ type: CraftDiscoveryDetailDto })
  detail!: CraftDiscoveryDetailDto;
}

export class CraftNoRecipeResultDto {
  @ApiProperty({
    example: 'NO_RECIPE',
    description: 'Craft result outcome type when inputs form no active recipe',
  })
  outcome!: 'NO_RECIPE';
}

export class CraftResultEnvelopeDto {
  @ApiProperty({
    description: 'Crafting output result (either DISCOVERY or NO_RECIPE)',
    oneOf: [
      { $ref: '#/components/schemas/CraftDiscoveryResultDto' },
      { $ref: '#/components/schemas/CraftNoRecipeResultDto' },
    ],
  })
  data!: CraftDiscoveryResultDto | CraftNoRecipeResultDto;
}
