import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ActiveStatus } from '../../database/generated/prisma/client';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Advanced Budgeting',
    description: 'Updated category name (2 to 100 characters)',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated description for budgeting concepts.',
    description: 'Updated category description (max 500 characters)',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'Updated display order priority (integer >= 0)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    enum: ActiveStatus,
    example: ActiveStatus.INACTIVE,
    description: 'Updated availability status',
  })
  @IsOptional()
  @IsEnum(ActiveStatus)
  status?: ActiveStatus;
}
