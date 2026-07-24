import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { WorkspaceStatus } from '../../database/generated/prisma/client';
import { MAX_WORKSPACE_NAME_LENGTH } from '../constants/workspace.constants';

export class UpdateWorkspaceDto {
  @ApiPropertyOptional({
    example: 'Updated Budget Workspace',
    description: 'Updated display name for the workspace',
    minLength: 1,
    maxLength: MAX_WORKSPACE_NAME_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_WORKSPACE_NAME_LENGTH)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name?: string;

  @ApiPropertyOptional({
    enum: WorkspaceStatus,
    example: WorkspaceStatus.ACTIVE,
    description: 'Updated workspace status (ACTIVE or ARCHIVED)',
  })
  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus;
}
