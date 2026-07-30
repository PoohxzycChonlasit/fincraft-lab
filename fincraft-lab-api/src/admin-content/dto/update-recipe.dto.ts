import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import {
  ContentStatus,
  CraftRuleType,
} from '../../database/generated/prisma/client';

export class UpdateRecipeDto {
  @ApiPropertyOptional({
    example: [
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    ],
    description:
      'Optional replacement array of exactly two distinct input Element UUID v4 values',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsUUID(4, { each: true })
  inputElementIds?: [string, string];

  @ApiPropertyOptional({
    example: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    description: 'Optional output produced Element UUID v4 value',
  })
  @IsOptional()
  @IsUUID(4)
  outputElementId?: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.ACTIVE,
    description: 'Optional recipe availability status',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({
    enum: CraftRuleType,
    example: CraftRuleType.COMMUTATIVE,
    description: 'Optional crafting rule type',
  })
  @IsOptional()
  @IsEnum(CraftRuleType)
  ruleType?: CraftRuleType;
}
