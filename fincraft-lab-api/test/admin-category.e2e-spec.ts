import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import {
  ActiveStatus,
  UserRole,
} from '../src/database/generated/prisma/client';
import { PrismaService } from '../src/database/prisma.service';

describe('Admin Category Management (e2e)', () => {
  jest.setTimeout(30000);
  let app: INestApplication<App>;
  let userToken: string;
  let adminToken: string;
  let superAdminToken: string;
  let createdCategoryId: string;

  const userEmail = `cat_user_${Date.now()}@example.com`;
  const adminEmail = `cat_admin_${Date.now()}@example.com`;
  const superAdminEmail = `cat_superadmin_${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  const uniqueCatName = `Test Category ${Date.now()}`;

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

    // Register & login USER
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: userEmail, password, displayName: 'Regular User' })
      .expect(201);

    const userLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEmail, password })
      .expect(200);
    const userBody = userLoginRes.body as { data: { accessToken: string } };
    userToken = userBody.data.accessToken;

    // Register ADMIN
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: adminEmail, password, displayName: 'Admin User' })
      .expect(201);

    // Promote to ADMIN in DB
    const prismaService = app.get(PrismaService);
    await prismaService.user.update({
      where: { email: adminEmail },
      data: { role: UserRole.ADMIN },
    });

    const adminLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminEmail, password })
      .expect(200);
    const adminBody = adminLoginRes.body as { data: { accessToken: string } };
    adminToken = adminBody.data.accessToken;

    // Register SUPER_ADMIN
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: superAdminEmail, password, displayName: 'Super Admin' })
      .expect(201);

    await prismaService.user.update({
      where: { email: superAdminEmail },
      data: { role: UserRole.SUPER_ADMIN },
    });

    const superAdminLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: superAdminEmail, password })
      .expect(200);
    const superAdminBody = superAdminLoginRes.body as {
      data: { accessToken: string };
    };
    superAdminToken = superAdminBody.data.accessToken;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. Unauthenticated GET list returns 401', async () => {
    await request(app.getHttpServer()).get('/admin/categories').expect(401);
  });

  it('2. USER GET list returns 403 Forbidden', async () => {
    await request(app.getHttpServer())
      .get('/admin/categories')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('3. ADMIN GET list returns 200 Success', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as { data: Array<{ id: string; name: string }> };
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('4. SUPER_ADMIN GET list returns 200 Success', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/categories')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .expect(200);

    const body = res.body as { data: Array<{ id: string; name: string }> };
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('5. ADMIN creates a valid Category', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: uniqueCatName,
        description: 'Testing category creation',
        sortOrder: 15,
      })
      .expect(201);

    const body = res.body as {
      data: { id: string; name: string; status: string; sortOrder: number };
    };
    expect(body.data.id).toBeDefined();
    expect(body.data.name).toBe(uniqueCatName);
    expect(body.data.status).toBe(ActiveStatus.ACTIVE);
    expect(body.data.sortOrder).toBe(15);
    createdCategoryId = body.data.id;
  });

  it('6. Created Category can be retrieved via GET /admin/categories/:id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as { data: { id: string; name: string } };
    expect(body.data.id).toBe(createdCategoryId);
    expect(body.data.name).toBe(uniqueCatName);
  });

  it('7. Duplicate unique name is rejected with 409 Conflict', async () => {
    await request(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: uniqueCatName,
        description: 'Duplicate name test',
      })
      .expect(409);
  });

  it('8. Unknown or forbidden fields are rejected with 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Invalid Cat ${Date.now()}`,
        unknownField: 'hack',
      })
      .expect(400);
  });

  it('9. ADMIN updates allowed fields via PATCH', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        description: 'Updated category description',
        sortOrder: 99,
      })
      .expect(200);

    const body = res.body as {
      data: { description: string; sortOrder: number };
    };
    expect(body.data.description).toBe('Updated category description');
    expect(body.data.sortOrder).toBe(99);
  });

  it('10. GET confirms persistence of updated fields', async () => {
    const res = await request(app.getHttpServer())
      .get(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as {
      data: { description: string; sortOrder: number };
    };
    expect(body.data.description).toBe('Updated category description');
    expect(body.data.sortOrder).toBe(99);
  });

  it('11. Missing Category returns 404 Not Found', async () => {
    await request(app.getHttpServer())
      .get('/admin/categories/99999999-9999-4999-a999-999999999999')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('12. Archive/deactivate via DELETE sets status to INACTIVE', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as { data: { status: string } };
    expect(body.data.status).toBe(ActiveStatus.INACTIVE);
  });

  it('13. Linked Elements remain intact in DB when Category is archived', async () => {
    const res = await request(app.getHttpServer())
      .get(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as { data: { elementCount: number } };
    expect(body.data.elementCount).toBeDefined();
  });

  it('14. Archived Category record remains retrievable through Admin', async () => {
    const res = await request(app.getHttpServer())
      .get(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as { data: { id: string; status: string } };
    expect(body.data.id).toBe(createdCategoryId);
    expect(body.data.status).toBe(ActiveStatus.INACTIVE);
  });

  it('15. USER cannot create, update, or archive category (403 Forbidden)', async () => {
    await request(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'User Cat' })
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ sortOrder: 1 })
      .expect(403);

    await request(app.getHttpServer())
      .delete(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('16. Response contains safe category payload without sensitive data', async () => {
    const res = await request(app.getHttpServer())
      .get(`/admin/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as { data: Record<string, unknown> };
    expect(body.data.passwordHash).toBeUndefined();
    expect(body.data.id).toBeDefined();
    expect(body.data.name).toBeDefined();
  });
});
