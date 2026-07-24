import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvVariable } from '../../config/env.validation';
import { UserRole } from '../../database/generated/prisma/client';

export interface AccessTokenClaims {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvVariable, true>,
  ) {}

  sign(payload: AccessTokenClaims): Promise<string> {
    const secret = this.configService.get('ACCESS_TOKEN_SECRET', {
      infer: true,
    });
    const rawExpiresIn = this.configService.get('ACCESS_TOKEN_EXPIRES_IN', {
      infer: true,
    });
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: rawExpiresIn as NonNullable<
        Parameters<JwtService['signAsync']>[1]
      >['expiresIn'],
    });
  }

  verify(token: string): Promise<AccessTokenClaims> {
    return this.jwtService.verifyAsync<AccessTokenClaims>(token, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET', {
        infer: true,
      }),
    });
  }
}
