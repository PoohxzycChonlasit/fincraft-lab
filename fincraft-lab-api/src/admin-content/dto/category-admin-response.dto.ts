import { ApiProperty } from '@nestjs/swagger';
import { ActiveStatus } from '../../database/generated/prisma/client';

export class AdminCategoryResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Category UUID v4',
  })
  id!: string;

  @ApiProperty({
    example: 'Budgeting & Saving',
    description: 'Category unique name',
  })
  name!: string;

  @ApiProperty({
    example: 'Concepts related to personal cash flow management.',
    nullable: true,
    description: 'Optional category description',
  })
  description!: string | null;

  @ApiProperty({
    example: 10,
    description: 'Display order priority',
  })
  sortOrder!: number;

  @ApiProperty({
    enum: ActiveStatus,
    example: ActiveStatus.ACTIVE,
    description: 'Category availability status',
  })
  status!: ActiveStatus;

  @ApiProperty({
    example: 5,
    description: 'Count of associated elements',
  })
  elementCount!: number;

  @ApiProperty({
    example: '2026-07-30T12:00:00.000Z',
    description: 'ISO-8601 creation timestamp',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-07-30T12:00:00.000Z',
    description: 'ISO-8601 update timestamp',
  })
  updatedAt!: string;
}

export class AdminCategoryListEnvelopeDto {
  @ApiProperty({
    type: [AdminCategoryResponseDto],
    description: 'List of admin categories',
  })
  data!: AdminCategoryResponseDto[];
}

export class AdminCategoryDetailEnvelopeDto {
  @ApiProperty({
    type: AdminCategoryResponseDto,
    description: 'Admin category details',
  })
  data!: AdminCategoryResponseDto;
}
