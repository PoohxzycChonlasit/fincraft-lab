import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HashModule } from '../infrastructure/hash/hash.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, HashModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
