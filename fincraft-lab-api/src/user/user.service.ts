import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../database/generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

export interface CreateUserInput {
  email: string;
  displayName: string;
  passwordHash: string;
}

export const userResponseSelect = {
  id: true,
  email: true,
  displayName: true,
  avatarUrl: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userWithPasswordSelect = {
  ...userResponseSelect,
  passwordHash: true,
} satisfies Prisma.UserSelect;

export type UserWithPassword = Prisma.UserGetPayload<{
  select: typeof userWithPasswordSelect;
}>;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserInput: CreateUserInput): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserInput.email,
          passwordHash: createUserInput.passwordHash,
          displayName: createUserInput.displayName,
        },
        select: userResponseSelect,
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

  async getUserByEmail(email: string): Promise<UserWithPassword | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: userWithPasswordSelect,
    });
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: userResponseSelect,
    });
  }
}
