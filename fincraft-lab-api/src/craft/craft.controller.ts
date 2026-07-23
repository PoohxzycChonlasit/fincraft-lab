import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { CraftService } from './craft.service';
import { CraftRequestDto } from './dto/craft-request.dto';

@Controller('craft')
export class CraftController {
  constructor(private readonly craftService: CraftService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
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
