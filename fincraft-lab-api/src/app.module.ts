import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminContentModule } from './admin-content/admin-content.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { validateEnv } from './config/env.validation';
import { CraftModule } from './craft/craft.module';
import { DatabaseModule } from './database/database.module';
import { ElementModule } from './element/element.module';
import { HealthModule } from './health/health.module';
import { PetModule } from './pet/pet.module';
import { SimulationModule } from './simulation/simulation.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    CraftModule,
    ElementModule,
    WorkspaceModule,
    SimulationModule,
    PetModule,
    AdminContentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
