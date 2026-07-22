import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BcryptService } from '../infrastructure/hash/bcrypt.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UserCreateInput } from './types/user.type';

@Injectable()
export class UserService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prisma: PrismaService,
  ) {}

  async createUser(input: UserCreateInput): Promise<UserResponseDto> {
    const passwordHash = await this.bcryptService.hash(input.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          displayName: input.displayName,
        },
        omit: {
          passwordHash: true,
        },
      });

      return user;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target;
        const isEmailConflict = Array.isArray(target)
          ? target.includes('email')
          : typeof target === 'string'
            ? target.includes('email')
            : true;
        if (isEmailConflict) {
          throw new ConflictException('A user with this email already exists');
        }
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({
      where: { id },
      omit: {
        passwordHash: true,
      },
    });
  }
}
