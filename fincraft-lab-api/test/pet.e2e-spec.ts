import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Pet Management (e2e)', () => {
  let app: INestApplication<App>;
  let user1Token: string;
  let user2Token: string;
  const user1Email = `pet_user1_${Date.now()}@example.com`;
  const user2Email = `pet_user2_${Date.now()}@example.com`;
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
      .send({ email: user1Email, password, displayName: 'Pet Owner 1' })
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
      .send({ email: user2Email, password, displayName: 'Pet Owner 2' })
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

  it('1. GET /pets/me unauthenticated returns 401', async () => {
    await request(app.getHttpServer()).get('/pets/me').expect(401);
  });

  it('2. POST /pets unauthenticated returns 401', async () => {
    await request(app.getHttpServer())
      .post('/pets')
      .send({ name: 'Luna', species: 'CAT' })
      .expect(401);
  });

  it('3. PATCH /pets/me unauthenticated returns 401', async () => {
    await request(app.getHttpServer())
      .patch('/pets/me')
      .send({ name: 'Updated Luna' })
      .expect(401);
  });

  it('4. Authenticated USER with no Pet receives 404', async () => {
    await request(app.getHttpServer())
      .get('/pets/me')
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(404);
  });

  it('5. Authenticated USER creates Pet successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/pets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Finny',
        species: 'CAT',
        personality: 'Curious saver',
        learningGoal: 'Emergency Fund',
      })
      .expect(201);

    const body = res.body as {
      data: {
        id: string;
        name: string;
        species: string;
        personality: string;
        learningGoal: string;
      };
    };
    expect(body.data.name).toBe('Finny');
    expect(body.data.species).toBe('CAT');
    expect(body.data.personality).toBe('Curious saver');
    expect(body.data.learningGoal).toBe('Emergency Fund');
  });

  it('6. GET /pets/me returns the created Pet', async () => {
    const res = await request(app.getHttpServer())
      .get('/pets/me')
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    const body = res.body as { data: { name: string; species: string } };
    expect(body.data.name).toBe('Finny');
    expect(body.data.species).toBe('CAT');
  });

  it('7. Creating a second Pet is rejected with 409 Conflict', async () => {
    await request(app.getHttpServer())
      .post('/pets')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ name: 'Finny 2', species: 'DOG' })
      .expect(409);
  });

  it('8. PATCH /pets/me updates allowed fields', async () => {
    const res = await request(app.getHttpServer())
      .patch('/pets/me')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Finny Star',
        learningGoal: 'Mastering Compound Interest',
      })
      .expect(200);

    const body = res.body as {
      data: { name: string; learningGoal: string };
    };
    expect(body.data.name).toBe('Finny Star');
    expect(body.data.learningGoal).toBe('Mastering Compound Interest');
  });

  it('9. GET confirms persistence of updated Pet fields', async () => {
    const res = await request(app.getHttpServer())
      .get('/pets/me')
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    const body = res.body as {
      data: { name: string; learningGoal: string };
    };
    expect(body.data.name).toBe('Finny Star');
    expect(body.data.learningGoal).toBe('Mastering Compound Interest');
  });

  it('10. Unexpected or forbidden fields are rejected with 400', async () => {
    await request(app.getHttpServer())
      .patch('/pets/me')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ userId: '00000000-0000-0000-0000-000000000000' })
      .expect(400);

    await request(app.getHttpServer())
      .patch('/pets/me')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ role: 'ADMIN' })
      .expect(400);
  });

  it('11. Another USER (User 2) with no Pet receives 404 and cannot read User 1 Pet', async () => {
    await request(app.getHttpServer())
      .get('/pets/me')
      .set('Authorization', `Bearer ${user2Token}`)
      .expect(404);
  });

  it('12. Another USER (User 2) cannot update User 1 Pet', async () => {
    await request(app.getHttpServer())
      .patch('/pets/me')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ name: 'Hacked Name' })
      .expect(404);
  });

  it('13. Pet is isolated and not accepted as a Craft input', async () => {
    await request(app.getHttpServer())
      .post('/craft/preview')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ elementIds: ['pet-id-123', 'pet-id-456'] })
      .expect(400);
  });
});
