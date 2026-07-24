import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, UserStatus } from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetResponseDto } from './dto/pet-response.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetResponseMapper } from './mappers/pet-response.mapper';

@Injectable()
export class PetService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    });

    if (!user) {
      throw new UnauthorizedException('User account not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('User account is disabled');
    }
  }

  async getMyPet(userId: string): Promise<PetResponseDto> {
    await this.validateUser(userId);

    const pet = await this.prisma.pet.findUnique({
      where: { userId },
    });

    if (!pet) {
      throw new NotFoundException('Pet profile not found');
    }

    return PetResponseMapper.toResponseDto(pet);
  }

  async createPet(userId: string, dto: CreatePetDto): Promise<PetResponseDto> {
    await this.validateUser(userId);

    const existing = await this.prisma.pet.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Pet profile already exists');
    }

    try {
      const pet = await this.prisma.pet.create({
        data: {
          userId,
          name: dto.name,
          species: dto.species,
          avatarUrl: dto.avatarUrl ?? null,
          personality: dto.personality ?? null,
          learningGoal: dto.learningGoal ?? null,
        },
      });

      return PetResponseMapper.toResponseDto(pet);
    } catch (error: unknown) {
      this.handleDuplicateError(error);
      throw error;
    }
  }

  async updatePet(userId: string, dto: UpdatePetDto): Promise<PetResponseDto> {
    await this.validateUser(userId);

    const hasEditableField =
      dto !== undefined &&
      dto !== null &&
      (dto.name !== undefined ||
        dto.species !== undefined ||
        dto.avatarUrl !== undefined ||
        dto.personality !== undefined ||
        dto.learningGoal !== undefined);

    if (!hasEditableField) {
      throw new BadRequestException(
        'At least one editable field must be provided',
      );
    }

    const existing = await this.prisma.pet.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Pet profile not found');
    }

    const data: Prisma.PetUpdateInput = {};

    if (dto.name !== undefined) {
      if (dto.name === null) {
        throw new BadRequestException('Pet name cannot be null');
      }
      data.name = dto.name;
    }

    if (dto.species !== undefined) {
      if (dto.species === null) {
        throw new BadRequestException('Pet species cannot be null');
      }
      data.species = dto.species;
    }

    if (dto.avatarUrl !== undefined) {
      data.avatarUrl = dto.avatarUrl;
    }

    if (dto.personality !== undefined) {
      data.personality = dto.personality;
    }

    if (dto.learningGoal !== undefined) {
      data.learningGoal = dto.learningGoal;
    }

    const updated = await this.prisma.pet.update({
      where: { userId },
      data,
    });

    return PetResponseMapper.toResponseDto(updated);
  }

  private handleDuplicateError(error: unknown): void {
    if (this.isPetUserIdConflict(error)) {
      throw new ConflictException('Pet profile already exists');
    }
  }

  private isPetUserIdConflict(error: unknown): boolean {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== 'P2002'
    ) {
      return false;
    }

    const meta = error.meta as
      | {
          modelName?: string;
          target?: unknown;
          driverAdapterError?: {
            cause?: {
              constraint?: {
                fields?: unknown;
              };
              originalMessage?: string;
            };
          };
        }
      | undefined;

    if (!meta) {
      return false;
    }

    const target = meta.target;
    if (Array.isArray(target)) {
      if (target.includes('user_id') || target.includes('userId')) {
        return true;
      }
    } else if (typeof target === 'string') {
      if (
        target === 'user_id' ||
        target === 'userId' ||
        target === 'pets_user_id_key'
      ) {
        return true;
      }
    }

    const driverFields = meta.driverAdapterError?.cause?.constraint?.fields;
    if (Array.isArray(driverFields)) {
      if (driverFields.includes('user_id') || driverFields.includes('userId')) {
        return true;
      }
    }

    const originalMsg = meta.driverAdapterError?.cause?.originalMessage;
    if (
      typeof originalMsg === 'string' &&
      originalMsg.includes('pets_user_id_key')
    ) {
      return true;
    }

    return false;
  }
}
