# STEPWISE_WORKFLOW.md — วงจรของแต่ละ Bounded Step

เอกสารนี้อธิบาย lifecycle ของหนึ่งขั้นตอนการพัฒนา (bounded step) แบบละเอียด วิธีปฏิบัติจริงเมื่อทำงานอยู่ในโหมด skill ดูที่ `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`

## Loop ทั้งหมด

```text
Observe → Explain → Implement → Verify → Teach Back → Checkpoint → Stop
```

### 1. Observe

- ยืนยัน repository path และ Git state
- อ่านเฉพาะไฟล์ที่เกี่ยวข้องกับ step ปัจจุบัน
- ระบุ pattern เดิมที่ function ใหม่ต้องทำตาม
- ถ้าเจอ uncommitted change ที่ไม่คาดคิด → หยุดและรายงาน ห้าม overwrite

### 2. Explain

ก่อนเขียนโค้ด ต้องอธิบาย:

- objective
- เหตุผลที่ step นี้สำคัญ
- scope / out-of-scope
- ไฟล์ที่จะอ่าน / จะสร้างหรือแก้ไข
- request flow
- risk
- แผนการ verify

เจ้าของโปรเจกต์ต้องเข้าใจ function นี้ทำงานอย่างไรก่อนเริ่ม implement

### 3. Implement

- ทำเฉพาะ step ที่ผูกไว้ (bounded)
- สร้างเฉพาะไฟล์ที่ step นี้ต้องการ
- ห้ามสร้าง feature folder ล่วงหน้า
- ห้ามติดตั้ง package ที่ไม่เกี่ยวข้อง
- ห้าม refactor หรือ rename ไฟล์ที่ไม่เกี่ยวข้อง
- คงโครงสร้างแบบ teacher-style เดิมไว้
- เลือก implementation ที่ง่ายที่สุดที่ตอบโจทย์ปัจจุบัน

### 4. Verify

รันเฉพาะการตรวจสอบที่จำเป็นที่สุด:

- compile / type-check ส่วนที่แตะ
- รัน direct test ของ behavior ปัจจุบัน
- เรียก endpoint จริงเมื่อเกี่ยวข้อง
- ตรวจทั้ง success case และ error case
- ตรวจ diff
- ยืนยันว่าไม่มีไฟล์อื่นที่ไม่เกี่ยวข้องถูกแก้

ห้ามอ้างว่าสำเร็จโดยไม่มีหลักฐาน

### 5. Teach Back

อธิบายหลัง verify ผ่านแล้ว:

- แต่ละไฟล์ที่เปลี่ยนทำหน้าที่อะไร
- ไฟล์เรียกกันอย่างไร
- request flow แบบเต็ม
- ข้อมูลอะไรเข้า, เก็บที่ไหน, response อะไรออก, error อะไรเกิดได้
- สิ่งที่เจ้าของโปรเจกต์ควรจำ

รูปแบบ flow มาตรฐานเมื่อเกี่ยวข้องกับ backend:

```text
Request
→ Controller
→ DTO / Pipe
→ Service
→ Prisma
→ PostgreSQL
→ Response
```

### 6. Checkpoint

- สร้าง local commit เดียวเมื่อได้รับอนุญาตและ verify ผ่านแล้วเท่านั้น
- ห้าม push โดยไม่ได้รับคำสั่งจากเจ้าของ

### 7. Stop

- แนะนำ "ขั้นตอนถัดไปที่ผูกไว้" เพียงหนึ่งขั้น
- ห้ามทำงานต่อเองอัตโนมัติ
- รอการอนุมัติจากเจ้าของก่อนไปขั้นถัดไปเสมอ

## Evidence Standard

ขั้นตอนหนึ่งจะถือว่า "เสร็จ" ก็ต่อเมื่อมีหลักฐานตรง เช่น:

- output ของคำสั่ง
- direct test ที่ผ่าน
- HTTP response จริง
- ผล query ของ Prisma
- ผล type-check
- สรุป diff

ต้องแยกให้ชัดว่าอะไรคือ observed fact, inference, recommendation หรือ unresolved question

## เกี่ยวข้องกับเอกสารอื่น

- กฎการเขียนโค้ดแบบละเอียด → [`CODING_RULES.md`](CODING_RULES.md)
- สถานะปัจจุบัน → [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- วิธีปฏิบัติจริงในรูปแบบ skill (พร้อม protocol template) → `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
