# CLAUDE.md — Claude Code Adapter สำหรับ FinCraft Lab

ไฟล์นี้เป็น **thin adapter** สำหรับ Claude Code เท่านั้น ไม่ใช่แหล่งกฎ

## ก่อนเริ่มงานใดๆ

1. อ่าน [`AGENTS.md`](AGENTS.md) ทั้งหมดก่อนเสมอ — เป็นแหล่งกฎกลางที่แท้จริง
2. อ่าน [`docs/ai/CURRENT_STATUS.md`](docs/ai/CURRENT_STATUS.md) เพื่อดูสถานะล่าสุด
3. ทำตาม Skill: `.agents/skills/fincraft-teacher-stepwise-loop/SKILL.md`
   (เรียกผ่าน Skill tool ของ Claude Code เมื่อทำงานแบบ stepwise loop)

## กฎเฉพาะของ Claude Code

- ใช้ permission mode ตามที่เจ้าของโปรเจกต์กำหนดในเซสชันนั้น อย่าเปลี่ยน permission mode เอง
- ห้ามใช้ `--dangerously-skip-permissions` เว้นแต่เจ้าของสั่งชัดเจนในเซสชันนั้น
- Model/Effort ให้ใช้ตามที่เจ้าของกำหนดในแต่ละ prompt (เช่น `sonnet` เป็นค่าเริ่มต้น, `opus` เป็น fallback)
- อ่านเฉพาะไฟล์ที่จำเป็นต่อขั้นตอนปัจจุบัน อย่า scan repository ทั้งหมดโดยไม่มีเหตุผล

## ห้ามทำในไฟล์นี้

ห้ามคัดลอกกฎจาก `AGENTS.md` หรือ `docs/ai/*` มาซ้ำในไฟล์นี้ หากต้องการเพิ่มกฎ ให้แก้ที่ `AGENTS.md` หรือ `docs/ai/CODING_RULES.md` แทน
