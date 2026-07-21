# CURRENT_STATUS.md — สถานะที่ verify แล้วล่าสุด

เอกสารนี้บันทึกเฉพาะสิ่งที่ตรวจสอบได้จริง (evidence-based) ห้ามอ่านแล้วเชื่อทันทีในงานถัดไป — ให้ตรวจซ้ำด้วยคำสั่งด้านล่างก่อนเริ่มงานเสมอ

## วิธีตรวจสอบซ้ำ

```powershell
git rev-parse --show-toplevel
git rev-parse HEAD
git log -1 --oneline
git status --short
```

## สถานะที่ verify แล้ว (ตรวจในงาน P0.5 — TASK_ID: P0_5_SHARED_AI_AGENT_FOUNDATION_001)

- **Git root**: `C:/devnest 101/single-project/fincraft-lab` (ไม่มี git ซ้อนใน `fincraft-lab-api` หรือ `fincraft-lab-web`)
- **Starting commit (P0.5)**: `34117a182845bc8b56b211bc5e793526343bb897`
- **Commit message**: `P0: scaffold NestJS backend foundation in fincraft-lab-api`
- **Worktree ก่อนเริ่ม P0.5**: มีเฉพาะ `?? .agents/` (owner-provided draft ของ SKILL.md ที่ยังไม่ commit)

### Backend (`fincraft-lab-api`)

- ตรวจ `package.json` โดยตรง: `"packageManager": "pnpm@11.15.1"` ยืนยันแล้ว
- `dependencies`: มีเฉพาะ `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs`
- **ไม่มี Prisma** ใน dependencies (ยืนยันจากการอ่านไฟล์ตรง)
- `src/` มีไฟล์ generated พื้นฐาน 5 ไฟล์เท่านั้น: `main.ts`, `app.module.ts`, `app.controller.ts`, `app.service.ts`, `app.controller.spec.ts`
- **ไม่มี `GET /health`** (ยืนยันจากการอ่าน `src/` โดยตรง — ไม่มี module หรือ route อื่นนอกจาก root `AppController`)
- **ไม่มี feature folder ใดๆ** ยัง

### Frontend (`fincraft-lab-web`)

- ตรวจ `ls` โดยตรง: **ว่างเปล่า** ยังไม่ initialize

### เอกสาร AI (ก่อนงาน P0.5)

- ก่อนงานนี้: ไม่มี `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `docs/ai/*`
- มีเฉพาะ `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md` (owner-provided draft ที่ยังไม่ commit)

## Build/Lint/Test — สถานะการรัน

ผลการรัน `pnpm build`, `pnpm lint`, `pnpm test`, และการ boot แอปจริง (`GET /` → `200 Hello World!`) **รายงานไว้ในงาน P0** (ผ่านทั้งหมด, lint มี 1 warning เดิมจาก template ที่ generate มา ไม่ใช่ error)

**งาน P0.5 นี้เป็น docs-only — ไม่ได้ rerun คำสั่งเหล่านี้ซ้ำ** ผลที่บันทึกไว้ข้างต้นถือเป็น "reported, not rerun in this docs-only task" ต้อง rerun เพื่อยืนยันใหม่ก่อนใช้เป็นหลักฐานใน step ถัดไปที่แตะ backend จริง

## Next Bounded Step

```text
P1 — Implement GET /health เป็น teacher-style backend function เดียว แบบ bounded step
```

ห้ามข้าม step นี้ไปทำ Prisma, authentication, หรือ feature folder อื่นก่อน

## เกี่ยวข้องกับเอกสารอื่น

- แผนที่ไฟล์ทั้งหมด → [`FILE_MAP.md`](FILE_MAP.md)
- ลำดับ step เต็มของโปรเจกต์ → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md` (หัวข้อ Initial Project Sequence)
