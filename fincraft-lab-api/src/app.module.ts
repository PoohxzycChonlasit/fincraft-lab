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
  ],
})
export class AppModule {}
