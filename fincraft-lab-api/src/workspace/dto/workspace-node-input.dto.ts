import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class WorkspaceNodeInputDto {
  @IsUUID('4')
  id!: string;

  @IsUUID('4')
  elementId!: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  positionX!: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  positionY!: number;

  @IsOptional()
  valueData?: Record<string, unknown>;
}
