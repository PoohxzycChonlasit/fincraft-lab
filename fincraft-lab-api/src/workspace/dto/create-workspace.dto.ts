import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MAX_WORKSPACE_NAME_LENGTH } from '../constants/workspace.constants';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_WORKSPACE_NAME_LENGTH)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;
}
