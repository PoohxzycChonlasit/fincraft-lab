import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../database/generated/prisma/client';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const BCRYPT_SALT_ROUNDS = 12;

export interface LoginResult {
  user: UserResponseDto;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const passwordHash = await bcrypt.hash(
      registerDto.password,
      BCRYPT_SALT_ROUNDS,
    );

    const user = await this.userService.createUser({
      email: registerDto.email,
      passwordHash,
      displayName: registerDto.displayName,
    });

    return user;
  }

  async login(loginDto: LoginDto): Promise<LoginResult> {
    const userWithPassword = await this.userService.getUserByEmail(
      loginDto.email,
    );

    if (!userWithPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      userWithPassword.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (userWithPassword.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: userWithPassword.id,
      email: userWithPassword.email,
      role: userWithPassword.role,
    });

    const safeUser: UserResponseDto = {
      id: userWithPassword.id,
      email: userWithPassword.email,
      displayName: userWithPassword.displayName,
      avatarUrl: userWithPassword.avatarUrl,
      role: userWithPassword.role,
      status: userWithPassword.status,
      createdAt: userWithPassword.createdAt,
      updatedAt: userWithPassword.updatedAt,
    };

    return {
      user: safeUser,
      accessToken,
    };
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(userId);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Authentication session is no longer valid',
      );
    }

    return user;
  }
}
