import { ApiProperty } from '@nestjs/swagger';
import {
  ContentStatus,
  CraftRuleType,
} from '../../database/generated/prisma/client';

export class AdminElementRefDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id!: string;

  @ApiProperty({ example: 'essential-cash' })
  slug!: string;

  @ApiProperty({ example: 'Cash' })
  name!: string;

  @ApiProperty({
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    nullable: true,
  })
  categoryId!: string | null;

  @ApiProperty({ example: 'ACTIVE' })
  status!: string;
}

export class AdminRecipeInputResponseDto {
  @ApiProperty({ example: 'd4e5f6a7-b890-1234-cdef-567890123456' })
  id!: string;

  @ApiProperty({ example: 'e5f6a7b8-9012-3456-cdef-789012345678' })
  recipeId!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  elementId!: string;

  @ApiProperty({ example: 0 })
  inputOrder!: number;

  @ApiProperty({ example: '2026-07-30T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ type: AdminElementRefDto })
  element!: AdminElementRefDto;
}

export class AdminRecipeResponseDto {
  @ApiProperty({ example: 'e5f6a7b8-9012-3456-cdef-789012345678' })
  id!: string;

  @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  outputElementId!: string;

  @ApiProperty({ enum: CraftRuleType, example: CraftRuleType.COMMUTATIVE })
  ruleType!: CraftRuleType;

  @ApiProperty({ enum: ContentStatus, example: ContentStatus.ACTIVE })
  status!: ContentStatus;

  @ApiProperty({ example: '2026-07-30T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-30T12:00:00.000Z' })
  updatedAt!: string;

  @ApiProperty({ type: AdminElementRefDto })
  outputElement!: AdminElementRefDto;

  @ApiProperty({ type: [AdminRecipeInputResponseDto] })
  inputs!: AdminRecipeInputResponseDto[];
}

export class AdminRecipeListEnvelopeDto {
  @ApiProperty({ type: [AdminRecipeResponseDto] })
  data!: AdminRecipeResponseDto[];
}

export class AdminRecipeDetailEnvelopeDto {
  @ApiProperty({ type: AdminRecipeResponseDto })
  data!: AdminRecipeResponseDto;
}
