import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
import { CraftService } from './craft.service';
import { CraftResultEnvelopeDto } from './dto/craft-response.dto';
import { CraftRequestDto } from './dto/craft-request.dto';

@ApiTags('Craft')
@ApiBearerAuth('access-token')
@Controller('craft')
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Combine two elements in a crafting attempt',
    description:
      'Combines exactly two unique unlocked input elements. Returns DISCOVERY with details if an active recipe matches, or NO_RECIPE if no recipe exists.',
  })
  @ApiOkResponse({
    description: 'Crafting operation executed successfully',
    type: CraftResultEnvelopeDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input elements or duplicate IDs',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Bearer access token',
  })
  @ApiForbiddenResponse({
    description: 'User account disabled or input element not unlocked',
  })
  @ApiNotFoundResponse({ description: 'Input element not found' })
  async craft(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CraftRequestDto,
  ) {
    const result = await this.craftService.craft(user.sub, dto);

    return {
      data: result,
    };
  }
}
