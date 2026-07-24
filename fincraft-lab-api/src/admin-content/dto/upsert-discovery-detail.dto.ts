import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  RealityLevel,
  SafetyLabel,
} from '../../database/generated/prisma/client';
import { IsHttpsUrl } from '../validators/is-https-url.validator';

export class DiscoveryDetailSourceDto {
  @ApiProperty({
    example: 'Bank of Thailand Financial Literacy',
    description: 'Source title (1 to 200 characters)',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example: 'Bank of Thailand',
    description: 'Publishing organization (1 to 200 characters)',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(200)
  organization!: string;

  @ApiProperty({
    example: 'https://www.bot.or.th/financial-literacy',
    description: 'Absolute HTTPS source reference URL (max 2048 characters)',
  })
  @IsDefined()
  @IsHttpsUrl()
  url!: string;
}

export class UpsertDiscoveryDetailDto {
  @ApiProperty({
    example: 'Regular inflows of money earned through labor...',
    description: 'Short summary description (1 to 500 characters)',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(500)
  shortDescription!: string;

  @ApiProperty({
    example: 'Earned income forms the top-line foundation of cash flow...',
    description: 'Core educational concept lesson (1 to 2000 characters)',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(2000)
  realLesson!: string;

  @ApiPropertyOptional({
    example: 'A salaried worker receives THB 30,000 monthly net...',
    description: 'Practical scenario example (max 2000 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(2000)
  example?: string | null;

  @ApiPropertyOptional({
    example: 'Provides predictable cash inflows to cover basic sustenance...',
    description: 'Possible financial benefit (max 2000 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(2000)
  possibleBenefit?: string | null;

  @ApiPropertyOptional({
    example: 'Requires ongoing commitment of time and energy...',
    description: 'Possible tradeoff (max 2000 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(2000)
  possibleTradeoff?: string | null;

  @ApiPropertyOptional({
    example:
      'Over-relying on a single income stream creates high vulnerability...',
    description: 'Hidden risk explanation (max 2000 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(2000)
  hiddenRisk?: string | null;

  @ApiPropertyOptional({
    example: 'Employment conditions are stable and skills remain in demand...',
    description:
      'When this financial concept works (max 2000 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(2000)
  worksWhen?: string | null;

  @ApiPropertyOptional({
    example: 'Macroeconomic recessions occur or skills become obsolete...',
    description: 'When this becomes difficult (max 2000 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(2000)
  becomesDifficultWhen?: string | null;

  @ApiPropertyOptional({
    example: 'Market demand for skills and continuous skill development...',
    description: 'Factors that change outcomes (max 2000 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(2000)
  whatChangesOutcome?: string | null;

  @ApiProperty({
    enum: RealityLevel,
    example: RealityLevel.GROUNDED,
    description: 'Model reality grounding level',
  })
  @IsDefined()
  @IsEnum(RealityLevel)
  realityLevel!: RealityLevel;

  @ApiProperty({
    enum: SafetyLabel,
    example: SafetyLabel.EDUCATION_ONLY,
    description: 'Educational safety disclaimer label',
  })
  @IsDefined()
  @IsEnum(SafetyLabel)
  safetyLabel!: SafetyLabel;

  @ApiProperty({
    type: [DiscoveryDetailSourceDto],
    description: 'Array of authoritative source citations (1 to 10 items)',
  })
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => DiscoveryDetailSourceDto)
  sources!: DiscoveryDetailSourceDto[];
}
