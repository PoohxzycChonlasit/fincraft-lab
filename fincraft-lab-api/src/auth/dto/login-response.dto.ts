import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    type: UserResponseDto,
    description: 'Authenticated user profile data',
  })
  user!: UserResponseDto;

  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Signed JWT access token for Bearer authorization',
  })
  accessToken!: string;
}

export class UserEnvelopeDto {
  @ApiProperty({ type: UserResponseDto })
  data!: UserResponseDto;
}

export class LoginEnvelopeDto {
  @ApiProperty({ type: LoginResponseDto })
  data!: LoginResponseDto;
}
