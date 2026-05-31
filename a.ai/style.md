# PRIMELOG - CODE STYLE & PATTERNS

##  TYPESCRIPT
- Strict mode ON. No `any`. Explicit return types.
- Use `zod` for request validation.
- Enums from Prisma must be used for status/role checks.

## 🔐 ROLE & DATA ISOLATION
```ts
// API Route Pattern
const session = await auth()
if (!session?.user) throw new UnauthorizedError()
const role = session.user.role as 'ADMIN' | 'CUSTOMER'
const userId = session.user.id

const whereClause: any = role === 'ADMIN' ? {} : { userId }