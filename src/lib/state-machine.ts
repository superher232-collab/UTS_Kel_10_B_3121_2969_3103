import { ShipmentStatus } from '@prisma/client'

const ALLOWED_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  [ShipmentStatus.DIPROSES]: [ShipmentStatus.DALAM_PENGIRIMAN, ShipmentStatus.DIBATALKAN, ShipmentStatus.MENUNGGU_PEMBATALAN],
  [ShipmentStatus.DALAM_PENGIRIMAN]: [ShipmentStatus.SAMPAI, ShipmentStatus.PENDING],
  [ShipmentStatus.SAMPAI]: [ShipmentStatus.SELESAI, ShipmentStatus.PENDING],
  [ShipmentStatus.PENDING]: [ShipmentStatus.DALAM_PENGIRIMAN, ShipmentStatus.SAMPAI],
  [ShipmentStatus.SELESAI]: [],
  [ShipmentStatus.DIBATALKAN]: [],
  [ShipmentStatus.MENUNGGU_PEMBATALAN]: [ShipmentStatus.DIBATALKAN, ShipmentStatus.DIPROSES]
}

export const validateStatusTransition = (current: ShipmentStatus, next: ShipmentStatus): boolean => {
  const allowed = ALLOWED_TRANSITIONS[current]
  return allowed ? allowed.includes(next) : false
}
