
---

### 📁 File 5: `.ai/PLAN.md`
```markdown
# IMPLEMENTATION PLAN TEMPLATE

## 1. SCOPE
- IN: [3-4 bullet points dari requirement]
- OUT: [Explicit exclusions, e.g., NO GPS, NO WebSocket]

## 2. DATABASE CHANGES
- Tables/Fields to add/modify
- Migration command: `npx prisma migrate dev --name [desc]`

## 3. BACKEND / API
- Endpoints to create/modify
- Auth/Role guards required
- Business logic / validation steps
- Transaction boundaries

## 4. FRONTEND
- Pages/Components to build
- State management approach
- Form/Validation strategy
- Loading/Error handling

## 5. AUTOMATION / CRON (if applicable)
- Trigger condition
- Frequency / scheduling
- Fallback / manual override

## 6. TESTING
- Unit: [1-2 critical functions]
- Integration: [1-2 API flows]
- E2E: [1 user journey]
- Security: [Role isolation check]

## 7. ROLLOUT STEPS
1. [Step 1]
2. [Step 2]
3. [Step 3]

## ⚠️ AI CONSTRAINTS
- Output must match this structure.
- Max 250 words.
- No hallucinated features.
- Reference existing patterns in `src/lib/` and `src/components/`.