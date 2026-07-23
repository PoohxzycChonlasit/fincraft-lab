import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CraftService } from './craft.service';

@Module({
  imports: [DatabaseModule],
  providers: [CraftService],
  exports: [CraftService],
})
export class CraftModule {}
