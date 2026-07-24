import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SimulationCalculatorService } from './simulation-calculator.service';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SimulationController],
  providers: [SimulationService, SimulationCalculatorService],
  exports: [SimulationService, SimulationCalculatorService],
})
export class SimulationModule {}
