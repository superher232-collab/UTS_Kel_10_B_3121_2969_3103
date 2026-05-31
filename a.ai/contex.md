# PRIMELOG - AI CONTEXT (READ FIRST)

## 🛠 TECH STACK
Next.js 16 (App Router) | NextAuth v5 | Prisma ORM | PostgreSQL | TypeScript Strict | Tailwind CSS

##  ROLES & PERMISSIONS
- ADMIN: Full system control (shipments, vehicles, users, analytics, settings, automation)
- CUSTOMER: Own data only. Cannot see/edit others' data. No admin features.
- HARD RULE: ALL customer queries MUST filter by `WHERE userId = session.userId`

##  CORE BUSINESS FLOW
Status: DIPROSES → DALAM_PENGIRIMAN → SAMPAI → SELESAI
Cancel/Edit: ONLY allowed when status == 'DIPROSES'
Invoice: Auto-generated when status == 'SELESAI'
ReceiptNo: Auto-format `PM-YYYY-XXX`

##  HARD BOUNDARIES (OUT OF SCOPE)
❌ Real-time GPS coordinates (latitude/longitude)
❌ Fleet telemetry (speed, heading, fuel, manual position updates)
❌ WebSocket chat (use polling only)
❌ Payment gateway integration
❌ Digital signature hardware capture
❌ Customer-side vehicle/assign/status management

## ✅ IN SCOPE (FOCUS)
CUSTOMER: Tracking dashboard, shipment detail, history log, POD view, notifications, live chat (polling), tickets, invoice mgmt, create/edit/cancel shipment, bulk track.
ADMIN: Dashboard stats, shipment CRUD, vehicle mgmt & assign, status workflow, bulk ops, revenue/route/vehicle/customer analytics, customer mgmt, complaints, compensation, audit logs, settings, auto-assign, auto-notify, auto-invoice, auto-flag delays.

## 🧠 AI BEHAVIOR RULES
1. Always check role before generating code.
2. Never add GPS/telemetry features.
3. Keep output under 300 words per response unless asked.
4. Use explicit TypeScript types. No `any`.
5. Follow existing project structure.