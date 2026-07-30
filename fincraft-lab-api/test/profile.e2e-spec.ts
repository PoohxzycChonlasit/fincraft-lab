import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Profile Management (e2e)', () => {
  jest.setTimeout(30000);
  let app: INestApplication<App>;
  let accessToken: string;
  const testEmail = `profile_test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

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

    // Register test user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        displayName: 'Initial Profile Name',
      })
      .expect(201);

    // Login test user
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    const loginBody = loginRes.body as {
      data: { accessToken: string };
    };
    accessToken = loginBody.data.accessToken;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('A. GET /users/me without token returns 401', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401);
  });

  it('B. PATCH /users/me without token returns 401', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .send({ displayName: 'Unauthorized Attempt' })
      .expect(401);
  });

  it('E. GET /users/me with Bearer token returns current safe user profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = res.body as {
      data: {
        id: string;
        email: string;
        displayName: string;
        role: string;
        status: string;
        passwordHash?: string;
      };
    };

    expect(body.data.email).toBe(testEmail);
    expect(body.data.displayName).toBe('Initial Profile Name');
    expect(body.data.role).toBe('USER');
    expect(body.data.status).toBe('ACTIVE');
    expect(body.data.passwordHash).toBeUndefined();
  });

  it('F. PATCH /users/me updates displayName successfully', async () => {
    const res = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ displayName: 'Updated Profile Name' })
      .expect(200);

    const body = res.body as {
      data: { displayName: string; passwordHash?: string };
    };
    expect(body.data.displayName).toBe('Updated Profile Name');
    expect(body.data.passwordHash).toBeUndefined();
  });

  it('G. PATCH /users/me updates avatarUrl successfully', async () => {
    const res = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ avatarUrl: 'https://example.com/valid-avatar.png' })
      .expect(200);

    const body = res.body as {
      data: { avatarUrl: string; passwordHash?: string };
    };
    expect(body.data.avatarUrl).toBe('https://example.com/valid-avatar.png');
    expect(body.data.passwordHash).toBeUndefined();
  });

  it('H. GET /users/me confirms updated values persisted', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = res.body as {
      data: { displayName: string; avatarUrl: string; passwordHash?: string };
    };
    expect(body.data.displayName).toBe('Updated Profile Name');
    expect(body.data.avatarUrl).toBe('https://example.com/valid-avatar.png');
    expect(body.data.passwordHash).toBeUndefined();
  });

  it('I. PATCH /users/me with forbidden field role is rejected with 400', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ role: 'SUPER_ADMIN' })
      .expect(400);
  });

  it('J. PATCH /users/me with forbidden field status is rejected with 400', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'BANNED' })
      .expect(400);
  });

  it('K. PATCH /users/me with forbidden field email is rejected with 400', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email: 'hacked@example.com' })
      .expect(400);
  });

  it('L. PATCH /users/me with forbidden field passwordHash is rejected with 400', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ passwordHash: 'hacked_hash' })
      .expect(400);
  });

  it('O. PATCH /users/me with blank avatarUrl normalizes to null', async () => {
    const res = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ avatarUrl: '   ' })
      .expect(200);

    const body = res.body as {
      data: { avatarUrl: string | null; passwordHash?: string };
    };
    expect(body.data.avatarUrl).toBeNull();
    expect(body.data.passwordHash).toBeUndefined();
  });
});
