import { Module } from '@nestjs/common';
import { HashModule } from '../infrastructure/hash/hash.module';
import { AccessTokenModule } from '../infrastructure/jwt/access-token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [UserModule, HashModule, AccessTokenModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard],
  exports: [AuthService, AuthGuard, RolesGuard, AccessTokenModule, UserModule],
})
export class AuthModule {}
