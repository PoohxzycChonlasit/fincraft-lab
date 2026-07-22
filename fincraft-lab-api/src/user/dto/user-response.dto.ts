import { UserRole, UserStatus } from '../../database/generated/prisma/client';

export class UserResponseDto {
  id!: string;
  email!: string;
  displayName!: string;
  avatarUrl!: string | null;
  role!: UserRole;
  status!: UserStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
