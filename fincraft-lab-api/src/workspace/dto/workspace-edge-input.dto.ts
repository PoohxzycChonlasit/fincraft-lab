import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class WorkspaceEdgeInputDto {
  @ApiProperty({
    example: 'b2c3d4e5-f6a7-8901-bcde-f234567890ab',
    description: 'Unique edge instance UUID v4 within workspace canvas',
  })
  @IsUUID('4')
  id!: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Source node UUID v4 (must exist in node collection)',
  })
  @IsUUID('4')
  sourceNodeId!: string;

  @ApiProperty({
    example: 'c3d4e5f6-a7b8-9012-cdef-34567890abcd',
    description: 'Target node UUID v4 (must exist in node collection and differ from source)',
  })
  @IsUUID('4')
  targetNodeId!: string;

  @ApiProperty({
    example: 'funds',
    description: 'Edge connection label (max 100 characters)',
    maxLength: 100,
  })
  @IsString()
  label!: string;
}
