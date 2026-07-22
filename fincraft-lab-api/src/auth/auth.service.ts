import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserStatus } from '../database/generated/prisma/client';
import { BcryptService } from '../infrastructure/hash/bcrypt.service';
import { AccessTokenService } from '../infrastructure/jwt/access-token.service';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.userService.createUser(registerDto);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await this.bcryptService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const accessToken = await this.accessTokenService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const safeUser: UserResponseDto = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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
