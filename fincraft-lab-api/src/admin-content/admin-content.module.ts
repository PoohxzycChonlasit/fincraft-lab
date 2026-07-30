import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AccessTokenModule } from '../infrastructure/jwt/access-token.module';
import { AdminCategoryController } from './admin-category.controller';
import { AdminCategoryService } from './admin-category.service';
import { AdminContentController } from './admin-content.controller';
import { AdminContentService } from './admin-content.service';
import { AdminRecipeController } from './admin-recipe.controller';
import { AdminRecipeService } from './admin-recipe.service';

@Module({
  imports: [DatabaseModule, AccessTokenModule],
  controllers: [
    AdminContentController,
    AdminCategoryController,
    AdminRecipeController,
  ],
  providers: [AdminContentService, AdminCategoryService, AdminRecipeService],
  exports: [AdminContentService, AdminCategoryService, AdminRecipeService],
})
export class AdminContentModule {}
