import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../database/generated/prisma/client';

export interface AccessTokenClaims {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: AccessTokenClaims): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
