import { UserRole } from '../../database/generated/prisma/client';

export class AccessTokenPayload {
  sub!: string;
  email!: string;
  role!: UserRole;
  iat?: number;
  exp?: number;
}
