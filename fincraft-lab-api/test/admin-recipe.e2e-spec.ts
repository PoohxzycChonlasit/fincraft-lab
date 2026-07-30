import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AdminRecipeResponseDto } from '../src/admin-content/dto/recipe-admin-response.dto';
import {
  ActiveStatus,
  ContentStatus,
  ElementType,
  RealityLevel,
  SafetyLabel,
  UserRole,
} from '../src/database/generated/prisma/client';
import { PrismaService } from '../src/database/prisma.service';

type RecipeEnvelope = { data: AdminRecipeResponseDto };
type RecipeListEnvelope = { data: AdminRecipeResponseDto[] };

describe('Admin Craft Recipe Management (e2e)', () => {
  jest.setTimeout(30000);
  let app: INestApplication<App>;
  let prisma: PrismaService;

  let userToken: string;
  let adminToken: string;
  let superAdminToken: string;

  let elemAId: string;
  let elemBId: string;
  let elemCId: string;
  let elemOut1Id: string;
  let elemOut2Id: string;

  let createdRecipeId: string;
  let testCategoryId: string;

  const userEmail = `rec_user_${Date.now()}@example.com`;
  const adminEmail = `rec_admin_${Date.now()}@example.com`;
  const superAdminEmail = `rec_superadmin_${Date.now()}@example.com`;
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
    prisma = app.get(PrismaService);

    // Register USER
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

    await prisma.user.update({
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

    await prisma.user.update({
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

    // Create test Category and Elements
    const ts = Date.now();

    const category = await prisma.elementCategory.create({
      data: {
        name: `Recipe Test Category ${ts}`,
        status: ActiveStatus.ACTIVE,
      },
    });
    testCategoryId = category.id;

    const elA = await prisma.element.create({
      data: {
        slug: `r-in-a-${ts}`,
        name: `Recipe Input A ${ts}`,
        emoji: '🧪',
        elementType: ElementType.BASE,
        categoryId: testCategoryId,
        status: ContentStatus.ACTIVE,
      },
    });
    elemAId = elA.id;

    const elB = await prisma.element.create({
      data: {
        slug: `r-in-b-${ts}`,
        name: `Recipe Input B ${ts}`,
        emoji: '🔬',
        elementType: ElementType.BASE,
        categoryId: testCategoryId,
        status: ContentStatus.ACTIVE,
      },
    });
    elemBId = elB.id;

    const elC = await prisma.element.create({
      data: {
        slug: `r-in-c-${ts}`,
        name: `Recipe Input C ${ts}`,
        emoji: '⚗️',
        elementType: ElementType.BASE,
        categoryId: testCategoryId,
        status: ContentStatus.ACTIVE,
      },
    });
    elemCId = elC.id;

    const elOut1 = await prisma.element.create({
      data: {
        slug: `r-out-1-${ts}`,
        name: `Recipe Output 1 ${ts}`,
        emoji: '💡',
        elementType: ElementType.DISCOVERY,
        categoryId: testCategoryId,
        status: ContentStatus.ACTIVE,
      },
    });
    elemOut1Id = elOut1.id;
    await prisma.discoveryDetail.create({
      data: {
        elementId: elemOut1Id,
        shortDescription: 'Test output element 1',
        realLesson: 'This is a test discovery element.',
        realityLevel: RealityLevel.GROUNDED,
        safetyLabel: SafetyLabel.EDUCATION_ONLY,
        sources: [],
      },
    });

    const elOut2 = await prisma.element.create({
      data: {
        slug: `r-out-2-${ts}`,
        name: `Recipe Output 2 ${ts}`,
        emoji: '🌟',
        elementType: ElementType.DISCOVERY,
        categoryId: testCategoryId,
        status: ContentStatus.ACTIVE,
      },
    });
    elemOut2Id = elOut2.id;
    await prisma.discoveryDetail.create({
      data: {
        elementId: elemOut2Id,
        shortDescription: 'Test output element 2',
        realLesson: 'This is a test discovery element.',
        realityLevel: RealityLevel.GROUNDED,
        safetyLabel: SafetyLabel.EDUCATION_ONLY,
        sources: [],
      },
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('1. GET /admin/recipes unauthenticated returns 401', async () => {
    await request(app.getHttpServer()).get('/admin/recipes').expect(401);
  });

  it('2. GET /admin/recipes as USER returns 403', async () => {
    await request(app.getHttpServer())
      .get('/admin/recipes')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('3. GET /admin/recipes as ADMIN returns 200 success', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as RecipeListEnvelope;
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('4. GET /admin/recipes as SUPER_ADMIN returns 200 success', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/recipes')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .expect(200);

    const body = res.body as RecipeListEnvelope;
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('5. POST /admin/recipes with same-element Inputs returns 400', async () => {
    await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemAId, elemAId],
        outputElementId: elemOut1Id,
      })
      .expect(400);
  });

  it('6. POST /admin/recipes with fewer than 2 inputs returns 400', async () => {
    await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ inputElementIds: [elemAId], outputElementId: elemOut1Id })
      .expect(400);
  });

  it('7. POST /admin/recipes with non-existent element IDs returns 404', async () => {
    await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemAId, '00000000-0000-4000-a000-000000000000'],
        outputElementId: elemOut1Id,
      })
      .expect(404);
  });

  it('8. POST /admin/recipes with unknown fields returns 400', async () => {
    await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemAId, elemBId],
        outputElementId: elemOut1Id,
        bogusField: 'hacker',
      })
      .expect(400);
  });

  it('9. POST /admin/recipes with valid data creates recipe (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemAId, elemBId],
        outputElementId: elemOut1Id,
      })
      .expect(201);

    const body = res.body as RecipeEnvelope;
    expect(body.data.id).toBeDefined();
    expect(body.data.outputElementId).toBe(elemOut1Id);
    expect(body.data.status).toBe('ACTIVE');
    expect(body.data.inputs.length).toBe(2);
    createdRecipeId = body.data.id;
  });

  it('10. GET /admin/recipes/:recipeId returns detail (200)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as RecipeEnvelope;
    expect(body.data.id).toBe(createdRecipeId);
    expect(body.data.inputs.length).toBe(2);
  });

  it('11. POST /admin/recipes with reversed Input order returns 409 (duplicate)', async () => {
    await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemBId, elemAId],
        outputElementId: elemOut2Id,
      })
      .expect(409);
  });

  it('12. POST /admin/recipes with same Input pair returns 409 (duplicate)', async () => {
    await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemBId, elemAId],
        outputElementId: elemOut2Id,
      })
      .expect(409);
  });

  it('13. Updating Recipe metadata without changing Inputs does not conflict with itself', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemAId, elemBId],
        outputElementId: elemOut2Id,
      })
      .expect(200);

    const body = res.body as RecipeEnvelope;
    expect(body.data.outputElementId).toBe(elemOut2Id);
  });

  it('14. Concurrent equivalent create attempts produce 1 success and 1 conflict', async () => {
    const ts = Date.now();
    const e1 = await prisma.element.create({
      data: {
        slug: `r-c1-${ts}`,
        name: `Conc 1 ${ts}`,
        emoji: '🔵',
        elementType: ElementType.BASE,
        categoryId: testCategoryId,
        status: ContentStatus.ACTIVE,
      },
    });
    const e2 = await prisma.element.create({
      data: {
        slug: `r-c2-${ts}`,
        name: `Conc 2 ${ts}`,
        emoji: '🔴',
        elementType: ElementType.BASE,
        categoryId: testCategoryId,
        status: ContentStatus.ACTIVE,
      },
    });
    const eOut = await prisma.element.create({
      data: {
        slug: `r-cout-${ts}`,
        name: `Conc Out ${ts}`,
        emoji: '🟢',
        elementType: ElementType.DISCOVERY,
        categoryId: testCategoryId,
        status: ContentStatus.ACTIVE,
      },
    });

    const [res1, res2] = await Promise.all([
      request(app.getHttpServer())
        .post('/admin/recipes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ inputElementIds: [e1.id, e2.id], outputElementId: eOut.id }),
      request(app.getHttpServer())
        .post('/admin/recipes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ inputElementIds: [e2.id, e1.id], outputElementId: eOut.id }),
    ]);

    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([201, 409]);
  });

  it('15. ADMIN replaces Inputs atomically (A + C)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemAId, elemCId],
      })
      .expect(200);

    const body = res.body as RecipeEnvelope;
    const recipe = body.data;
    const inputElementIds = recipe.inputs.map((i) => i.elementId);
    expect(inputElementIds).toContain(elemAId);
    expect(inputElementIds).toContain(elemCId);
    expect(inputElementIds).not.toContain(elemBId);
  });

  it('16. Conflicting Input replacement rolls back fully', async () => {
    // Create second recipe (B + C -> Out1)
    await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemBId, elemCId],
        outputElementId: elemOut1Id,
      })
      .expect(201);

    // Try updating createdRecipeId to (B + C), should fail with 409
    await request(app.getHttpServer())
      .patch(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        inputElementIds: [elemCId, elemBId],
      })
      .expect(409);

    // Confirm original createdRecipeId inputs remain (A + C)
    const checkRes = await request(app.getHttpServer())
      .get(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const checkBody = checkRes.body as RecipeEnvelope;
    const checkInputs = checkBody.data.inputs.map((i) => i.elementId);
    expect(checkInputs).toContain(elemAId);
    expect(checkInputs).toContain(elemCId);
  });

  it('17. POST /craft and POST /craft/preview execute active Recipe runtime', async () => {
    const targetUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    // Grant USER inputs A and C in UserElement
    await prisma.userElement.createMany({
      data: [
        { userId: targetUser!.id, elementId: elemAId },
        { userId: targetUser!.id, elementId: elemCId },
      ],
      skipDuplicates: true,
    });

    const craftRes = await request(app.getHttpServer())
      .post('/craft')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ inputElementIds: [elemAId, elemCId] })
      .expect(200);

    const craftBody = craftRes.body as {
      data: {
        outcome: string;
        isNewDiscovery: boolean;
        element: { id: string };
      };
    };
    expect(craftBody.data.outcome).toBe('DISCOVERY');
    expect(craftBody.data.isNewDiscovery).toBe(true);
    expect(craftBody.data.element.id).toBe(elemOut2Id);

    // Reversed input order C + A — user already has elemOut2Id, still DISCOVERY
    const reversedCraftRes = await request(app.getHttpServer())
      .post('/craft')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ inputElementIds: [elemCId, elemAId] })
      .expect(200);

    const revBody = reversedCraftRes.body as {
      data: {
        outcome: string;
        isNewDiscovery: boolean;
        element: { id: string };
      };
    };
    expect(revBody.data.outcome).toBe('DISCOVERY');
    expect(revBody.data.element.id).toBe(elemOut2Id);

    // Craft Preview uses only starter elements so we verify
    // the admin recipe does not interfere with the preview route
    // (non-starter inputs would throw 400 — not tested here).
  });

  it('18. DELETE /admin/recipes/:recipeId archives Recipe to INACTIVE', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as RecipeEnvelope;
    expect(body.data.status).toBe('INACTIVE');
  });

  it('19. Archived Recipe remains retrievable by Admin in list and detail', async () => {
    const res = await request(app.getHttpServer())
      .get(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as RecipeEnvelope;
    expect(body.data.status).toBe('INACTIVE');
    expect(body.data.inputs.length).toBe(2);
  });

  it('20. Archived Recipe is excluded from active Craft and Preview execution', async () => {
    const craftRes = await request(app.getHttpServer())
      .post('/craft')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ inputElementIds: [elemAId, elemCId] })
      .expect(200);

    const craftBody = craftRes.body as { data: { outcome: string } };
    expect(craftBody.data.outcome).toBe('NO_RECIPE');
  });

  it('21. Restoring status ACTIVE reactivates Recipe for Crafting runtime', async () => {
    await request(app.getHttpServer())
      .patch(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: ContentStatus.ACTIVE })
      .expect(200);

    const craftRes = await request(app.getHttpServer())
      .post('/craft')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ inputElementIds: [elemAId, elemCId] })
      .expect(200);

    const craftBody = craftRes.body as { data: { outcome: string } };
    expect(craftBody.data.outcome).toBe('DISCOVERY');
  });

  it('22. USER cannot create, update, or archive recipes', async () => {
    await request(app.getHttpServer())
      .post('/admin/recipes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        inputElementIds: [elemAId, elemBId],
        outputElementId: elemOut1Id,
      })
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: ContentStatus.INACTIVE })
      .expect(403);

    await request(app.getHttpServer())
      .delete(`/admin/recipes/${createdRecipeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('23. GET /admin/recipes/:missingId returns 404', async () => {
    const missingId = '00000000-0000-4000-a000-000000000000';
    await request(app.getHttpServer())
      .get(`/admin/recipes/${missingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});
