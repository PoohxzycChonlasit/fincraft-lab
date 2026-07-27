import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import {
  ContentStatus,
  ElementType,
  UserRole,
} from '../database/generated/prisma/client';
import { AdminContentService } from './admin-content.service';
import { CreateElementDto } from './dto/create-element.dto';
import {
  AdminElementDetailEnvelopeDto,
  AdminElementListEnvelopeDto,
} from './dto/element-admin-response.dto';
import { UpdateElementDto } from './dto/update-element.dto';
import { UpsertDiscoveryDetailDto } from './dto/upsert-discovery-detail.dto';
import {
  ApiCreateAdminElement,
  ApiDeleteAdminElement,
  ApiGetAdminElementDetail,
  ApiGetAdminElements,
  ApiUpdateAdminElement,
  ApiUpsertDiscoveryDetail,
} from './openapi/admin-content-openapi.decorators';

@ApiTags('Admin Content')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/elements')
export class AdminContentController {
  constructor(private readonly adminContentService: AdminContentService) {}

  @Get()
  @ApiGetAdminElements()
  async getAdminElements(
    @CurrentUser() user: AccessTokenPayload,
    @Query('status') status?: ContentStatus,
    @Query('elementType') elementType?: ElementType,
    @Query('categoryId') categoryId?: string,
  ): Promise<AdminElementListEnvelopeDto> {
    const data = await this.adminContentService.getAdminElements(user.sub, {
      status,
      elementType,
      categoryId,
    });
    return { data };
  }

  @Get(':elementId')
  @ApiGetAdminElementDetail()
  async getAdminElementDetail(
    @CurrentUser() user: AccessTokenPayload,
    @Param('elementId', new ParseUUIDPipe({ version: '4' })) elementId: string,
  ): Promise<AdminElementDetailEnvelopeDto> {
    const data = await this.adminContentService.getAdminElementDetail(
      user.sub,
      elementId,
    );
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateAdminElement()
  async createAdminElement(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateElementDto,
  ): Promise<AdminElementDetailEnvelopeDto> {
    const data = await this.adminContentService.createAdminElement(
      user.sub,
      dto,
    );
    return { data };
  }

  @Patch(':elementId')
  @ApiUpdateAdminElement()
  async updateAdminElement(
    @CurrentUser() user: AccessTokenPayload,
    @Param('elementId', new ParseUUIDPipe({ version: '4' })) elementId: string,
    @Body() dto: UpdateElementDto,
  ): Promise<AdminElementDetailEnvelopeDto> {
    const data = await this.adminContentService.updateAdminElement(
      user.sub,
      elementId,
      dto,
    );
    return { data };
  }

  @Delete(':elementId')
  @HttpCode(HttpStatus.OK)
  @ApiDeleteAdminElement()
  async deleteAdminElement(
    @CurrentUser() user: AccessTokenPayload,
    @Param('elementId', new ParseUUIDPipe({ version: '4' })) elementId: string,
  ): Promise<AdminElementDetailEnvelopeDto> {
    const data = await this.adminContentService.archiveElement(
      user.sub,
      elementId,
    );
    return { data };
  }

  @Put(':elementId/detail')
  @ApiUpsertDiscoveryDetail()
  async upsertDiscoveryDetail(
    @CurrentUser() user: AccessTokenPayload,
    @Param('elementId', new ParseUUIDPipe({ version: '4' })) elementId: string,
    @Body() dto: UpsertDiscoveryDetailDto,
  ): Promise<AdminElementDetailEnvelopeDto> {
    const data = await this.adminContentService.upsertDiscoveryDetail(
      user.sub,
      elementId,
      dto,
    );
    return { data };
  }
}
