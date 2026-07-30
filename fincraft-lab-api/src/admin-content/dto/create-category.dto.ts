import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ActiveStatus } from '../../database/generated/prisma/client';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Budgeting & Saving',
    description: 'Unique category name (2 to 100 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;

  @ApiPropertyOptional({
    example: 'Concepts related to personal cash flow management and savings.',
    description: 'Optional category description (max 500 characters)',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Display order priority (integer >= 0)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    enum: ActiveStatus,
    example: ActiveStatus.ACTIVE,
    description: 'Initial availability status',
  })
  @IsOptional()
  @IsEnum(ActiveStatus)
  status?: ActiveStatus;
}
