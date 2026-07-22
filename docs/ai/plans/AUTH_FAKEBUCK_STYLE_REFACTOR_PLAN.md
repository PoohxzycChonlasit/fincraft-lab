# AUTH_FAKEBUCK_STYLE_REFACTOR_PLAN.md — Auth Fakebuck-Style Refactor Plan

## 1. Current Problem

The current Auth implementation is functionally complete, fully tested, and secure. However, `AuthService` directly imports `PrismaService`, `PrismaClientKnownRequestError` (`P2002`), `bcrypt`, and `JwtService`. All data access, password hashing, token issuance, and response mapping are combined in a single service file. This differs from the owner's teacher-led Fakebuck project structure, which uses dedicated services (`UserService`, `BcryptService`, `AccessTokenService`).

## 2. Owner's Target Coding Shape

Refactor the Auth architecture to mirror the teacher's Fakebuck project service-boundary pattern:

```text
AuthController
└── AuthService (Coordinator)
    ├── UserService (src/user/)
    ├── BcryptService (src/infrastructure/hash/)
    └── AccessTokenService (src/infrastructure/jwt/)
```

`AuthService` becomes a pure coordinator of register, login, and current-user use cases without direct database, bcrypt, or JWT dependencies.

## 3. Current Dependency Graph

```text
AuthController
  └── AuthService
        ├── PrismaService (Direct DB queries, select, P2002 error handling)
        ├── bcrypt (Direct hash and compare)
        └── JwtService (Direct signAsync)
```

## 4. Target Dependency Graph

```text
AuthController
  └── AuthService (Coordinates register, login, getMe)
        ├── UserService (Prisma queries, select, P2002 mapping)
        │     └── PrismaService
        ├── BcryptService (Password hashing & comparison)
        │     └── bcrypt (12 salt rounds)
        └── AccessTokenService (JWT token creation)
              └── JwtService
```

## 5. Exact Target Folder Tree

```text
fincraft-lab-api/src/
├── auth/
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── login-response.dto.ts
│   │   └── register.dto.ts
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── roles.guard.ts
│   ├── types/
│   │   └── access-token-payload.type.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── user/
│   ├── dto/
│   │   └── user-response.dto.ts
│   ├── user.module.ts
│   └── user.service.ts
└── infrastructure/
    ├── hash/
    │   ├── bcrypt.service.ts
    │   └── hash.module.ts
    └── jwt/
        ├── access-token.service.ts
        └── access-token.module.ts
```

## 6. Exact Files to Create

1. `fincraft-lab-api/src/user/user.module.ts`
2. `fincraft-lab-api/src/user/user.service.ts`
3. `fincraft-lab-api/src/user/dto/user-response.dto.ts`
4. `fincraft-lab-api/src/infrastructure/hash/hash.module.ts`
5. `fincraft-lab-api/src/infrastructure/hash/bcrypt.service.ts`
6. `fincraft-lab-api/src/infrastructure/jwt/access-token.module.ts`
7. `fincraft-lab-api/src/infrastructure/jwt/access-token.service.ts`
8. `fincraft-lab-api/src/auth/dto/login-response.dto.ts`

## 7. Exact Files to Modify

1. `fincraft-lab-api/src/auth/auth.module.ts` (Import `UserModule`, `HashModule`, `AccessTokenModule`; remove direct `JwtModule` and `DatabaseModule` imports)
2. `fincraft-lab-api/src/auth/auth.service.ts` (Inject `UserService`, `BcryptService`, `AccessTokenService`; remove `PrismaService`, `bcrypt`, `JwtService`)
3. `fincraft-lab-api/src/auth/auth.controller.ts` (Update explicit method return types with `UserResponseDto` and `LoginResponseDto`)
4. `fincraft-lab-api/src/auth/guards/auth.guard.ts` (Ensure `JwtService` remains injected via `AccessTokenModule` export)

## 8. Exact Files to Move or Rename

- None. Existing DTOs (`register.dto.ts`, `login.dto.ts`) remain under `src/auth/dto/` to avoid unnecessary import churn.

## 9. Module Imports and Exports

- **`UserModule`**: Imports `DatabaseModule`. Declares and exports `UserService`.
- **`HashModule`**: Declares and exports `BcryptService`.
- **`AccessTokenModule`**: Imports `ConfigModule` & `JwtModule.registerAsync` (with startup config validation). Declares and exports `AccessTokenService` and exports `JwtModule` (providing `JwtService` for `AuthGuard`).
- **`AuthModule`**: Imports `UserModule`, `HashModule`, `AccessTokenModule`. Declares `AuthController`, `AuthService`, and global `APP_GUARD` providers (`AuthGuard`, `RolesGuard`).

## 10. `UserService` Method Contracts

```ts
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: RegisterDto, passwordHash: string): Promise<UserResponseDto>
  async getUserByEmail(email: string): Promise<(UserResponseDto & { passwordHash: string }) | null>
  async getUserById(id: string): Promise<UserResponseDto | null>
}
```

## 11. `BcryptService` Method Contracts

```ts
export class BcryptService {
  private readonly saltRounds = 12;

  async hash(plainText: string): Promise<string>
  async compare(plainText: string, hash: string): Promise<boolean>
}
```

## 12. `AccessTokenService` Method Contracts

```ts
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async signToken(payload: AccessTokenPayload): Promise<string>
}
```

## 13. Response DTO Contracts & Envelope Convention

### Envelope Convention

- **Service Layer**: Returns raw feature data objects (`UserResponseDto`, `LoginResponseDto`).
- **Controller Layer**: Wraps service return objects in the FinCraft `{ data: result }` envelope.

### Contracts

- **`UserResponseDto`**:
  ```ts
  export class UserResponseDto {
    id!: string;
    email!: string;
    displayName!: string;
    avatarUrl!: string | null;
    role!: UserRole;
    status!: UserStatus;
    createdAt!: Date;
    updatedAt!: Date;
  }
  ```
- **`LoginResponseDto`**:
  ```ts
  export class LoginResponseDto {
    user!: UserResponseDto;
    accessToken!: string;
  }
  ```
- **`Register` and `GET /auth/me` endpoints**: Reuse `UserResponseDto`.

## 14. Safe User-Select Strategy

`UserService` explicitly specifies Prisma `select` for safe queries:

```ts
const SAFE_USER_SELECT = {
  id: true,
  email: true,
  displayName: true,
  avatarUrl: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;
```

`passwordHash` is excluded at database query time for `createUser` and `getUserById`.

## 15. Password-Bearing Internal User Type

For `getUserByEmail` (used by `AuthService.login`), `UserService` includes `passwordHash`:

```ts
export type UserWithPassword = UserResponseDto & { passwordHash: string };
```

This allows `AuthService` to compare passwords via `BcryptService`, then strip `passwordHash` before constructing `LoginResponseDto`.

## 16. `P2002` Ownership and Mapping

`UserService.createUser` captures Prisma `P2002` known request errors when target includes `email`, throwing `ConflictException('A user with this email already exists')`.

## 17. Current-User Lookup Flow

1. Client calls `GET /auth/me` with Bearer token.
2. `AuthGuard` verifies token and attaches `request.user` (`AccessTokenPayload`).
3. `AuthController.getMe` calls `AuthService.getCurrentUser(currentUser.sub)`.
4. `AuthService` calls `UserService.getUserById(userId)`.
5. `AuthService` verifies user exists and `user.status === UserStatus.ACTIVE`.
6. If missing or non-ACTIVE, throws `UnauthorizedException('Authentication session is no longer valid')`.
7. `AuthController` wraps in `{ data: user }` and returns `HTTP 200 OK`.

## 18. `AuthGuard` `JwtService` Dependency

`AuthGuard` requires `JwtService`. Since `AuthModule` imports `AccessTokenModule`, and `AccessTokenModule` exports `JwtModule` (or `JwtService`), NestJS dependency injection resolves `JwtService` cleanly for `AuthGuard` without duplicate configuration.

## 19. Runtime Behavior Preservation Matrix

| Behavior / Requirement | Preservation Strategy | Verification Method |
|---|---|---|
| Bcrypt Salt Rounds | Fixed at 12 in `BcryptService` | Unit & Live test |
| Password Trimming | Never trim password in DTOs or Services | Live test |
| Register Endpoint | `POST /auth/register` returns 201 with `{ data: UserResponseDto }` | Live test |
| Duplicate Email | Throws `ConflictException('A user with this email already exists')` (409) | Live test |
| Login Endpoint | `POST /auth/login` returns 200 with `{ data: LoginResponseDto }` | Live test |
| Unknown Email / Wrong Password | Throws identical `UnauthorizedException('Invalid email or password')` (401) | Live test |
| Inactive / Banned User Login | Throws `UnauthorizedException('Account is not active')` (401) | Live test |
| JWT Expiration Config | Numeric `JWT_ACCESS_EXPIRES_IN_SECONDS` (default 900) validated on boot | Boot test |
| JWT Payload Claims | Strictly `{ sub, email, role }` | Live test |
| Protected `GET /auth/me` | Protected by `AuthGuard`, returns `{ data: UserResponseDto }` | Live test |
| Stale Session / Deleted User | Throws `UnauthorizedException('Authentication session is no longer valid')` (401) | Live test |
| Global Guards Order | 1. `AuthGuard`, 2. `RolesGuard` | Boot & Execution test |
| Response Envelope | `{ data: ... }` on all public endpoints | Live test |

## 20. TypeScript Risks & Prevention

- **Risk**: Using `any` or `as any` during service extraction.
  - **Prevention**: Use explicit return types (`Promise<UserResponseDto>`, `Promise<UserWithPassword | null>`) and import generated Prisma types/enums (`UserRole`, `UserStatus`).
- **Risk**: Decorator metadata compilation error (TS1272) when referencing interface in `@CurrentUser()`.
  - **Prevention**: `AccessTokenPayload`, `UserResponseDto`, and `LoginResponseDto` are declared as `class` exports.

## 21. Circular-Dependency Risks & Prevention

- Linear unidirectional module dependencies:
  - `AuthModule` -> imports `UserModule`, `HashModule`, `AccessTokenModule`
  - `UserModule` -> imports `DatabaseModule`
  - `HashModule` -> imports none
  - `AccessTokenModule` -> imports `ConfigModule`, `JwtModule`
- No child module imports `AuthModule`. Zero circular dependencies.

## 22. Exact Implementation Sequence

The refactor will be executed in 3 bounded phases across separate tasks:

- **Phase A (`P4_AUTH_7`)**:
  - Create `src/user/dto/user-response.dto.ts`
  - Create `src/user/user.service.ts` and `src/user/user.module.ts`
  - Verify `UserService` independently.
- **Phase B (`P4_AUTH_8`)**:
  - Create `src/infrastructure/hash/bcrypt.service.ts` and `hash.module.ts`
  - Create `src/infrastructure/jwt/access-token.service.ts` and `access-token.module.ts`
  - Verify infrastructure modules independently.
- **Phase C (`P4_AUTH_9`)**:
  - Create `src/auth/dto/login-response.dto.ts`
  - Refactor `AuthService` to inject `UserService`, `BcryptService`, `AccessTokenService`
  - Update `AuthModule` imports and `AuthController` return types
  - Perform static verification, live runtime verification, documentation updates, and git commit.

## 23. Verification Matrix

1. `corepack pnpm@11.15.1 exec prisma validate`
2. `corepack pnpm@11.15.1 run build`
3. `corepack pnpm@11.15.1 run lint`
4. `corepack pnpm@11.15.1 test --runInBand`
5. `corepack pnpm@11.15.1 run test:e2e --runInBand`
6. `grep_search` for `as any`, `as unknown`, `@ts-ignore`, `@ts-expect-error` in `src/auth`, `src/user`, `src/infrastructure`
7. Programmatic live HTTP integration test covering Register, Login, `GET /auth/me`, Expired Token, Deleted/Inactive user stale session, Public endpoints, and exact user cleanup.

## 24. Rollback Strategy

If any live verification step fails during refactoring, revert git changes (`git checkout -- src/`) to preserve the known working baseline (`d807255`).

## 25. Acceptance Criteria

1. `AuthService` does NOT import `PrismaService`, Prisma error classes, `bcrypt`, `JwtService`, or `ConfigService`.
2. `UserService`, `BcryptService`, and `AccessTokenService` exist and are cleanly injected into `AuthService`.
3. `UserResponseDto` and `LoginResponseDto` provide explicit return types.
4. All existing Auth runtime tests and security invariants pass 100%.
5. Worktree is clean and committed locally.

## 26. Explicit Non-Goals

- No refresh tokens or OAuth.
- No database schema changes or migrations.
- No changes to Seed or ElementCategory code.
- No frontend changes.
- No auto-generated `*.spec.ts` files.
