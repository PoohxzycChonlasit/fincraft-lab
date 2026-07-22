import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HashModule } from '../infrastructure/hash/hash.module';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, HashModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
