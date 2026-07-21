# FILE_MAP.md — แผนที่ไฟล์ที่มีอยู่จริงตอนนี้

เอกสารนี้ระบุเฉพาะไฟล์/โฟลเดอร์ที่ **มีอยู่จริง** ณ ตอนนี้เท่านั้น โครงสร้างในอนาคตอยู่ในหัวข้อ "Planned, not created" ด้านล่าง

## Root

| Path | หน้าที่ | ที่มา | Step ถัดไปที่แก้ได้ |
|---|---|---|---|
| `.gitignore` | ignore `node_modules`, `dist`, `.env` ฯลฯ | owner-maintained | แก้เมื่อมี pattern ใหม่ที่ต้อง ignore |
| `AGENTS.md` | กฎกลาง canonical สำหรับ AI ทุกตัว | สร้างใน P0.5 | แก้เมื่อกฎระดับโปรเจกต์เปลี่ยน |
| `CLAUDE.md` | thin adapter สำหรับ Claude Code | สร้างใน P0.5 | แก้เฉพาะส่วนเฉพาะของ Claude |
| `GEMINI.md` | thin adapter สำหรับ Gemini | สร้างใน P0.5 | แก้เฉพาะส่วนเฉพาะของ Gemini |

## `.agents/skills/fincraft-teacher-stepwise-loop/`

| Path | หน้าที่ | ที่มา | Step ถัดไปที่แก้ได้ |
|---|---|---|---|
| `SKILL.md` | วิธีปฏิบัติ stepwise loop แบบละเอียด (Observe→...→Stop, protocol template) | owner-provided draft, ปรับปรุงใน P0.5 | แก้เมื่อ loop หรือ project sequence เปลี่ยน |

## `docs/ai/`

| Path | หน้าที่ | ที่มา | Step ถัดไปที่แก้ได้ |
|---|---|---|---|
| `PROJECT_CONTEXT.md` | บริบทโปรดักต์ ที่ค่อนข้างเสถียร | สร้างใน P0.5 | แก้เมื่อ scope โปรดักต์เปลี่ยน |
| `CODING_RULES.md` | กฎการเขียนโค้ดแบบละเอียด | สร้างใน P0.5 | แก้เมื่อกฎ coding เปลี่ยน |
| `STEPWISE_WORKFLOW.md` | lifecycle ของแต่ละ bounded step | สร้างใน P0.5 | แก้เมื่อ workflow เปลี่ยน |
| `CURRENT_STATUS.md` | สถานะที่ verify แล้วล่าสุด | สร้างใน P0.5 | **แก้ทุกครั้งที่จบ step ใหม่** (evidence-based) |
| `FILE_MAP.md` | ไฟล์นี้เอง | สร้างใน P0.5 | แก้เมื่อมีไฟล์ใหม่เกิดขึ้นจริง |

## `fincraft-lab-api/` (Backend — สร้างใน P0)

| Path | หน้าที่ | ที่มา | Step ถัดไปที่แก้ได้ |
|---|---|---|---|
| `package.json` | dependency, script, `packageManager: pnpm@11.15.1` | generated โดย `nest new`, แก้ 1 บรรทัดใน P0 | แก้เมื่อเพิ่ม dependency ใน step ถัดไป (เช่น Prisma) |
| `pnpm-lock.yaml` | lockfile ของ dependency | generated | ห้ามแก้มือ |
| `pnpm-workspace.yaml` | เก็บ `allowBuilds` approval ของ pnpm | generated (จาก `pnpm approve-builds`) | แก้เมื่อมี build script ใหม่ต้อง approve |
| `nest-cli.json` | ตั้งค่า Nest CLI | generated | ไม่ควรแก้ในระยะนี้ |
| `tsconfig.json`, `tsconfig.build.json` | ตั้งค่า TypeScript (strict mode) | generated | ไม่ควรแก้ในระยะนี้ |
| `eslint.config.mjs`, `.prettierrc` | ตั้งค่า lint/format | generated | ไม่ควรแก้ในระยะนี้ |
| `README.md` | README เริ่มต้นจาก Nest CLI | generated | อัปเดตได้เมื่อ project โตขึ้น |
| `src/main.ts` | entry point, bootstrap แอป | generated | คงไว้จนกว่าจะมี config เพิ่ม (เช่น CORS) |
| `src/app.module.ts` | root module | generated | แก้เมื่อเพิ่ม feature module แรก (เช่น health module) |
| `src/app.controller.ts` | controller ตัวอย่าง (`GET /`) | generated | คงไว้ตามที่ Nest CLI สร้าง |
| `src/app.service.ts` | service ตัวอย่าง | generated | คงไว้ตามที่ Nest CLI สร้าง |
| `src/app.controller.spec.ts` | unit test ตัวอย่าง | generated | คงไว้ตามที่ Nest CLI สร้าง |
| `test/app.e2e-spec.ts`, `test/jest-e2e.json` | e2e test setup | generated | ใช้เป็นแม่แบบสำหรับ e2e test ถัดไป |

## `fincraft-lab-web/` (Frontend)

ว่างเปล่า — ยังไม่ initialize (นอกขอบเขต P0/P0.5)

## Planned, not created

โครงสร้างต่อไปนี้ **ยังไม่มีอยู่จริง** เป็นแผนอ้างอิงจาก `CODING_RULES.md` เท่านั้น ห้ามอ้างว่ามีอยู่แล้ว:

```text
fincraft-lab-api/src/health/           (P1 — GET /health)
fincraft-lab-api/prisma/                (ยังไม่ติดตั้ง Prisma)
fincraft-lab-api/src/<feature>/         (จะสร้างทีละ feature ตาม Initial Project Sequence)

fincraft-lab-web/src/app/
fincraft-lab-web/src/components/
fincraft-lab-web/src/lib/
```

## เกี่ยวข้องกับเอกสารอื่น

- สถานะปัจจุบัน → [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- ลำดับ step เต็ม → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
