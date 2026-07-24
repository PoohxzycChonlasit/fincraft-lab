import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class WorkspaceNodeInputDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Unique node instance UUID v4 within workspace canvas',
  })
  @IsUUID('4')
  id!: string;

  @ApiProperty({
    example: 'e1f2a3b4-c5d6-7890-ef12-34567890abcd',
    description: 'Associated element UUID v4',
  })
  @IsUUID('4')
  elementId!: string;

  @ApiProperty({
    example: 100.5,
    description: 'Finite X coordinate on canvas plane',
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  positionX!: number;

  @ApiProperty({
    example: 250.0,
    description: 'Finite Y coordinate on canvas plane',
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  positionY!: number;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    example: { amount: 15000, currency: 'THB' },
    description:
      'Plain object payload for custom node instance parameters (max 4096 serialized UTF-8 bytes, null/array/primitive rejected)',
  })
  @IsOptional()
  valueData?: Record<string, unknown>;
}
