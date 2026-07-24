import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ElementType } from '../../database/generated/prisma/client';

export class AvailableElementCategoryDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Category UUID v4',
  })
  id!: string;

  @ApiProperty({ example: 'Foundations', description: 'Category display name' })
  name!: string;

  @ApiProperty({ example: 1, description: 'Category display sort order' })
  sortOrder!: number;
}

export class AvailableElementResponseDto {
  @ApiProperty({
    example: 'e1f2a3b4-c5d6-7890-ef12-34567890abcd',
    description: 'Element UUID v4',
  })
  id!: string;

  @ApiProperty({ example: 'Income', description: 'Element display name' })
  name!: string;

  @ApiProperty({ example: 'income', description: 'Element slug' })
  slug!: string;

  @ApiProperty({ example: '💵', description: 'Element display emoji' })
  emoji!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon.png',
    nullable: true,
    description: 'Element icon URL',
  })
  iconUrl!: string | null;

  @ApiProperty({
    enum: ElementType,
    example: ElementType.CONCEPT,
    description: 'Element type classification',
  })
  elementType!: ElementType;

  @ApiProperty({
    example: true,
    description: 'Whether element is a starter element available to all users',
  })
  isStarter!: boolean;

  @ApiProperty({
    type: AvailableElementCategoryDto,
    description: 'Associated active category',
  })
  category!: AvailableElementCategoryDto;
}

export class AvailableElementsEnvelopeDto {
  @ApiProperty({ type: [AvailableElementResponseDto] })
  data!: AvailableElementResponseDto[];
}
