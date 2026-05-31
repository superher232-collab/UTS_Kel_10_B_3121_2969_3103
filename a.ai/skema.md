# PRIMELOG - DATABASE SCHEMA (PRISMA)

## ENUMS
enum Role { ADMIN, CUSTOMER }
enum ShipmentStatus { DIPROSES, DALAM_PENGIRIMAN, SAMPAI, SELESAI, DIBATALKAN }
enum VehicleStatus { TERSEDIA, DIPAKAI, PERBAIKAN }
enum TicketStatus { OPEN, IN_PROGRESS, RESOLVED, CLOSED, ESCALATED }
enum TicketSeverity { LOW, MEDIUM, HIGH, CRITICAL }

## MODELS
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String   // bcrypt
  role        Role     @default(CUSTOMER)
  name        String
  phone       String?
  emailNotif  Boolean  @default(true)
  createdAt   DateTime @default(now())
  shipments   Shipment[]
  tickets     SupportTicket[]
  chatMessages ChatMessage[]
  auditLogs   AuditLog[]
}

model Vehicle {
  id        String         @id @default(uuid())
  name      String
  type      String         // KAPAL | TRUCK | PESAWAT
  plateNo   String         @unique
  capacity  Float          // kg
  status    VehicleStatus  @default(TERSEDIA)
  createdAt DateTime       @default(now())
  shipments Shipment[]
}

model Shipment {
  id              String          @id @default(uuid())
  receiptNo       String          @unique
  userId          String
  user            User            @relation(fields: [userId], references: [id])
  senderName      String
  receiverName    String
  origin          String
  destination     String
  itemName        String
  weight          Float           // >= 0.1
  tariff          Float
  status          ShipmentStatus  @default(DIPROSES)
  eta             DateTime?
  currentLocation String?         // TEXT ONLY (e.g., "Jakarta Hub")
  vehicleId       String?
  vehicle         Vehicle?        @relation(fields: [vehicleId], references: [id])
  proofPhotoUrl   String?
  proofSignature  String?
  deliveredAt     DateTime?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  trackingHistory TrackingHistory[]
  ticket          SupportTicket?
  invoice         Invoice?
  @@index([userId, status])
  @@index([receiptNo])
}

model TrackingHistory {
  id             String   @id @default(uuid())
  shipmentId     String
  shipment       Shipment @relation(fields: [shipmentId], references: [id])
  previousStatus String?
  newStatus      String
  notes          String?
  changedBy      String?  // userId or "SYSTEM"
  changedAt      DateTime @default(now())
  @@index([shipmentId, changedAt])
}

model SupportTicket {
  id               String        @id @default(uuid())
  ticketNo         String        @unique // TKT-XXXXXX
  userId           String
  user             User          @relation(fields: [userId], references: [id])
  shipmentId       String?
  shipment         Shipment?     @relation(fields: [shipmentId], references: [id])
  title            String
  description      String
  type             String        // COMPLAINT | INQUIRY | FEEDBACK
  severity         TicketSeverity @default(MEDIUM)
  status           TicketStatus  @default(OPEN)
  resolution       String?
  compensation     Float?
  compensationType String?       // REFUND | DISCOUNT | RESHIP | NONE
  createdAt        DateTime      @default(now())
  resolvedAt       DateTime?
  messages         ChatMessage[]
  @@index([userId, status])
}

model ChatMessage {
  id        String   @id @default(uuid())
  ticketId  String
  ticket    SupportTicket @relation(fields: [ticketId], references: [id])
  senderId  String
  sender    User     @relation(fields: [senderId], references: [id])
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  @@index([ticketId, createdAt])
}

model Invoice {
  id         String   @id @default(uuid())
  invoiceNo  String   @unique // INV-XXXXXX
  shipmentId String   @unique
  shipment   Shipment @relation(fields: [shipmentId], references: [id])
  subtotal   Float
  tax        Float?
  discount   Float?
  total      Float
  status     String   // DRAFT | ISSUED | PAID
  issuedAt   DateTime @default(now())
  paidAt     DateTime?
}

model AuditLog {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  action       String   // e.g., "SHIPMENT_STATUS_UPDATE"
  resourceType String   // "Shipment" | "User" | "Ticket"
  resourceId   String
  metadata     String?  // JSON
  createdAt    DateTime @default(now())
  @@index([userId, createdAt])
}

model SystemSettings {
  id        String   @id @default(uuid())
  key       String   @unique
  value     String   // JSON
  category  String   // "NOTIFICATION" | "TARIFF" | "FEATURE_FLAG"
  updatedAt DateTime @updatedAt
}