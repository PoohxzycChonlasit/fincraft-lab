import { ApiProperty } from '@nestjs/swagger';
import type {
  SimulationInputDefinition,
  SimulationSourceMetadata,
} from '../constants/survival-months.definition';

export class SimulationSummaryResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Simulation UUID v4',
  })
  id!: string;

  @ApiProperty({
    example: 'survival-months',
    description: 'Public simulation slug identifier',
  })
  slug!: string;

  @ApiProperty({
    example: 'Survival Months',
    description: 'English simulation name',
  })
  name!: string;

  @ApiProperty({
    example: 'จำนวนเดือนที่เงินสำรองรองรับค่าใช้จ่าย',
    description: 'Thai simulation name',
  })
  thaiName!: string;

  @ApiProperty({
    example:
      'Estimates how many months an emergency fund covers essential expenses during job loss.',
    description: 'Short educational summary',
  })
  summary!: string;

  @ApiProperty({
    example: true,
    description: 'Active availability status',
  })
  isActive!: boolean;
}

export class SimulationInputDefinitionDto implements SimulationInputDefinition {
  @ApiProperty({ example: 'emergencyFund', description: 'Input field key' })
  field!: string;

  @ApiProperty({ example: 'Emergency Fund', description: 'English label' })
  labelEn!: string;

  @ApiProperty({ example: 'เงินสำรองฉุกเฉิน', description: 'Thai label' })
  labelTh!: string;

  @ApiProperty({
    example: 'Total liquid cash reserved for emergencies.',
    description: 'Educational description',
  })
  description!: string;
}

export class SimulationSourceMetadataDto implements SimulationSourceMetadata {
  @ApiProperty({
    example: 'An Essential Guide to Building an Emergency Fund',
    description: 'Source publication title',
  })
  title!: string;

  @ApiProperty({
    example: 'Consumer Financial Protection Bureau (CFPB)',
    description: 'Publishing organization',
  })
  publisher!: string;

  @ApiProperty({
    example:
      'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',
    description: 'Authoritative canonical URL',
  })
  url!: string;

  @ApiProperty({
    example: '2026-07-24',
    description: 'Source access date (YYYY-MM-DD)',
  })
  accessedAt!: string;
}

export class SimulationDetailResponseDto extends SimulationSummaryResponseDto {
  @ApiProperty({
    example:
      'Calculates runway in months by dividing total emergency savings by essential monthly living costs.',
    description: 'Full plain-text educational description',
  })
  description!: string;

  @ApiProperty({
    type: [SimulationInputDefinitionDto],
    description: 'Definitions for expected simulation inputs',
  })
  inputDefinitions!: SimulationInputDefinitionDto[];

  @ApiProperty({
    example: 'survivalMonths = emergencyFund / essentialMonthlyExpenses',
    description: 'Formula explanation',
  })
  formulaExplanation!: string;

  @ApiProperty({
    type: [String],
    example: ['Essential monthly expenses remain constant.'],
    description: 'Explicit neutral assumptions',
  })
  assumptions!: string[];

  @ApiProperty({
    type: [String],
    example: ['Actual monthly expenses may fluctuate.'],
    description: 'Explicit neutral limitations',
  })
  limitations!: string[];

  @ApiProperty({
    type: [SimulationSourceMetadataDto],
    description: 'Authoritative educational sources',
  })
  sources!: SimulationSourceMetadataDto[];

  @ApiProperty({
    example: 'Education and simulation only. Not financial advice.',
    description: 'Mandatory safety disclaimer',
  })
  disclaimer!: string;

  @ApiProperty({
    example: 'survival-months-v1',
    description: 'Calculation version tag',
  })
  calculationVersion!: string;
}

export class SurvivalMonthsInputSnapshotDto {
  @ApiProperty({ example: '25000.00', description: 'Emergency fund amount' })
  emergencyFund!: string;

  @ApiProperty({
    example: '10000.00',
    description: 'Essential monthly expenses',
  })
  essentialMonthlyExpenses!: string;
}

export class SurvivalMonthsResultDto {
  @ApiProperty({ example: '2.50', description: 'Survival months' })
  survivalMonths!: string;

  @ApiProperty({ example: 2, description: 'Whole months covered' })
  wholeMonthsCovered!: number;

  @ApiProperty({ example: '5000.00', description: 'Remaining amount' })
  remainingAmount!: string;

  @ApiProperty({
    example:
      'Under the entered values and stated assumptions, the emergency fund covers approximately 2.50 months of essential monthly expenses.',
    description: 'Neutral English statement',
  })
  statementEn!: string;

  @ApiProperty({
    example:
      'ภายใต้ตัวเลขและสมมติฐานที่กรอก เงินสำรองรองรับค่าใช้จ่ายจำเป็นได้ประมาณ 2.50 เดือน',
    description: 'Neutral Thai statement',
  })
  statementTh!: string;
}

export class SimulationIdentityDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Simulation UUID v4',
  })
  id!: string;

  @ApiProperty({
    example: 'survival-months',
    description: 'Public simulation slug',
  })
  slug!: string;

  @ApiProperty({
    example: 'Survival Months',
    description: 'English simulation name',
  })
  name!: string;
}

export class SimulationRunResponseDto {
  @ApiProperty({
    example: 'c3d4e5f6-a7b8-9012-cdef-34567890abcd',
    description: 'Run instance UUID v4',
  })
  runId!: string;

  @ApiProperty({
    type: SimulationIdentityDto,
    description: 'Associated simulation identity',
  })
  simulation!: SimulationIdentityDto;

  @ApiProperty({
    type: SurvivalMonthsInputSnapshotDto,
    description: 'Normalized input snapshot',
  })
  input!: SurvivalMonthsInputSnapshotDto;

  @ApiProperty({
    type: SurvivalMonthsResultDto,
    description: 'Calculated simulation result',
  })
  result!: SurvivalMonthsResultDto;

  @ApiProperty({
    type: [String],
    description: 'Historical snapshot assumptions',
  })
  assumptions!: string[];

  @ApiProperty({
    type: [String],
    description: 'Historical snapshot limitations',
  })
  limitations!: string[];

  @ApiProperty({
    type: [SimulationSourceMetadataDto],
    description: 'Historical snapshot source metadata',
  })
  sources!: SimulationSourceMetadataDto[];

  @ApiProperty({
    example: 'Education and simulation only. Not financial advice.',
    description: 'Historical snapshot disclaimer',
  })
  disclaimer!: string;

  @ApiProperty({
    example: 'survival-months-v1',
    description: 'Calculation version tag',
  })
  calculationVersion!: string;

  @ApiProperty({
    example: '2026-07-24T11:15:00.000Z',
    description: 'ISO-8601 creation timestamp',
  })
  createdAt!: string;
}

export class SimulationsEnvelopeDto {
  @ApiProperty({
    type: [SimulationSummaryResponseDto],
    description: 'List of supported active simulations',
  })
  data!: SimulationSummaryResponseDto[];
}

export class SimulationDetailEnvelopeDto {
  @ApiProperty({
    type: SimulationDetailResponseDto,
    description: 'Detailed simulation metadata',
  })
  data!: SimulationDetailResponseDto;
}

export class SimulationRunEnvelopeDto {
  @ApiProperty({
    type: SimulationRunResponseDto,
    description: 'Created simulation run snapshot',
  })
  data!: SimulationRunResponseDto;
}
