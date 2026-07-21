import { Injectable } from '@nestjs/common';

const SERVICE_NAME = 'fincraft-lab-api';

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
}

@Injectable()
export class HealthService {
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
    };
  }
}
