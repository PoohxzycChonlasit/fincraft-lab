import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginEnvelopeDto, UserEnvelopeDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { AccessTokenPayload } from './types/access-token-payload.type';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user account',
    description: 'Creates a new ACTIVE user account with email, password, and display name.',
  })
  @ApiCreatedResponse({
    description: 'User account created successfully',
    type: UserEnvelopeDto,
  })
  @ApiConflictResponse({ description: 'Email address is already registered' })
  async register(@Body() dto: RegisterDto): Promise<{ data: UserResponseDto }> {
    const user = await this.authService.register(dto);
    return { data: user };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in to an existing account',
    description: 'Authenticates credentials and returns a signed JWT access token and user profile.',
  })
  @ApiOkResponse({
    description: 'User authenticated successfully',
    type: LoginEnvelopeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password credentials' })
  @ApiForbiddenResponse({ description: 'User account is disabled' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { data: result };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get currently authenticated user profile',
    description: 'Retrieves current user identity and profile details using Bearer JWT authorization.',
  })
  @ApiOkResponse({
    description: 'Current user profile retrieved successfully',
    type: UserEnvelopeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer access token' })
  @ApiForbiddenResponse({ description: 'User account is disabled' })
  async getMe(
    @CurrentUser() currentUser: AccessTokenPayload,
  ): Promise<{ data: UserResponseDto }> {
    const user = await this.authService.getCurrentUser(currentUser.sub);
    return { data: user };
  }
}
