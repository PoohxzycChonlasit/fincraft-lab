import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole } from '../../database/generated/prisma/client';
import { AccessTokenService } from '../../infrastructure/jwt/access-token.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AccessTokenPayload } from '../types/access-token-payload.type';

interface RequestWithUser extends Request {
  user?: AccessTokenPayload;
}

function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (value === UserRole.USER ||
      value === UserRole.ADMIN ||
      value === UserRole.SUPER_ADMIN)
  );
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.authorization;

    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token || token.trim().length === 0) {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }

    let rawPayload: unknown;

    try {
      rawPayload = await this.accessTokenService.verify(token);
    } catch {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }

    if (typeof rawPayload !== 'object' || rawPayload === null) {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }

    const payloadRecord = rawPayload as Record<string, unknown>;

    const sub = payloadRecord.sub;
    const email = payloadRecord.email;
    const role = payloadRecord.role;
    const iat = payloadRecord.iat;
    const exp = payloadRecord.exp;

    if (typeof sub !== 'string' || sub.trim().length === 0) {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }

    if (typeof email !== 'string' || email.trim().length === 0) {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }

    if (!isUserRole(role)) {
      throw new UnauthorizedException(
        'Invalid or missing authentication token',
      );
    }

    const validatedPayload: AccessTokenPayload = {
      sub,
      email,
      role,
    };

    if (typeof iat === 'number') {
      validatedPayload.iat = iat;
    }

    if (typeof exp === 'number') {
      validatedPayload.exp = exp;
    }

    request.user = validatedPayload;
    return true;
  }
}
