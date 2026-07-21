# AGENTS.md — กฎกลางสำหรับ AI ทุกตัวในโปรเจกต์ FinCraft Lab

## ไฟล์นี้คืออะไร

`AGENTS.md` คือ **แหล่งกฎกลาง (canonical source of truth)** เพียงแหล่งเดียวสำหรับ AI agent ทุกตัวที่เข้ามาช่วยพัฒนา FinCraft Lab ไม่ว่าจะเป็น Claude Code, Gemini, ChatGPT, Codex หรือเครื่องมืออื่นในอนาคต

ไฟล์อื่น เช่น `CLAUDE.md`, `GEMINI.md` เป็นเพียง **thin adapter** ที่ชี้กลับมาที่ไฟล์นี้ ไม่มีสิทธิ์เขียนกฎซ้ำหรือขัดแย้งกับไฟล์นี้

ถ้ากฎในไฟล์อื่นขัดแย้งกับ `AGENTS.md` ให้ถือว่า `AGENTS.md` ถูกต้องกว่าเสมอ

## เริ่มงานอย่างไร (สำหรับ AI ทุกตัว)

ก่อนเริ่มงานใดๆ ใน repository นี้ ให้ทำตามลำดับนี้เสมอ:

1. อ่านไฟล์นี้ (`AGENTS.md`) ทั้งหมด
2. อ่าน [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) เพื่อดูสถานะล่าสุดที่ยืนยันแล้ว
3. อ่าน [`docs/ai/PROJECT_CONTEXT.md`](docs/ai/PROJECT_CONTEXT.md) เพื่อเข้าใจภาพรวมโปรดักต์
4. ทำตาม Stepwise Loop ที่อธิบายไว้ใน `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
5. อย่าเชื่อสถานะเก่าโดยไม่ตรวจสอบ — ให้ verify ด้วย git และไฟล์จริงเสมอ ก่อนอ้างอิงสถานะ

## โปรเจกต์นี้คืออะไร

สรุปสั้น — รายละเอียดเต็มอยู่ที่ [`docs/ai/PROJECT_CONTEXT.md`](docs/ai/PROJECT_CONTEXT.md)

- **FinCraft Lab** คือ Financial Literacy Discovery Lab ใช้เรียนรู้เรื่องการเงินผ่านการผสม Element ค้นพบ Concept และทดลอง Simulation
- เป็นโปรเจกต์เพื่อการเรียนรู้ (school personal project) — **Education Only, Simulation Only, Not Financial Advice**
- Backend: NestJS + PostgreSQL + Prisma (ยังไม่ติดตั้ง Prisma ณ ตอนนี้)
- Frontend: Next.js App Router
- Package manager: **pnpm เท่านั้น**

## Coding Rules (สรุป — รายละเอียดเต็มที่ docs/ai/CODING_RULES.md)

รายละเอียดทั้งหมดอยู่ที่ [`docs/ai/CODING_RULES.md`](docs/ai/CODING_RULES.md) ที่นี่สรุปเฉพาะกฎที่สำคัญที่สุด:

1. **ห้าม Hardcode** ค่า secret, URL, port, credential หรือค่าที่ควรเป็น config — ข้อยกเว้นที่อนุญาตดูใน CODING_RULES.md
2. **ไฟล์ที่คนดูแลเอง (manually maintained) ต้องไม่เกิน 500 บรรทัด** เริ่มพิจารณาแยกไฟล์ตั้งแต่ประมาณ 400 บรรทัด
3. **Backend แบ่งตาม Feature** — Controller บาง, Business Logic และ Prisma query อยู่ใน Service เท่านั้น, ห้ามสร้าง Repository layer
4. **Frontend ใช้ Next.js App Router** — Server Component เป็นค่าเริ่มต้น, Client Component เฉพาะส่วนที่ต้อง interactive
5. **ทำทีละ Function หรือ Endpoint** — ห้าม scaffold ฟีเจอร์ทั้งโมดูลในขั้นตอนเดียว เว้นแต่เจ้าของโปรเจกต์ร้องขอชัดเจน
6. **ทุกขั้นต้องอธิบายก่อนเขียนโค้ด และต้อง verify ด้วยหลักฐานจริงก่อนถือว่าสำเร็จ**

## Stepwise Workflow (สรุป — รายละเอียดเต็มที่ docs/ai/STEPWISE_WORKFLOW.md และ SKILL.md)

ทุกขั้นตอนการพัฒนาต้องผ่าน loop นี้:

```text
Observe → Explain → Implement → Verify → Teach Back → Checkpoint → Stop
```

- **Observe** — ตรวจ repository และ git state ก่อนเริ่ม
- **Explain** — อธิบาย objective, scope, out-of-scope, ไฟล์ที่จะแตะ, ความเสี่ยง ก่อนเขียนโค้ด
- **Implement** — ทำเฉพาะขั้นตอนที่ผูกไว้ (bounded step) เดียว ห้าม refactor หรือ scaffold สิ่งที่ไม่เกี่ยวข้อง
- **Verify** — ต้องมีหลักฐานจริง (build, test, curl, diff) ห้ามอ้างว่าสำเร็จโดยไม่มีหลักฐาน
- **Teach Back** — อธิบายไฟล์ที่เปลี่ยนและวิธีที่ไฟล์เชื่อมกัน เพื่อการเรียนรู้ของเจ้าของโปรเจกต์
- **Checkpoint** — สร้าง local commit เดียวเมื่อได้รับอนุญาตและ verify ผ่านแล้วเท่านั้น ห้าม push โดยไม่ได้รับคำสั่ง
- **Stop** — แนะนำ "ขั้นตอนถัดไปที่ผูกไว้" เพียงหนึ่งขั้น แล้วหยุดรอการอนุมัติ ห้ามทำงานต่อเองอัตโนมัติ

รายละเอียดการปฏิบัติงานแบบละเอียดในการทำทีละ Function อยู่ที่:
`.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`

## Hard Safety Rules (ต้องยึดถือเสมอ ไม่ว่างานจะเป็นอะไร)

- ห้ามแก้ไข `C:\devnest 101\workshop-01\fakebook` หรือ teacher repository ใดๆ
- ห้ามสร้าง Git repository ซ้อนใน `fincraft-lab-api` หรือ `fincraft-lab-web` — Git มีได้ที่ root เดียวคือ `fincraft-lab/.git`
- ห้าม push ไป remote โดยไม่ได้รับคำสั่งชัดเจนจากเจ้าของ
- ห้ามลบไฟล์ของเจ้าของโดยไม่ได้รับอนุญาต
- ห้ามรัน destructive command (เช่น database reset, force push, hard delete master data) โดยไม่ได้รับอนุญาตชัดเจน
- ห้าม commit secret หรือ credential ใดๆ
- ห้ามสร้างระบบ AI Governance ขนาดใหญ่ (ไม่มี Manifest system, Receipt system, State Machine หลายชั้น, Autonomous multi-hour loop, Agent hierarchy)

## สถานะปัจจุบัน

สถานะที่ verify แล้วล่าสุดอยู่ที่ [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) — **ห้ามเชื่อสถานะจากความจำเก่า ให้ตรวจสอบไฟล์นี้หรือ git จริงก่อนเริ่มงานเสมอ**

## แผนที่ไฟล์

โครงสร้างไฟล์ปัจจุบันทั้งหมดอยู่ที่ [`docs/ai/FILE_MAP.md`](docs/ai/FILE_MAP.md)

## ทำไมต้องใช้โครงสร้างนี้

โปรเจกต์นี้จะถูกพัฒนาโดย AI หลายตัว (Claude, Gemini, ChatGPT, Codex) หากไม่มีแหล่งกฎกลางเดียว แต่ละ AI อาจตีความไม่ตรงกัน สร้างไฟล์ใหญ่เกินไป ใช้ pattern ไม่ตรงกับที่เจ้าของโปรเจกต์เรียนรู้มา หรือทำงานเกินขอบเขตที่ขอ โครงสร้างนี้จึงถูกออกแบบให้ **บางที่สุดเท่าที่จำเป็น** สำหรับโปรเจกต์เรียนรู้ส่วนตัว ไม่ใช่ AI OS ขนาดใหญ่ที่มี Manifest, Receipt และ State Machine หลายชั้น
