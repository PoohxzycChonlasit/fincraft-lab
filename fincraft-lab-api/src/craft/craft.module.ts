import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CraftController } from './craft.controller';
import { CraftService } from './craft.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CraftController],
  providers: [CraftService],
})
export class CraftModule {}
