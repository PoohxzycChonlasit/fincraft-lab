import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ContentStatus } from '../../database/generated/prisma/client';
import { IsHttpsUrl } from '../validators/is-https-url.validator';

export class UpdateElementDto {
  @ApiPropertyOptional({
    example: 'Earned Income & Wages',
    description: 'Updated display name (1 to 100 characters)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Updated UUID v4 of ElementCategory',
  })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiPropertyOptional({
    example: '💰',
    description: 'Updated Emoji icon (1 to 10 characters)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(10)
  emoji?: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.ACTIVE,
    description: 'Updated content activation status',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({
    example: 'https://example.com/icons/income-v2.png',
    description: 'Updated HTTPS icon URL or null to clear',
    nullable: true,
  })
  @IsOptional()
  @IsHttpsUrl()
  iconUrl?: string | null;
}
