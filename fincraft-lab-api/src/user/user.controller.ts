import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { UserStatus } from '../database/generated/prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

export class UserProfileEnvelopeDto {
  data!: UserResponseDto;
}

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current authenticated user profile',
    description:
      'Retrieves the current authenticated user identity and profile details.',
  })
  @ApiOkResponse({
    description: 'Current user profile retrieved successfully',
    type: UserProfileEnvelopeDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Bearer access token',
  })
  @ApiForbiddenResponse({ description: 'User account is disabled' })
  @ApiNotFoundResponse({ description: 'User account not found' })
  async getMyProfile(
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<{ data: UserResponseDto }> {
    const user = await this.userService.getUserById(currentUser.sub);

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('User account is disabled');
    }

    return { data: user };
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current authenticated user profile',
    description:
      'Updates display name and/or avatar URL for the current authenticated user.',
  })
  @ApiOkResponse({
    description: 'User profile updated successfully',
    type: UserProfileEnvelopeDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid payload validation or unexpected sensitive non-whitelisted fields',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Bearer access token',
  })
  @ApiForbiddenResponse({ description: 'User account is disabled' })
  @ApiNotFoundResponse({ description: 'User account not found' })
  async updateMyProfile(
    @CurrentUser() currentUser: AccessTokenPayload,
    @Body() dto: UpdateProfileDto,
  ): Promise<{ data: UserResponseDto }> {
    const existingUser = await this.userService.getUserById(currentUser.sub);

    if (!existingUser) {
      throw new NotFoundException('User profile not found');
    }

    if (existingUser.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('User account is disabled');
    }

    const updatedUser = await this.userService.updateProfile(
      currentUser.sub,
      dto,
    );

    if (!updatedUser) {
      throw new NotFoundException('User profile not found');
    }

    return { data: updatedUser };
  }
}
