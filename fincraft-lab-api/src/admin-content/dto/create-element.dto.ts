import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ContentStatus,
  ElementType,
} from '../../database/generated/prisma/client';
import { IsHttpsUrl } from '../validators/is-https-url.validator';

export class CreateElementDto {
  @ApiProperty({
    example: 'Earned Income',
    description: 'Element display name (1 to 100 characters)',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'earned-income',
    description:
      'Unique URL slug (1 to 100 lowercase kebab-case characters, immutable after create)',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @MinLength(1)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug must contain only lowercase alphanumeric characters and single hyphens without leading or trailing hyphens',
  })
  slug!: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'UUID v4 of valid ElementCategory',
  })
  @IsDefined()
  @IsUUID('4')
  categoryId!: string;

  @ApiProperty({
    example: '💵',
    description: 'Emoji icon (1 to 10 characters)',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(10)
  emoji!: string;

  @ApiProperty({
    enum: ElementType,
    example: ElementType.BASE,
    description: 'Element classification type (immutable after create)',
  })
  @IsDefined()
  @IsEnum(ElementType)
  elementType!: ElementType;

  @ApiPropertyOptional({
    example: false,
    description:
      'Whether this element is a starter element (immutable after create)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isStarter?: boolean;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PENDING,
    description: 'Initial content status',
    default: ContentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({
    example: 'https://example.com/icons/income.png',
    description: 'HTTPS icon URL (max 2048 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsHttpsUrl()
  iconUrl?: string | null;
}
