# CODING_RULES.md — Technical Rules & Standards for FinCraft Lab

## A. Core Coding Rules

1. **No hardcoding secrets, URLs, ports, or credentials.** Use environment variables configured through NestJS `@nestjs/config` and `.env`.
2. **Every maintained source file must remain below 400 physical lines.** Start considering a split once a file reaches roughly 250 lines.
3. **Every maintained method must remain below 100 physical lines.** Methods above 100 lines must be split before the task can pass.
4. **Backend is organized by feature.** Controllers stay thin; business logic and Prisma queries live in services.
5. **No repository layer.** Connect NestJS services directly to `PrismaService`.
6. **Frontend uses Next.js App Router.** Server Components by default; Client Components only for interactive UI.
7. **Work one function or endpoint at a time.** No scaffolding of unrequested future modules.
8. **Every step must be verified with real runtime evidence.**

---

## B. Modern NestJS Root-MCS Policy (Canonical)

For every NestJS feature, **always keep these three primary files at the feature root**:
```text
src/<feature>/
  <feature>.module.ts
  <feature>.controller.ts
  <feature>.service.ts
```
Do **not** move these three files into `controllers/` or `services/`.

Supporting folders may be created under `src/<feature>/` only when needed:
```text
src/<feature>/
  dto/
  types/
  validators/
  mappers/
  constants/
  policies/
```
Additional feature-specific services should also remain at the feature root by default, for example:
- `workspace-canvas.service.ts`
- `workspace-canvas-writer.service.ts`

Do not create a `services/` folder only to contain two or three service files.
Do not create empty folders.
Do not create `index.ts` barrel files.

---

## C. Target Sizes and Ceilings

### File Size Targets
- Module: preferred <= 60, hard <= 100
- Controller: preferred <= 150, hard <= 200
- Service: preferred <= 250
- Validator: preferred <= 200
- Mapper: preferred <= 150
- DTO / Type: preferred <= 150
- Review threshold: any maintained source file > 250 lines
- Hard ceiling: **400 physical lines** for all maintained source files.

### Method Size Targets
- Preferred: <= 40 physical lines
- Review threshold: > 60 physical lines
- Hard ceiling: **100 physical lines** for all maintained methods.

---

## D. Type Safety & Prohibitions

- Strict TypeScript required (`strict: true`).
- Prohibited: `any`, `as any`, `@ts-ignore`, `@ts-expect-error`, `as unknown as T` to silence errors.
- Prohibited: `BaseService`, `BaseController`, generic repositories, CQRS event buses.
- Prohibited: raw SQL queries, `index.ts` barrel files, `forwardRef` to conceal poor module boundaries.
