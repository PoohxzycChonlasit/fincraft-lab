import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ElementType } from '../../database/generated/prisma/client';

export class CanvasNodeElementDto {
  @ApiProperty({ example: 'e1f2a3b4-c5d6-7890-ef12-34567890abcd', description: 'Element UUID v4' })
  id!: string;

  @ApiProperty({ example: 'Income', description: 'Element display name' })
  name!: string;

  @ApiProperty({ example: 'income', description: 'Element slug' })
  slug!: string;

  @ApiProperty({ example: '💵', description: 'Element display emoji' })
  emoji!: string;

  @ApiPropertyOptional({ example: null, nullable: true, description: 'Icon URL' })
  iconUrl!: string | null;

  @ApiProperty({ enum: ElementType, example: ElementType.CONCEPT, description: 'Element type' })
  elementType!: ElementType;

  @ApiProperty({ example: true, description: 'Starter status' })
  isStarter!: boolean;
}

export class CanvasNodeResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Node instance UUID v4' })
  id!: string;

  @ApiProperty({ example: 'e1f2a3b4-c5d6-7890-ef12-34567890abcd', description: 'Associated element UUID v4' })
  elementId!: string;

  @ApiProperty({ type: CanvasNodeElementDto, description: 'Historical element display metadata' })
  element!: CanvasNodeElementDto;

  @ApiProperty({ example: 100.0, description: 'Finite X coordinate' })
  positionX!: number;

  @ApiProperty({ example: 250.0, description: 'Finite Y coordinate' })
  positionY!: number;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { amount: 15000 },
    description: 'Instance valueData object',
  })
  valueData!: Record<string, unknown>;
}

export class CanvasEdgeResponseDto {
  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f234567890ab', description: 'Edge instance UUID v4' })
  id!: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Source node UUID v4' })
  sourceNodeId!: string;

  @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-cdef-34567890abcd', description: 'Target node UUID v4' })
  targetNodeId!: string;

  @ApiProperty({ example: 'funds', description: 'Edge label' })
  label!: string;
}

export class CanvasSnapshotResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Workspace UUID v4' })
  workspaceId!: string;

  @ApiProperty({ example: '2026-07-24T10:30:00.000Z', description: 'Workspace last updated timestamp' })
  workspaceUpdatedAt!: string;

  @ApiProperty({ type: [CanvasNodeResponseDto], description: 'Node instances ordered by ID ASC' })
  nodes!: CanvasNodeResponseDto[];

  @ApiProperty({ type: [CanvasEdgeResponseDto], description: 'Edge instances ordered by ID ASC' })
  edges!: CanvasEdgeResponseDto[];
}

export class CanvasSnapshotEnvelopeDto {
  @ApiProperty({ type: CanvasSnapshotResponseDto })
  data!: CanvasSnapshotResponseDto;
}
