import { UserRole } from '../../database/generated/prisma/client';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
