# CODING_RULES.md — กฎการเขียนโค้ดและการดูแลไฟล์

เอกสารนี้คือรายละเอียดเต็มของกฎการเขียนโค้ด อ้างอิงจาก [`AGENTS.md`](../../AGENTS.md) (ที่มีแค่สรุปย่อ)

## A. No Hardcoding

ห้าม hardcode:

- secret, API key, password, database credential
- URL เฉพาะ environment
- backend port ที่ซ้ำอยู่หลายจุดใน source code
- frontend API origin ที่ซ้ำอยู่หลายจุดใน source code
- absolute path เฉพาะเครื่องใน application code
- ค่าเฉพาะ deployment
- ค่าคงที่ทางการเงินที่ซ้ำกัน (duplicated financial constants)
- threshold ของ simulation ที่ไม่มีคำอธิบาย
- ค่า UI ที่ซ้ำและควรอยู่ใน shared configuration

ให้ใช้แทน (ตามความเหมาะสม):

- environment variables
- validated configuration
- constants / enums
- typed configuration object
- ข้อมูลใน database ที่ Admin จัดการได้
- simulation definition module
- shared design token

**ข้อยกเว้นที่ไม่ต้องตีความเกินจำเป็น** — ค่าต่อไปนี้ยังคง hardcode ได้เมื่อเป็นกฎ domain ที่เสถียร:

- enum member
- HTTP status code
- ชื่อ route
- ชื่อ role ที่ fix ตายตัว (`USER`, `ADMIN`, `SUPER_ADMIN`)
- UI label แบบ one-off
- สูตรคณิตศาสตร์ที่นิยามตายตัว
- ค่า test fixture
- ค่า default ที่ปลอดภัย มีเอกสารกำกับ และไม่ผูกกับ environment

ห้ามสร้างชั้น configuration เพิ่มเพียงเพื่อหลีกเลี่ยง literal value ทุกตัว

## B. File Size Limit

ไฟล์ source code ที่คนดูแลเอง (manually maintained) ต้องมีความยาว **ไม่เกิน 500 บรรทัดจริง (physical lines)**

ครอบคลุม: `.ts`, `.tsx`, `.js`, `.jsx`, ไฟล์ Prisma schema ที่ดูแลเอง

เมื่อไฟล์ยาวประมาณ 400 บรรทัด:

- ตรวจสอบว่าความรับผิดชอบในไฟล์เริ่มปนกันหรือไม่
- เสนอแยกไฟล์เล็กๆ ก่อนที่จะถึง 500 บรรทัด
- คง behavior เดิมไว้ขณะแยกไฟล์

ข้อยกเว้น (ไม่ต้องนับ/ไม่ต้องแก้เพื่อลดบรรทัด):

- Prisma client ที่ generate อัตโนมัติ
- lockfile
- ไฟล์ framework ที่ generate อัตโนมัติ
- migration SQL ที่ generate อัตโนมัติ
- ไฟล์จาก third-party/vendor

Test ควรอยู่ต่ำกว่า 500 บรรทัดเช่นกันเมื่อทำได้ และควรแยกตามพฤติกรรม (behavior) เมื่อเริ่มอ่านยาก

## C. Teacher-Style Backend

โครงสร้างแบบแบ่งตาม Feature:

```text
src/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── dto/
└── types/
```

กฎ:

- Controller รับ HTTP input แล้วเรียก Service เท่านั้น
- Controller ต้องบาง (thin)
- Business logic อยู่ใน Service
- Prisma query อยู่ใน Service
- ใช้ NestJS dependency injection โดยตรง
- ใช้ DTO ร่วมกับ `class-validator` สำหรับ request body
- ใช้ NestJS Pipe สำหรับ path parameter
- ใช้ built-in NestJS exception
- ใช้ camelCase ใน Prisma code, ใช้ `@map`/`@@map` แปลงเป็น snake_case ใน database
- ใช้ UUID เป็น primary key ของ FinCraft ทุกตาราง
- ใช้ `Date` ภายในระบบ และใช้ ISO string ข้าม JSON response
- **ห้ามสร้าง Repository layer**
- ห้ามเพิ่ม CQRS, event bus, microservice หรือ generic domain framework โดยไม่มี requirement รับรอง

FinCraft-specific extension ที่อนุญาต (เพราะเป็น requirement ตรงของโปรดักต์):

- `USER` / `ADMIN` / `SUPER_ADMIN`
- Role Guard แบบ minimal
- Craft transaction
- duplicate recipe protection
- rediscovery handling
- simulation calculation service
- direct test สำหรับ behavior สำคัญ

## D. Teacher-Style Frontend

ใช้ Next.js App Router

โครงสร้างที่แนะนำ:

```text
src/
├── app/
├── components/
│   ├── features/
│   ├── layout/
│   ├── shared/
│   └── ui/
└── lib/
    ├── api/
    ├── actions/
    ├── schemas/
    └── types/
```

กฎ:

- Server Component เป็นค่าเริ่มต้น
- Client Component เฉพาะส่วนที่ต้อง interactive
- Canvas อนุญาตให้เป็น Client Component
- ไฟล์ page เน้น routing และ composition เท่านั้น
- ใช้ Server Action สำหรับ mutation เมื่อเหมาะสม
- ใช้ Zod + React Hook Form สำหรับฟอร์ม
- API call อยู่ใน API layer (`lib/api`) เท่านั้น
- ห้ามใส่ business logic ใน page component
- ห้าม client-side fetch โดยไม่มีเหตุผล interactive ที่ชัดเจน

## E. Scope and Learning Rules

- ทำทีละ bounded step
- เน้นหนึ่ง function หรือหนึ่ง endpoint ต่อ step
- อธิบายก่อนเขียนโค้ดเสมอ
- ระบุไฟล์ที่จะอ่าน/แก้ไขทุกครั้ง
- ห้าม scaffold ฟีเจอร์ในอนาคตล่วงหน้า
- ห้ามแก้ไขโค้ดที่ไม่เกี่ยวข้อง
- ห้าม refactor วงกว้างระหว่างที่ทำฟีเจอร์
- หยุดหลังจบ function ปัจจุบัน
- รอ owner review ก่อนไปขั้นถัดไป

## เกี่ยวข้องกับเอกสารอื่น

- ขั้นตอนการทำงานแบบ stepwise → [`STEPWISE_WORKFLOW.md`](STEPWISE_WORKFLOW.md)
- Skill ที่ใช้ปฏิบัติจริง → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
