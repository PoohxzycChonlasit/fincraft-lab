import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Simulation Management (e2e)', () => {
  jest.setTimeout(30000);
  let app: INestApplication<App>;
  let user1Token: string;
  let user2Token: string;
  let simulationId: string;
  let createdRunId: string;
  const user1Email = `sim_user1_${Date.now()}@example.com`;
  const user2Email = `sim_user2_${Date.now()}@example.com`;
  const password = 'TestPassword123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    // Register User 1
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: user1Email, password, displayName: 'Sim User 1' })
      .expect(201);

    // Login User 1
    const login1Res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user1Email, password })
      .expect(200);
    user1Token = (login1Res.body as { data: { accessToken: string } }).data
      .accessToken;

    // Register User 2
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: user2Email, password, displayName: 'Sim User 2' })
      .expect(201);

    // Login User 2
    const login2Res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user2Email, password })
      .expect(200);
    user2Token = (login2Res.body as { data: { accessToken: string } }).data
      .accessToken;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. GET /simulations unauthenticated returns 401', async () => {
    await request(app.getHttpServer()).get('/simulations').expect(401);
  });

  it('2. GET /simulations/:id unauthenticated returns 401', async () => {
    await request(app.getHttpServer())
      .get('/simulations/a1b2c3d4-e5f6-7890-abcd-ef1234567890')
      .expect(401);
  });

  it('3. POST /simulations/:id/runs unauthenticated returns 401', async () => {
    await request(app.getHttpServer())
      .post('/simulations/a1b2c3d4-e5f6-7890-abcd-ef1234567890/runs')
      .send({ emergencyFund: 25000, essentialMonthlyExpenses: 10000 })
      .expect(401);
  });

  it('4. Authenticated USER can list active Simulations', async () => {
    const res = await request(app.getHttpServer())
      .get('/simulations')
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    const body = res.body as {
      data: Array<{ id: string; slug: string; name: string }>;
    };
    expect(body.data.length).toBeGreaterThan(0);
    const sim = body.data.find((s) => s.slug === 'survival-months');
    expect(sim).toBeDefined();
    if (sim) {
      simulationId = sim.id;
    }
  });

  it('5. Authenticated USER can open Emergency Fund Runway details', async () => {
    const res = await request(app.getHttpServer())
      .get(`/simulations/${simulationId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    const body = res.body as {
      data: {
        id: string;
        slug: string;
        formulaExplanation: string;
        assumptions: string[];
        limitations: string[];
        disclaimer: string;
      };
    };
    expect(body.data.slug).toBe('survival-months');
    expect(body.data.formulaExplanation).toBeDefined();
    expect(body.data.assumptions.length).toBeGreaterThan(0);
    expect(body.data.disclaimer).toContain('Education and simulation only');
  });

  it('6. Valid assumptions produce a successful persisted run', async () => {
    const res = await request(app.getHttpServer())
      .post(`/simulations/${simulationId}/runs`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        emergencyFund: 25000,
        essentialMonthlyExpenses: 10000,
      })
      .expect(201);

    const body = res.body as {
      data: {
        runId: string;
        result: {
          survivalMonths: string;
          wholeMonthsCovered: number;
          remainingAmount: string;
        };
        disclaimer: string;
      };
    };
    expect(body.data.runId).toBeDefined();
    expect(body.data.result.survivalMonths).toBe('2.50');
    expect(body.data.result.wholeMonthsCovered).toBe(2);
    expect(body.data.result.remainingAmount).toBe('5000.00');
    expect(body.data.disclaimer).toContain('Education and simulation only');

    createdRunId = body.data.runId;
  });

  it('7. Result contains valid inputs and output snapshots', async () => {
    const res = await request(app.getHttpServer())
      .get(`/simulation-runs/${createdRunId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    const body = res.body as {
      data: {
        input: { emergencyFund: string; essentialMonthlyExpenses: string };
        result: { survivalMonths: string };
      };
    };
    expect(body.data.input.emergencyFund).toBe('25000.00');
    expect(body.data.input.essentialMonthlyExpenses).toBe('10000.00');
    expect(body.data.result.survivalMonths).toBe('2.50');
  });

  it('8. Result contains assumptions and limitations', async () => {
    const res = await request(app.getHttpServer())
      .get(`/simulation-runs/${createdRunId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    const body = res.body as {
      data: { assumptions: string[]; limitations: string[] };
    };
    expect(body.data.assumptions.length).toBeGreaterThan(0);
    expect(body.data.limitations.length).toBeGreaterThan(0);
  });

  it('9. Invalid negative amount is rejected with 400', async () => {
    await request(app.getHttpServer())
      .post(`/simulations/${simulationId}/runs`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        emergencyFund: -5000,
        essentialMonthlyExpenses: 10000,
      })
      .expect(400);
  });

  it('10. Missing required assumption is rejected with 400', async () => {
    await request(app.getHttpServer())
      .post(`/simulations/${simulationId}/runs`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        emergencyFund: 25000,
      })
      .expect(400);
  });

  it('11. Unsupported or extra sensitive fields are rejected with 400', async () => {
    await request(app.getHttpServer())
      .post(`/simulations/${simulationId}/runs`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        emergencyFund: 25000,
        essentialMonthlyExpenses: 10000,
        unsupportedField: 'hacked',
      })
      .expect(400);
  });

  it("12. GET /simulation-runs/:runId returns the User's run", async () => {
    const res = await request(app.getHttpServer())
      .get(`/simulation-runs/${createdRunId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    const body = res.body as { data: { runId: string } };
    expect(body.data.runId).toBe(createdRunId);
  });

  it("13. Another User (User 2) cannot retrieve User 1's run (returns 404)", async () => {
    await request(app.getHttpServer())
      .get(`/simulation-runs/${createdRunId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .expect(404);
  });

  it('14. Inactive or missing Simulation cannot execute (returns 404)', async () => {
    await request(app.getHttpServer())
      .post('/simulations/99999999-9999-4999-a999-999999999999/runs')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ emergencyFund: 25000, essentialMonthlyExpenses: 10000 })
      .expect(404);
  });

  it('15. Response carries required educational safety messaging', async () => {
    const res = await request(app.getHttpServer())
      .get(`/simulation-runs/${createdRunId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    const body = res.body as { data: { disclaimer: string } };
    expect(body.data.disclaimer).toContain('Education and simulation only');
  });
});
