import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ElementController } from './element.controller';
import { ElementService } from './element.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ElementController],
  providers: [ElementService],
})
export class ElementModule {}
