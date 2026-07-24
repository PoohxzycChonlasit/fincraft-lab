import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { AvailableElementsEnvelopeDto } from './dto/available-element-response.dto';
import { ElementService } from './element.service';
import type { AvailableElementResponse } from './types/available-element-response.type';

@ApiTags('Elements')
@ApiBearerAuth('access-token')
@Controller('elements')
export class ElementController {
  constructor(private readonly elementService: ElementService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all available elements for current user',
    description: 'Retrieves all active starter elements and user-unlocked discovered elements categorized.',
  })
  @ApiOkResponse({
    description: 'Available elements list retrieved successfully',
    type: AvailableElementsEnvelopeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid Bearer access token' })
  @ApiForbiddenResponse({ description: 'User account is disabled' })
  async getAvailableElements(
    @CurrentUser() user: AccessTokenPayload,
  ): Promise<{ data: AvailableElementResponse[] }> {
    const result = await this.elementService.getAvailableElements(user.sub);
    return { data: result };
  }
}
