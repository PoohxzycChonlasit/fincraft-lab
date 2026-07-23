import { IsString, IsUUID } from 'class-validator';

export class WorkspaceEdgeInputDto {
  @IsUUID('4')
  id!: string;

  @IsUUID('4')
  sourceNodeId!: string;

  @IsUUID('4')
  targetNodeId!: string;

  @IsString()
  label!: string;
}
