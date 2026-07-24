import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../database/generated/prisma/client';

export class UserResponseDto {
  @ApiProperty({
    type: String,
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Unique user UUID v4',
  })
  id!: string;

  @ApiProperty({
    type: String,
    example: 'user@example.com',
    description: 'User email address',
  })
  email!: string;

  @ApiProperty({
    type: String,
    example: 'FinCrafter',
    description: 'User display name',
  })
  displayName!: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://example.com/avatar.png',
    nullable: true,
    description: 'User profile avatar URL',
  })
  avatarUrl!: string | null;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'User authorization role',
  })
  role!: UserRole;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'User account status',
  })
  status!: UserStatus;

  @ApiProperty({
    type: String,
    example: '2026-07-24T10:30:00.000Z',
    description: 'Account creation timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    type: String,
    example: '2026-07-24T10:30:00.000Z',
    description: 'Account last updated timestamp',
  })
  updatedAt!: Date;
}
