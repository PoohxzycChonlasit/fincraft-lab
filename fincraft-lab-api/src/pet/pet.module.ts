import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AccessTokenModule } from '../infrastructure/jwt/access-token.module';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

@Module({
  imports: [DatabaseModule, AccessTokenModule],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
