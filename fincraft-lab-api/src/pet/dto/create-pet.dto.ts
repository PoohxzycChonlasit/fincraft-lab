import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PetSpecies } from '../../database/generated/prisma/client';
import { IsHttpsUrl } from '../validators/is-https-url.validator';

export class CreatePetDto {
  @ApiProperty({
    example: 'Luna',
    description: 'Pet display name (1 to 50 characters)',
  })
  @IsDefined()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    enum: PetSpecies,
    example: PetSpecies.CAT,
    description: 'Pet species',
  })
  @IsDefined()
  @IsEnum(PetSpecies)
  species!: PetSpecies;

  @ApiPropertyOptional({
    example: 'https://example.com/pets/cat.png',
    description: 'HTTPS avatar URL (max 2048 characters) or null',
    nullable: true,
  })
  @IsOptional()
  @IsHttpsUrl()
  avatarUrl?: string | null;

  @ApiPropertyOptional({
    example: 'Curious and cautious with savings',
    description: 'Personality summary (max 200 characters) or null',
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
    example: 'Build a 6-month emergency fund',
    description: 'Financial learning objective (max 200 characters) or null',
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
