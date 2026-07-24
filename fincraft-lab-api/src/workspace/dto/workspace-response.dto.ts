import { ApiProperty } from '@nestjs/swagger';
import { WorkspaceStatus } from '../../database/generated/prisma/client';

export class WorkspaceResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Workspace UUID v4',
  })
  id!: string;

  @ApiProperty({
    example: 'Personal Budget Workspace',
    description: 'Workspace name',
  })
  name!: string;

  @ApiProperty({
    enum: WorkspaceStatus,
    example: WorkspaceStatus.ACTIVE,
    description: 'Workspace status',
  })
  status!: WorkspaceStatus;

  @ApiProperty({
    example: '2026-07-24T10:30:00.000Z',
    description: 'Creation ISO timestamp',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-07-24T10:30:00.000Z',
    description: 'Last update ISO timestamp',
  })
  updatedAt!: string;
}

export class DeleteWorkspaceResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Deleted workspace UUID v4',
  })
  id!: string;
}

export class WorkspaceEnvelopeDto {
  @ApiProperty({ type: WorkspaceResponseDto })
  data!: WorkspaceResponseDto;
}

export class WorkspacesEnvelopeDto {
  @ApiProperty({ type: [WorkspaceResponseDto] })
  data!: WorkspaceResponseDto[];
}

export class DeleteWorkspaceEnvelopeDto {
  @ApiProperty({ type: DeleteWorkspaceResponseDto })
  data!: DeleteWorkspaceResponseDto;
}
