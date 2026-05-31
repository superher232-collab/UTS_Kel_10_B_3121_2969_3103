# PRIMELOG - API ENDPOINTS & ROLE MAP

## AUTH
POST /api/auth/login       | PUBLIC   | Login with email/password
POST /api/auth/logout      | AUTH     | Destroy session
GET  /api/auth/me          | AUTH     | Get current user profile

## SHIPMENTS (CUSTOMER + ADMIN)
GET  /api/shipments        | CUST:own | ADMIN:all | List with pagination/filter
POST /api/shipments        | CUST:self| ADMIN:any | Create + auto-calc tariff
GET  /api/shipments/[id]   | CUST:own | ADMIN:all | Detail + vehicle + history
PATCH /api/shipments/[id]  | CUST:DIPROSES only | ADMIN:full | Update fields
POST /api/shipments/[id]/cancel | CUST:DIPROSES | ADMIN:any | Cancel with reason
GET  /api/shipments/[id]/tracking | CUST:own | ADMIN:all | History log
GET  /api/shipments/[id]/invoice  | CUST:own | ADMIN:all | JSON or PDF download

## VEHICLES (ADMIN ONLY)
GET  /api/vehicles               | ADMIN | List all + filter status
POST /api/vehicles               | ADMIN | Create new vehicle
PATCH /api/vehicles/[id]         | ADMIN | Update status/capacity
POST /api/vehicles/[id]/assign   | ADMIN | Assign to shipment(s), update ETA
POST /api/admin/shipments/bulk-assign | ADMIN | Multi-shipment to 1 vehicle

## SUPPORT
POST /api/support/tickets        | AUTH  | Create ticket
GET  /api/support/tickets        | CUST:own | ADMIN:all | List with filter
GET  /api/support/tickets/[id]   | CUST:own | ADMIN:all | Detail + messages
POST /api/support/tickets/[id]/messages | AUTH | Add chat message
PATCH /api/admin/support/tickets/[id] | ADMIN | Update status, compensation, escalate

## ANALYTICS (ADMIN ONLY)
GET /api/admin/analytics/overview   | Revenue, pending, delays, SLA
GET /api/admin/analytics/routes     | Top routes, avg time, utilization
GET /api/admin/analytics/vehicles   | Capacity usage, trip count
GET /api/admin/analytics/customers  | Repeat rate, avg value
GET /api/admin/analytics/trends     | 30/60/90 day forecast (moving avg)

## SYSTEM (ADMIN ONLY)
GET  /api/admin/users              | List customers/admins
PATCH /api/admin/users/[id]        | Reset password, change role, soft delete
GET  /api/admin/settings           | Get config (tariffs, notif templates, flags)
PATCH /api/admin/settings          | Update config
GET  /api/admin/audit-logs         | Filter by user/resource/date
POST /api/admin/automations/test   | Trigger auto-assign/notify/invoice manually