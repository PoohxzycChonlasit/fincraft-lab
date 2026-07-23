import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { MAX_WORKSPACE_NAME_LENGTH } from '../workspace.constants';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_WORKSPACE_NAME_LENGTH)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;
}
