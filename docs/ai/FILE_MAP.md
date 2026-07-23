# FILE_MAP.md — Project Structure & Key File Map

This document lists key project files and their purpose.

## Root directory structure

```text
fincraft-lab/
├── AGENTS.md                  # Canonical rules for all AI tools (ALWAYS READ FIRST)
├── GEMINI.md                  # Gemini adapter (points to AGENTS.md)
├── CLAUDE.md                  # Claude adapter (points to AGENTS.md)
├── .agents/skills/            # Agent skills directory
│   └── fincraft-teacher-stepwise-loop/SKILL.md
├── docs/ai/                   # Shared AI documentation
│   ├── CURRENT_STATUS.md      # Latest verified state
│   ├── FILE_MAP.md            # This file
│   ├── PROJECT_CONTEXT.md     # Product context
│   ├── CODING_RULES.md        # Comprehensive coding rules
│   ├── STEPWISE_WORKFLOW.md   # Stepwise development rules
│   ├── plans/                 # Architectural plans
│   │   ├── CORE_CONTENT_SEED_PLAN.md # Seed plan (v1 categories, starter/discovery elements, frozen starter element details v2, frozen discovery details batch a v1, frozen discovery details batch b v1, frozen core craft recipes v1)
│   │   ├── CRAFT_API_PLAN.md  # Frozen Craft API V1 contract plan (POST /craft)
│   │   ├── CRAFT_SERVICE_IMPLEMENTATION_PLAN.md # Frozen CraftService implementation plan (No-Spec policy, Postman deliverable P6_CRAFT_API_POSTMAN_RUNTIME_ACCEPTANCE_001, exact transaction boundary & 1-retry concurrency strategy)
│   │   ├── AVAILABLE_ELEMENTS_API_PLAN.md # Available Elements API plan
│   │   └── AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md # Auth refactor plan
│   └── evidence/              # Verification & acceptance evidence
│       ├── CRAFT_API_RUNTIME_ACCEPTANCE.md # Runtime acceptance report for POST /craft against real PostgreSQL
│       └── AVAILABLE_ELEMENTS_API_RUNTIME_ACCEPTANCE.md # Runtime acceptance report for GET /elements against real PostgreSQL
├── fincraft-lab-api/          # NestJS backend root
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma 7.8 schema (PostgreSQL)
│   │   ├── seed.ts            # Seed main runner script (in-memory validation -> seed categories -> seed elements -> seed starter details -> seed batch a details -> seed batch b details -> seed core craft recipes -> verifications)
│   │   └── seed/
│   │       ├── seed-client.ts # Standalone PrismaClient factory for seeding
│   │       ├── seed-manifest.ts # Seed manifest constants & counts (36 details, 22 recipes, 44 inputs total)
│   │       ├── validate-seed.ts # In-memory pre-write validation for categories, elements, starter details, batch a details & batch b details
│   │       ├── validate-craft-recipe-seed.ts # In-memory pre-write validation for 22 Core Craft Recipes & progression graph
│   │       ├── verify-seed.ts # Post-seed database verifications & protected table count check
│   │       ├── verify-craft-recipe-seed.ts # Post-seed database verifications for 22 Core Craft Recipes (44 Inputs)
│   │       ├── content/
│   │       │   ├── categories.ts                        # 8 Category Seed Inputs
│   │       │   ├── starter-elements.ts                  # 14 Starter Element Seed Inputs
│   │       │   ├── discovery-elements.ts                # 22 Discovery Element Seed Inputs
│   │       │   ├── starter-element-details.ts           # 14 Starter Element DiscoveryDetail Seed Inputs (FROZEN V2)
│   │       │   ├── discovery-element-details-batch-a.ts # 11 Discovery Element DiscoveryDetail Seed Inputs Batch A (FROZEN V1)
│   │       │   ├── discovery-element-details-batch-b.ts # 11 Discovery Element DiscoveryDetail Seed Inputs Batch B (FROZEN V1)
│   │       │   └── core-craft-recipes.ts                # 22 Core Craft Recipe Seed Inputs (FROZEN V1)
│   │       └── steps/
│   │           ├── seed-categories.ts                   # Step 1: Category upserts
│   │           ├── seed-elements.ts                     # Step 2: Element upserts with category resolution
│   │           ├── seed-discovery-details.ts            # Step 3: DiscoveryDetail upserts with element resolution
│   │           └── seed-craft-recipes.ts                # Step 4: Core Craft Recipe upserts with SHA-256 canonical hashing
│   ├── src/
│   │   ├── main.ts            # App entry point
│   │   ├── app.module.ts      # Root module
│   │   ├── common/
│   │   │   └── craft/
│   │   │       └── calculate-craft-input-hash.ts # Pure SHA-256 Craft Input Identity Helper
│   │   ├── craft/
│   │   │   ├── dto/
│   │   │   │   └── craft-request.dto.ts # Request DTO validating inputElementIds for POST /craft
│   │   │   ├── helpers/
│   │   │   │   └── craft-prisma-error.helper.ts # P2002 unique constraint classifier & ExpectedUserElementRaceError
│   │   │   ├── mappers/
│   │   │   │   └── craft-response.mapper.ts # Pure mapping from selected Craft data to safe public CraftResult shapes
│   │   │   ├── parsers/
│   │   │   │   └── craft-sources.parser.ts # Pure runtime validator for DiscoveryDetail.sources Json converting to CraftSourceResponse[]
│   │   │   ├── types/
│   │   │   │   ├── craft-response.type.ts # Public CraftService result contract types (CraftResult discriminated union)
│   │   │   │   └── craft-service.type.ts # Service-internal structural input & transaction result types
│   │   │   ├── craft.controller.ts # Thin authenticated HTTP boundary for POST /craft
│   │   │   ├── craft.module.ts # NestJS module declaring CraftController & CraftService, wiring DatabaseModule
│   │   │   └── craft.service.ts # Core Craft business logic, User/Input/Recipe validation, transactions, & P2002 retry
│   │   ├── prisma/            # Global Prisma module & service
│   │   ├── auth/              # Auth module (register, login, me endpoints)
│   │   ├── users/             # User persistence & management
│   │   ├── bcrypt/            # Password hashing service
│   │   ├── access-token/      # JwtService wrapper
│   │   └── health/            # Health check endpoint
│   └── test/                  # E2E tests
└── fincraft-lab-web/          # Next.js frontend root (not yet initialized)
```

## Key file responsibilities

- `AGENTS.md` — Single canonical source of truth for all AI tools.
- `docs/ai/plans/CORE_CONTENT_SEED_PLAN.md` — Contains 8 categories, 14 starter elements, 22 discovery elements, 14 frozen Starter Element DiscoveryDetails (`FROZEN_STARTER_ELEMENT_DETAILS_SOURCE_VERIFIED_V2`), 11 frozen Discovery Element DiscoveryDetails Batch A (`FROZEN_DISCOVERY_DETAILS_BATCH_A_SOURCE_VERIFIED_V1`), 11 frozen Discovery Element DiscoveryDetails Batch B (`FROZEN_DISCOVERY_DETAILS_BATCH_B_SOURCE_VERIFIED_V1`), and 22 frozen Core Craft Recipes V1 (`FROZEN_CORE_CRAFT_RECIPES_VALIDATED_V1`).
- `fincraft-lab-api/src/common/craft/calculate-craft-input-hash.ts` — Pure SHA-256 Craft Input Identity Helper (deterministic, commutative, zero-dependency).
- `fincraft-lab-api/prisma/seed/content/core-craft-recipes.ts` — 22 `CraftRecipeSeedInput` records copied 1:1 from `FROZEN_CORE_CRAFT_RECIPES_VALIDATED_V1`.
- `fincraft-lab-api/prisma/seed/steps/seed-craft-recipes.ts` — Step 4 runner resolving element IDs, generating SHA-256 hashes, and upserting 22 CraftRecipes and 44 CraftRecipeInputs.
- `fincraft-lab-api/prisma/seed/content/discovery-element-details-batch-a.ts` — 11 `DiscoveryElementDetailSeedInput` records copied 1:1 from `FROZEN_DISCOVERY_DETAILS_BATCH_A_SOURCE_VERIFIED_V1`.
- `fincraft-lab-api/prisma/seed/content/discovery-element-details-batch-b.ts` — 11 `DiscoveryElementDetailSeedInput` records copied 1:1 from `FROZEN_DISCOVERY_DETAILS_BATCH_B_SOURCE_VERIFIED_V1`.
- `fincraft-lab-api/prisma/seed/steps/seed-discovery-details.ts` — Implements `seedDiscoveryDetailsStep()` for `DiscoveryDetail` upserts.
- `fincraft-lab-api/prisma/seed.ts` — Main seed runner implementing in-memory pre-write validation, element category upsert, starter & discovery element upsert, starter detail upsert, Batch A detail upsert, Batch B detail upsert, and post-seed database verification.
