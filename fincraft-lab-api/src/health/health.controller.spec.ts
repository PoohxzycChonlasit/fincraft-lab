import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('getHealth', () => {
    it('should return status "ok"', () => {
      expect(healthController.getHealth().status).toBe('ok');
    });

    it('should return service name "fincraft-lab-api"', () => {
      expect(healthController.getHealth().service).toBe('fincraft-lab-api');
    });

    it('should return a valid ISO-8601 timestamp', () => {
      const { timestamp } = healthController.getHealth();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });
  });
});
