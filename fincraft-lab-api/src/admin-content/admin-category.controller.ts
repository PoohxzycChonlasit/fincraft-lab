import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { UserRole } from '../database/generated/prisma/client';
import { AdminCategoryService } from './admin-category.service';
import {
  AdminCategoryDetailEnvelopeDto,
  AdminCategoryListEnvelopeDto,
} from './dto/category-admin-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiCreateAdminCategory,
  ApiDeleteAdminCategory,
  ApiGetAdminCategories,
  ApiGetAdminCategoryDetail,
  ApiUpdateAdminCategory,
} from './openapi/category-admin-openapi.decorators';

@ApiTags('Admin Categories')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @Get()
  @ApiGetAdminCategories()
  async getAdminCategories(
    @CurrentUser() user: AccessTokenPayload,
  ): Promise<AdminCategoryListEnvelopeDto> {
    const data = await this.adminCategoryService.getAdminCategories(user.sub);
    return { data };
  }

  @Get(':categoryId')
  @ApiGetAdminCategoryDetail()
  async getAdminCategoryDetail(
    @CurrentUser() user: AccessTokenPayload,
    @Param('categoryId', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,
  ): Promise<AdminCategoryDetailEnvelopeDto> {
    const data = await this.adminCategoryService.getAdminCategoryDetail(
      user.sub,
      categoryId,
    );
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateAdminCategory()
  async createAdminCategory(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateCategoryDto,
  ): Promise<AdminCategoryDetailEnvelopeDto> {
    const data = await this.adminCategoryService.createAdminCategory(
      user.sub,
      dto,
    );
    return { data };
  }

  @Patch(':categoryId')
  @ApiUpdateAdminCategory()
  async updateAdminCategory(
    @CurrentUser() user: AccessTokenPayload,
    @Param('categoryId', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<AdminCategoryDetailEnvelopeDto> {
    const data = await this.adminCategoryService.updateAdminCategory(
      user.sub,
      categoryId,
      dto,
    );
    return { data };
  }

  @Delete(':categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiDeleteAdminCategory()
  async deleteAdminCategory(
    @CurrentUser() user: AccessTokenPayload,
    @Param('categoryId', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,
  ): Promise<AdminCategoryDetailEnvelopeDto> {
    const data = await this.adminCategoryService.archiveCategory(
      user.sub,
      categoryId,
    );
    return { data };
  }
}
