import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SimulationCalculatorService } from './simulation-calculator.service';
import { SimulationController } from './simulation.controller';
import { SimulationRunController } from './simulation-run.controller';
import { SimulationService } from './simulation.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SimulationController, SimulationRunController],
  providers: [SimulationService, SimulationCalculatorService],
  exports: [SimulationService, SimulationCalculatorService],
})
export class SimulationModule {}
