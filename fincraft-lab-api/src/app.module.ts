import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CraftModule } from './craft/craft.module';
import { ElementModule } from './element/element.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { SimulationModule } from './simulation/simulation.module';
import { PetModule } from './pet/pet.module';
import { AdminContentModule } from './admin-content/admin-content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
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
})
export class AppModule {}
