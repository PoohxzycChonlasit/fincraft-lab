# PROJECT_CONTEXT.md — บริบทโปรดักต์และสถาปัตยกรรมของ FinCraft Lab

เอกสารนี้อธิบาย "โปรเจกต์นี้คืออะไร" อย่างเสถียร (ไม่เปลี่ยนบ่อย) — ต่างจาก [`CURRENT_STATUS.md`](CURRENT_STATUS.md) ที่บอกสถานะปัจจุบัน ณ ขณะนี้

## Product

**FinCraft Lab** — Financial Literacy Discovery Lab

## Purpose

ผู้ใช้เรียนรู้เรื่องการเงินผ่านการ:

- ผสม (Craft) Element เข้าด้วยกัน
- ค้นพบ (Discover) Concept ใหม่
- อ่านบทเรียนที่อ้างอิงโลกจริง (real-world grounded lessons)
- เชื่อมโยงความคิดบน Canvas
- ทดสอบผลลัพธ์ที่วัดได้ผ่าน Simulation

## Safety — ข้อจำกัดสำคัญที่ต้องยึดถือเสมอ

- **Education Only**
- **Simulation Only**
- **Not Financial Advice**
- ห้ามเชื่อมต่อการซื้อขายจริง (no real trading)
- ห้ามเชื่อมต่อตลาดจริง (no real market connection)
- ไม่มี payment gateway ใน MVP ที่นำเสนอ
- ห้ามการันตีผลกำไร (no guaranteed profit)
- ห้ามทำนายราคา (no price prediction)

## Technology Stack

- Next.js (Frontend, App Router)
- NestJS (Backend)
- PostgreSQL
- Prisma (ยังไม่ติดตั้ง — ดู [`CURRENT_STATUS.md`](CURRENT_STATUS.md))
- pnpm (package manager เดียวที่อนุญาต)
- บทบาทผู้ใช้: `USER` / `ADMIN` / `SUPER_ADMIN`

## Main Data Domains

โมเดลข้อมูลหลักที่วางแผนไว้ (ยังไม่ได้สร้างทั้งหมด — ดูสถานะจริงที่ `CURRENT_STATUS.md` และ `FILE_MAP.md`):

1. `users`
2. `pets`
3. `element_categories`
4. `elements`
5. `discovery_details`
6. `element_relationships`
7. `craft_recipes`
8. `craft_recipe_inputs`
9. `user_elements`
10. `discovery_events`
11. `workspaces`
12. `workspace_nodes`
13. `workspace_edges`
14. `simulations`
15. `simulation_runs`

## Core Behavior Rules

- `Element` คือ shared master data (ใช้ร่วมกันทุกผู้ใช้)
- การ Rediscovery (ผสมของที่มีอยู่แล้วในระบบ) จะคืนค่า Element เดิม ไม่สร้างซ้ำ
- `user_elements` บันทึกการ unlock ครั้งแรกของแต่ละผู้ใช้เท่านั้น
- `discovery_events` บันทึกทุกครั้งที่มีการ Craft (ไม่ว่าจะสำเร็จซ้ำหรือใหม่)
- `input_hash` ใช้ป้องกัน Recipe ซ้ำ (duplicate protection)
- **Knowledge Relationship** และ **Craft Recipe** เป็นแนวคิดคนละอย่างกัน — ห้ามใช้ปนกัน
- สูตรคำนวณของ Simulation ทั้งหมดอยู่ใน NestJS (ฝั่ง backend)
- `simulation_runs` เก็บ input/output ย้อนหลังเป็นประวัติ (historical record) ห้ามแก้ไขภายหลัง
- ข้อมูลอ้างอิงทางการเงิน (financial claims) ต้องมีแหล่งอ้างอิงหรือระบุ assumption ให้ชัดเจน

## Deferred Modules (ยังไม่ทำในเฟสนี้)

- Community
- ระบบ subscription/payment จริง
- Google Login แบบเต็มรูปแบบ
- Notifications
- Advanced Futures simulation
- AI image generation แบบ runtime
- Full production operations

## เกี่ยวข้องกับเอกสารอื่น

- กฎการเขียนโค้ดแบบละเอียด → [`CODING_RULES.md`](CODING_RULES.md)
- ขั้นตอนการทำงานแบบ stepwise → [`STEPWISE_WORKFLOW.md`](STEPWISE_WORKFLOW.md)
- สถานะที่ verify แล้วล่าสุด → [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- ไฟล์ที่มีอยู่จริงตอนนี้ → [`FILE_MAP.md`](FILE_MAP.md)
