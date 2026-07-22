# CURRENT_STATUS.md — Latest Verified Status

This document records only what has been directly verified (evidence-based). Do not trust it blindly in a later task — re-verify with the commands below before starting any work.

## How to re-verify

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## Verified status (updated during P4_AUTH_7_IMPLEMENT_USER_SERVICE_EXTRACTION)

- **Git root**: `C:/devnest 101/single-project/fincraft-lab` (no nested git repositories inside `fincraft-lab-api` or `fincraft-lab-web`)
- **P0 starting checkpoint**: `34117a1` — "P0: scaffold NestJS backend foundation in fincraft-lab-api"
- **Shared agent documentation checkpoint**: `8b2bb9a` / `4b403b1` — AI documentation added and standardized to English
- **P1 checkpoint**: `a17d7f4` — "feat: add backend health endpoint"
- **P2A checkpoint**: `22483f9` — "chore: add Prisma PostgreSQL dependencies"
- **P3A checkpoint**: `9a1939f` — "feat: add FinCraft MVP Prisma foundation"
- **P3B.1 checkpoint**: `809e4b5` — "chore: add initial FinCraft MVP migration"
- **P3B.2 checkpoint**: `a49dff9` — "docs: record initial MVP migration application"
- **P4A checkpoint**: `6193f03` — "docs: plan ElementCategory CRUD"
- **P4_AUTH_1 checkpoint**: `bf46ed2` — "feat: add user registration endpoint"
- **P4_AUTH_2 checkpoint**: `29de3de` — "feat: add user login endpoint"
- **P4_AUTH_3 checkpoint**: `5c01639` — "feat: add global JWT auth guard"
- **P4_AUTH_4 checkpoint**: `8661f8d` — "feat: add current user endpoint"
- **P4_AUTH_5 checkpoint**: `cd910c6` — "feat: add role-based authorization guard"
- **P5_PREP checkpoint**: `8451344` — "docs: align AI agents with teacher coding style"
- **P5_SEED_1 checkpoint**: `66851c0` — "docs: plan core content seed"
- **P5_SEED_2 checkpoint**: `d807255` — "feat: add core seed infrastructure and categories"
- **P4_AUTH_6 checkpoint**: `709594a` — "docs: plan Fakebuck-aligned auth refactor"
- **P4_AUTH_7 checkpoint**: "refactor: extract user persistence from auth" (see git log)

### Backend (`fincraft-lab-api`) — Phase A Fakebuck Auth Refactor Complete

- **Phase A UserService Extraction Implemented**: Created `UserModule`, `UserService` (`src/user/user.service.ts`), and `UserResponseDto` (`src/user/dto/user-response.dto.ts`).
- **Prisma User Persistence & P2002 Error Mapping Moved**: All database queries (`createUser`, `getUserByEmail`, `getUserById`), safe `select` clauses (`userResponseSelect`, `userWithPasswordSelect`), and Prisma `P2002` duplicate email error mapping are owned by `UserService`.
- **`AuthService` Prisma Dependency Removed**: `AuthService` delegates user persistence to `UserService`. `AuthService` contains 0 imports or references to `PrismaService`, `Prisma`, or `this.prisma`.
- **Phase A Boundary Respected**: `AuthService` retains direct `bcrypt` hashing and `JwtService` signing for Phase A. `BcryptService` and `AccessTokenService` are deferred to Phase B (`P4_AUTH_8`).
- **Auth Behavior & Security Invariants Verified**: Verified via 11-step programmatic live HTTP test (Register 201, Duplicate Email 409, Login 200, Wrong Password 401, Unknown Email 401, GET /auth/me 200, INACTIVE 401, BANNED 401, Stale Token 401, Health 200, User count parity).
- **Seeded Content Intact**: 8 Element Categories remain intact in PostgreSQL.

### Frontend (`fincraft-lab-web`)

- Empty, not yet initialized (out of scope).

## Build/Lint/Test — run status

- `pnpm build` — passed
- `pnpm lint` — 0 errors, 1 pre-existing warning in `main.ts` (`@typescript-eslint/no-floating-promises`)
- `pnpm test` — 3/3 unit tests passed (HealthController status, service name, ISO timestamp)
- `pnpm test:e2e` — 2/2 e2e tests passed (`GET /health` -> 200, `GET /` -> 404) via Node VM modules
- Search for unsafe casts (`any`, `as any`, `as unknown`, `@ts-ignore`) in `src/` — 0 matches
- Programmatic 11-step live HTTP verification — passed

## Active Project Rule: No Automatic Unit Spec Generation

Unit spec files are not generated automatically (`--no-spec` for Nest CLI generators, no hand-created unit specs without explicit instruction).

## Next Bounded Step

```text
P4_AUTH_8_IMPLEMENT_HASH_AND_ACCESS_TOKEN_SERVICES_001 — Phase B of Fakebuck Auth Refactor: Create HashModule (BcryptService) and AccessTokenModule (AccessTokenService).
```

## Related documents

- Full file map → [`FILE_MAP.md`](FILE_MAP.md)
- Auth Fakebuck Refactor Plan → [`plans/AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md`](plans/AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md)
- Stepwise loop method → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
