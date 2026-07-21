# ElementCategory CRUD Implementation Plan

## 1. Objective

Plan the implementation of the first feature module in FinCraft Lab API: **ElementCategory CRUD**. 

This plan defines the module architecture, API routes, request/response contracts, data validation rules, database query strategy, error handling, and a strict endpoint-by-endpoint implementation sequence. 

No source code is implemented in this task (`P4A_PLAN_ELEMENT_CATEGORY_CRUD_001`). Implementation will proceed one bounded endpoint at a time starting with `GET /element-categories` in step `P4B.1`.

## 2. Current Database Model

The Prisma model `ElementCategory` is defined in `prisma/schema.prisma` as follows:

```prisma
model ElementCategory {
  id          String        @id @default(uuid()) @db.Uuid
  name        String        @unique
  description String?
  sortOrder   Int           @default(0) @map("sort_order")
  status      ActiveStatus  @default(ACTIVE)
  createdAt   DateTime      @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime      @updatedAt @map("updated_at") @db.Timestamptz(6)

  elements Element[]

  @@map("element_categories")
}
```

### Key Schema Characteristics
- **Table Name**: `element_categories`
- **Primary Key**: `id` (UUID v4)
- **Unique Fields**: `name`
- **Enum Status**: `ActiveStatus` (`ACTIVE` | `INACTIVE`)
- **Relation**: 1-to-many relationship with `Element` (`Element[]`)

## 3. Planned API Contract

| HTTP Method | Route | Description | Expected Status Codes |
|---|---|---|---|
| `GET` | `/element-categories` | List element categories (default: `ACTIVE` only, sorted by `sortOrder` ASC, `name` ASC) | `200 OK`, `400 Bad Request` |
| `GET` | `/element-categories/:id` | Get single category by UUID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/element-categories` | Create new category (default status `ACTIVE`) | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `PATCH` | `/element-categories/:id` | Partially update category details or lifecycle status | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |

*Note: No `DELETE` endpoint is provided for master data. Archiving/deactivation is handled via `PATCH /element-categories/:id` setting `status: "INACTIVE"`.*

## 4. Request & Response Shapes

### Response Envelope Decision
All API responses use a top-level JSON object envelope wrapping data under `"data"` for consistency across FinCraft Lab API:

#### Collection Response (`GET /element-categories`)
```json
{
  "data": [
    {
      "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "name": "Income & Cashflow",
      "description": "Elements related to active, passive, and earned income streams",
      "sortOrder": 1,
      "status": "ACTIVE",
      "createdAt": "2026-07-21T12:00:00.000Z",
      "updatedAt": "2026-07-21T12:00:00.000Z"
    }
  ]
}
```

#### Empty Collection Response
```json
{
  "data": []
}
```

#### Single Entity Response (`GET /element-categories/:id`, `POST /element-categories`, `PATCH /element-categories/:id`)
```json
{
  "data": {
    "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "name": "Income & Cashflow",
    "description": "Elements related to active, passive, and earned income streams",
    "sortOrder": 1,
    "status": "ACTIVE",
    "createdAt": "2026-07-21T12:00:00.000Z",
    "updatedAt": "2026-07-21T12:00:00.000Z"
  }
}
```

## 5. Request DTOs & Validation Rules

### 5.1 `ListElementCategoriesQueryDto` (`GET /element-categories`)
- `status` (Optional Enum: `ACTIVE` | `INACTIVE`): Filter categories by status. If omitted, default query returns `status = ACTIVE` only. To view all categories regardless of status, client can query with explicit status parameter if requested, but default is `ACTIVE`.

### 5.2 `CreateElementCategoryDto` (`POST /element-categories`)
- `name` (Required String):
  - Must be string (`@IsString()`)
  - Trimmed automatically via `@Transform(({ value }) => typeof value === 'string' ? value.trim() : value)`
  - Cannot be empty after trimming (`@IsNotEmpty()`)
  - Max length 100 chars (`@MaxLength(100)`)
- `description` (Optional String):
  - Must be string if present (`@IsOptional()`, `@IsString()`)
  - Trimmed automatically
  - Max length 500 chars (`@MaxLength(500)`)
- `sortOrder` (Optional Integer):
  - Must be integer (`@IsOptional()`, `@IsInt()`)
  - Minimum value `0` (`@Min(0)`)
  - Default: `0` if omitted

### 5.3 `UpdateElementCategoryDto` (`PATCH /element-categories/:id`)
- `name` (Optional String): Same rules as Create DTO
- `description` (Optional String): Same rules as Create DTO
- `sortOrder` (Optional Integer): Same rules as Create DTO
- `status` (Optional Enum): `@IsOptional()`, `@IsEnum(ActiveStatus)`

*At least one field must be provided in PATCH body; empty body will yield `400 Bad Request`.*

## 6. HTTP Error Mapping

| HTTP Status | Trigger Condition | Response Body Structure |
|---|---|---|
| `400 Bad Request` | Invalid UUID path param, failed DTO validation, empty PATCH payload | `{ "statusCode": 400, "message": [...], "error": "Bad Request" }` |
| `404 Not Found` | Category ID does not exist in database | `{ "statusCode": 404, "message": "ElementCategory with ID '<uuid>' not found", "error": "Not Found" }` |
| `409 Conflict` | Category name already exists (Prisma `P2002` constraint error) | `{ "statusCode": 409, "message": "ElementCategory with name '<name>' already exists", "error": "Conflict" }` |
| `500 Internal Error` | Unexpected runtime error | `{ "statusCode": 500, "message": "Internal server error" }` |

## 7. Prisma Query Plan

- **List Query**:
  ```ts
  this.prisma.elementCategory.findMany({
    where: { status: filterStatus ?? ActiveStatus.ACTIVE },
    orderBy: [
      { sortOrder: 'asc' },
      { name: 'asc' }
    ]
  });
  ```
- **Find Unique Query**:
  ```ts
  this.prisma.elementCategory.findUnique({
    where: { id }
  });
  ```
- **Create Query**:
  ```ts
  this.prisma.elementCategory.create({
    data: { name, description, sortOrder: sortOrder ?? 0 }
  });
  ```
- **Update Query**:
  ```ts
  this.prisma.elementCategory.update({
    where: { id },
    data: updateData
  });
  ```

## 8. Open Planning Decisions Resolved

1. **Category Name Case-Sensitivity**: PostgreSQL default text comparison for `@unique` index is case-sensitive (`Income` != `income`). For MVP, we use Prisma standard `@unique` behavior. Duplicate check is handled cleanly via catching Prisma `P2002` error.
2. **Trimming Location**: Whitespace trimming occurs in DTO transformation (`class-transformer` `@Transform`) before reaching service logic.
3. **Max Lengths**: `name` max 100 characters; `description` max 500 characters.
4. **SortOrder Boundary**: `sortOrder` must be a non-negative integer (`>= 0`).
5. **Default Status Filtering**: `GET /element-categories` hides `INACTIVE` categories by default unless query parameter `status` is explicitly passed.
6. **Authentication & Authorization**: Deferred until Auth feature module is built in later steps. Endpoints remain public for MVP foundation.
7. **No Repository Layer**: Controller calls `ElementCategoriesService` directly; `ElementCategoriesService` calls `PrismaService` directly.
8. **No Pagination Infrastructure**: Not required for ElementCategory MVP because total master categories count is small (< 50 items).

## 9. File Structure

```text
fincraft-lab-api/src/element-categories/
├── dto/
│   ├── create-element-category.dto.ts
│   ├── update-element-category.dto.ts
│   └── list-element-categories-query.dto.ts
├── element-categories.controller.ts
├── element-categories.service.ts
└── element-categories.module.ts
```

## 10. Endpoint-by-Endpoint Implementation Sequence

- **P4B.1**: Scaffolding Module & Implement `GET /element-categories` (List)
  - Generate module, controller, service with `--no-spec`
  - Implement `findAll` in service with stable sorting (`sortOrder` ASC, `name` ASC)
  - Implement `GET /element-categories` in controller returning `{ data: [] }`
  - Register `ElementCategoriesModule` in `AppModule`
  - Verify empty database returns `200 OK` with `{ data: [] }`
- **P4B.2**: Implement `GET /element-categories/:id` (Get One)
  - Add `findOne` in service with `ParseUUIDPipe` and 404 exception handling
- **P4B.3**: Implement `POST /element-categories` (Create)
  - Add `CreateElementCategoryDto` validation
  - Add `create` in service with Prisma `P2002` exception catch returning 409 Conflict
- **P4B.4**: Implement `PATCH /element-categories/:id` (Update / Lifecycle Status)
  - Add `UpdateElementCategoryDto` validation
  - Add `update` in service with 404/409 handling
- **P4B.5**: Full Feature Verification
  - End-to-end verification of creation, duplicate handling, status filtering (`ACTIVE`/`INACTIVE`), and verification checks.

## 11. Verification Checklist

- [ ] Nest CLI commands executed with `--no-spec`
- [ ] No `*.spec.ts` files created
- [ ] `pnpm build` compiles cleanly
- [ ] `pnpm lint` has 0 errors
- [ ] `pnpm test` (3/3 unit tests pass)
- [ ] `pnpm test:e2e` (2/2 e2e tests pass)
- [ ] HTTP probe via `Invoke-WebRequest` succeeds with expected envelope `{ "data": ... }`
- [ ] Database state inspected via read-only check script
- [ ] Local git checkpoint created and documented

## 12. Out-of-Scope Items

- No NestJS feature files created in this task (`P4A`).
- No database table modification or migration.
- No `DELETE` route.
- No seed data insertion.
- No authentication guards or roles decorators.
- No repository pattern or abstract base classes.
