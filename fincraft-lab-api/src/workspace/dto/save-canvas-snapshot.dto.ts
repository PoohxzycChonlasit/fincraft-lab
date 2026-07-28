import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { WorkspaceEdgeInputDto } from './workspace-edge-input.dto';
import { WorkspaceNodeInputDto } from './workspace-node-input.dto';

export class SaveCanvasSnapshotDto {
  @ApiProperty({
    type: [WorkspaceNodeInputDto],
    description: 'Array of canvas node instances (max 100 nodes per workspace)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkspaceNodeInputDto)
  nodes!: WorkspaceNodeInputDto[];

  @ApiProperty({
    type: [WorkspaceEdgeInputDto],
    description:
      'Array of canvas edge connections (max 200 edges per workspace)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkspaceEdgeInputDto)
  edges!: WorkspaceEdgeInputDto[];

  @ApiPropertyOptional({
    description:
      'Optional safe public discovery payload for workspace restoration',
  })
  @IsOptional()
  @IsObject()
  lastDiscovery?: Record<string, unknown> | null;
}
