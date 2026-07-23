import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { WorkspaceEdgeInputDto } from './workspace-edge-input.dto';
import { WorkspaceNodeInputDto } from './workspace-node-input.dto';

export class SaveCanvasSnapshotDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkspaceNodeInputDto)
  nodes!: WorkspaceNodeInputDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkspaceEdgeInputDto)
  edges!: WorkspaceEdgeInputDto[];
}
