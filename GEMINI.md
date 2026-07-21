# GEMINI.md — Gemini Adapter สำหรับ FinCraft Lab

ไฟล์นี้เป็น **thin adapter** สำหรับ Gemini เท่านั้น ไม่ใช่แหล่งกฎ

## ก่อนเริ่มงานใดๆ

1. อ่าน [`AGENTS.md`](AGENTS.md) ทั้งหมดก่อนเสมอ — เป็นแหล่งกฎกลางที่แท้จริง
2. อ่าน [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) เพื่อดูสถานะล่าสุด
3. ทำตาม Skill: `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
   (ใช้เป็นแนวทางปฏิบัติแบบ stepwise loop แม้ Gemini จะไม่มีกลไก Skill tool แบบ Claude Code)

## กฎเฉพาะของ Gemini

- อ่านเฉพาะไฟล์ที่จำเป็นต่อขั้นตอนปัจจุบัน อย่า scan repository ทั้งหมดโดยไม่มีเหตุผล
- ห้ามรันคำสั่งที่ทำลายข้อมูลหรือ push โดยไม่ได้รับคำสั่งชัดเจนจากเจ้าของ
- หากเครื่องมือหรือ permission model ของ Gemini แตกต่างจาก Claude Code ให้ยึดพฤติกรรมความปลอดภัยตาม Hard Safety Rules ใน `AGENTS.md` เป็นหลัก

## ห้ามทำในไฟล์นี้

ห้ามคัดลอกกฎจาก `AGENTS.md` หรือ `docs/ai/*` มาซ้ำในไฟล์นี้ หากต้องการเพิ่มกฎ ให้แก้ที่ `AGENTS.md` หรือ `docs/ai/CODING_RULES.md` แทน
