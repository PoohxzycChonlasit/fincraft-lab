import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AccessTokenModule } from '../infrastructure/jwt/access-token.module';
import { AdminContentController } from './admin-content.controller';
import { AdminContentService } from './admin-content.service';

@Module({
  imports: [DatabaseModule, AccessTokenModule],
  controllers: [AdminContentController],
  providers: [AdminContentService],
  exports: [AdminContentService],
})
export class AdminContentModule {}
