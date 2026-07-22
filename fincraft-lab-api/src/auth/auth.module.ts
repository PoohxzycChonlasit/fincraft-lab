import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow<string>('JWT_ACCESS_SECRET');
        const rawExpiresIn = configService.getOrThrow<string>(
          'JWT_ACCESS_EXPIRES_IN_SECONDS',
        );
        const expiresInSeconds = Number(rawExpiresIn);

        if (!Number.isSafeInteger(expiresInSeconds) || expiresInSeconds <= 0) {
          throw new Error(
            'JWT_ACCESS_EXPIRES_IN_SECONDS must be a positive integer',
          );
        }

        return {
          secret,
          signOptions: {
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
