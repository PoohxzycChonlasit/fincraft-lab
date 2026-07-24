import { Pet } from '../../database/generated/prisma/client';
import { PetResponseDto } from '../dto/pet-response.dto';

export class PetResponseMapper {
  static toResponseDto(pet: Pet): PetResponseDto {
    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      avatarUrl: pet.avatarUrl,
      personality: pet.personality,
      learningGoal: pet.learningGoal,
      createdAt: pet.createdAt.toISOString(),
      updatedAt: pet.updatedAt.toISOString(),
    };
  }
}
