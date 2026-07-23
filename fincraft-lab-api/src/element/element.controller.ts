import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { ElementService } from './element.service';
import type { AvailableElementResponse } from './types/available-element-response.type';

@Controller('elements')
export class ElementController {
  constructor(private readonly elementService: ElementService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAvailableElements(
    @CurrentUser() user: AccessTokenPayload,
  ): Promise<{ data: AvailableElementResponse[] }> {
    const result = await this.elementService.getAvailableElements(user.sub);
    return { data: result };
  }
}
