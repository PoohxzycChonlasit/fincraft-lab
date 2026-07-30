import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import { AdminRecipeService } from './admin-recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import {
  AdminRecipeDetailEnvelopeDto,
  AdminRecipeListEnvelopeDto,
} from './dto/recipe-admin-response.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import {
  ApiCreateAdminRecipe,
  ApiDeleteAdminRecipe,
  ApiGetAdminRecipeDetail,
  ApiGetAdminRecipes,
  ApiUpdateAdminRecipe,
} from './openapi/recipe-admin-openapi.decorators';

@ApiTags('Admin Recipe Content Management')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/recipes')
export class AdminRecipeController {
  constructor(
    @Inject(AdminRecipeService)
    private readonly adminRecipeService: AdminRecipeService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiGetAdminRecipes()
  async getAdminRecipes(
    @CurrentUser() user: AccessTokenPayload,
  ): Promise<AdminRecipeListEnvelopeDto> {
    const data = await this.adminRecipeService.getAdminRecipes(user.sub);
    return { data };
  }

  @Get(':recipeId')
  @HttpCode(HttpStatus.OK)
  @ApiGetAdminRecipeDetail()
  async getAdminRecipeDetail(
    @CurrentUser() user: AccessTokenPayload,
    @Param('recipeId', new ParseUUIDPipe({ version: '4' })) recipeId: string,
  ): Promise<AdminRecipeDetailEnvelopeDto> {
    const data = await this.adminRecipeService.getAdminRecipeDetail(
      user.sub,
      recipeId,
    );
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateAdminRecipe()
  async createAdminRecipe(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateRecipeDto,
  ): Promise<AdminRecipeDetailEnvelopeDto> {
    const data = await this.adminRecipeService.createAdminRecipe(user.sub, dto);
    return { data };
  }

  @Patch(':recipeId')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateAdminRecipe()
  async updateAdminRecipe(
    @CurrentUser() user: AccessTokenPayload,
    @Param('recipeId', new ParseUUIDPipe({ version: '4' })) recipeId: string,
    @Body() dto: UpdateRecipeDto,
  ): Promise<AdminRecipeDetailEnvelopeDto> {
    const data = await this.adminRecipeService.updateAdminRecipe(
      user.sub,
      recipeId,
      dto,
    );
    return { data };
  }

  @Delete(':recipeId')
  @HttpCode(HttpStatus.OK)
  @ApiDeleteAdminRecipe()
  async archiveRecipe(
    @CurrentUser() user: AccessTokenPayload,
    @Param('recipeId', new ParseUUIDPipe({ version: '4' })) recipeId: string,
  ): Promise<AdminRecipeDetailEnvelopeDto> {
    const data = await this.adminRecipeService.archiveRecipe(
      user.sub,
      recipeId,
    );
    return { data };
  }
}
