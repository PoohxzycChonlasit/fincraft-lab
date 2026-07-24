import { ApiProperty } from '@nestjs/swagger';
import { PetSpecies } from '../../database/generated/prisma/client';

export class PetResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Pet UUID v4',
  })
  id!: string;

  @ApiProperty({
    example: 'Luna',
    description: 'Pet display name',
  })
  name!: string;

  @ApiProperty({
    enum: PetSpecies,
    example: PetSpecies.CAT,
    description: 'Pet species',
  })
  species!: PetSpecies;

  @ApiProperty({
    example: 'https://example.com/pets/cat.png',
    nullable: true,
    description: 'HTTPS avatar URL or null',
  })
  avatarUrl!: string | null;

  @ApiProperty({
    example: 'Curious and cautious with savings',
    nullable: true,
    description: 'Personality summary or null',
  })
  personality!: string | null;

  @ApiProperty({
    example: 'Build a 6-month emergency fund',
    nullable: true,
    description: 'Financial learning objective or null',
  })
  learningGoal!: string | null;

  @ApiProperty({
    example: '2026-07-24T12:00:00.000Z',
    description: 'ISO-8601 creation timestamp',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-07-24T12:00:00.000Z',
    description: 'ISO-8601 update timestamp',
  })
  updatedAt!: string;
}

export class PetEnvelopeDto {
  @ApiProperty({
    type: PetResponseDto,
    description: 'Pet profile payload',
  })
  data!: PetResponseDto;
}
