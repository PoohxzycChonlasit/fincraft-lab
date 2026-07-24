import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PetSpecies } from '../../database/generated/prisma/client';
import { IsHttpsUrl } from '../validators/is-https-url.validator';

export class UpdatePetDto {
  @ApiPropertyOptional({
    example: 'Luna Star',
    description: 'Updated Pet display name (1 to 50 characters)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    enum: PetSpecies,
    example: PetSpecies.DOG,
    description: 'Updated Pet species',
  })
  @IsOptional()
  @IsEnum(PetSpecies)
  species?: PetSpecies;

  @ApiPropertyOptional({
    example: 'https://example.com/pets/dog.png',
    description: 'Updated HTTPS avatar URL or null to clear',
    nullable: true,
  })
  @IsOptional()
  @IsHttpsUrl()
  avatarUrl?: string | null;

  @ApiPropertyOptional({
    example: 'Energetic and focused on budgeting',
    description: 'Updated personality summary or null to clear',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(200)
  personality?: string | null;

  @ApiPropertyOptional({
    example: 'Understand interest rates and debt payoff',
    description: 'Updated financial learning objective or null to clear',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MaxLength(200)
  learningGoal?: string | null;
}
