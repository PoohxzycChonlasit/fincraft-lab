import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { UserRole, UserStatus } from '../database/generated/prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';

describe('UserController & UserService (Profile Management)', () => {
  let userController: UserController;

  const mockUser: UserResponseDto = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'test@example.com',
    displayName: 'Original Name',
    avatarUrl: 'https://example.com/avatar.png',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const mockAccessTokenPayload: AccessTokenPayload = {
    sub: mockUser.id,
    email: mockUser.email,
    role: mockUser.role,
  };

  const mockUserService = {
    getUserById: jest.fn(),
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('GET /users/me (getMyProfile)', () => {
    it('should return safe user profile for authenticated active user', async () => {
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const result = await userController.getMyProfile(mockAccessTokenPayload);

      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(result.data).toEqual(mockUser);
      expect(result.data).not.toHaveProperty('passwordHash');
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      await expect(
        userController.getMyProfile(mockAccessTokenPayload),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user status is INACTIVE or BANNED', async () => {
      mockUserService.getUserById.mockResolvedValue({
        ...mockUser,
        status: UserStatus.INACTIVE,
      });

      await expect(
        userController.getMyProfile(mockAccessTokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('PATCH /users/me (updateMyProfile)', () => {
    it('should update and return safe user profile for valid payload', async () => {
      const updateDto: UpdateProfileDto = {
        displayName: 'Updated Name',
        avatarUrl: 'https://example.com/new-avatar.png',
      };

      const updatedUser: UserResponseDto = {
        ...mockUser,
        displayName: 'Updated Name',
        avatarUrl: 'https://example.com/new-avatar.png',
      };

      mockUserService.getUserById.mockResolvedValue(mockUser);
      mockUserService.updateProfile.mockResolvedValue(updatedUser);

      const result = await userController.updateMyProfile(
        mockAccessTokenPayload,
        updateDto,
      );

      expect(mockUserService.updateProfile).toHaveBeenCalledWith(
        mockUser.id,
        updateDto,
      );
      expect(result.data).toEqual(updatedUser);
      expect(result.data.email).toBe(mockUser.email);
      expect(result.data.role).toBe(mockUser.role);
      expect(result.data.status).toBe(mockUser.status);
      expect(result.data).not.toHaveProperty('passwordHash');
    });

    it('should throw NotFoundException if user subject no longer exists', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      await expect(
        userController.updateMyProfile(mockAccessTokenPayload, {
          displayName: 'New Name',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user status is disabled', async () => {
      mockUserService.getUserById.mockResolvedValue({
        ...mockUser,
        status: UserStatus.BANNED,
      });

      await expect(
        userController.updateMyProfile(mockAccessTokenPayload, {
          displayName: 'New Name',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('UpdateProfileDto Validation', () => {
    it('should accept valid displayName and valid HTTPS avatarUrl', async () => {
      const dto = plainToInstance(UpdateProfileDto, {
        displayName: '  FinCraft Explorer  ',
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.displayName).toBe('FinCraft Explorer');
      expect(dto.avatarUrl).toBe('https://cdn.example.com/avatar.jpg');
    });

    it('should normalize blank avatarUrl string to null', async () => {
      const dto = plainToInstance(UpdateProfileDto, {
        displayName: 'Valid Name',
        avatarUrl: '   ',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.avatarUrl).toBeNull();
    });

    it('should reject short displayName under 2 characters', async () => {
      const dto = plainToInstance(UpdateProfileDto, {
        displayName: 'A',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('displayName');
    });

    it('should reject non-HTTP/HTTPS avatarUrl string', async () => {
      const dto = plainToInstance(UpdateProfileDto, {
        avatarUrl: 'javascript:alert(1)',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('avatarUrl');
    });
  });
});
