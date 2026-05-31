// src/test/unit/billing.test.ts
import { describe, it, expect, vi } from 'vitest'

// Mock next-auth and Next.js APIs before importing actions
vi.mock('@/auth', () => ({
  auth: vi.fn(),
  handlers: {},
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

import { calculateTariff } from '../../lib/actions'
import { ShippingType } from '@prisma/client'


describe('PrimeLog Billing & Pricing Engine Tests (BR-04 & BR-05)', () => {
  
  it('should calculate shipping rates successfully based on parameters', async () => {
    // Distance: 100km, Weight: 10kg, Mode: DARAT (Coefficient 2000), Flat fee: 25,000
    // Math: (100 * 10 * 2000) + 25,000 = 2,025,000
    const price = await calculateTariff(10, 100, ShippingType.DARAT)
    expect(price).toBe(2025000)
  })

  it('should use marine coefficients correctly for sea cargo', async () => {
    // Distance: 50km, Weight: 2kg, Mode: LAUT (Coefficient 1500), Flat fee: 25,000
    // Math: (50 * 2 * 1500) + 25,000 = 175,000
    const price = await calculateTariff(2, 50, ShippingType.LAUT)
    expect(price).toBe(175000)
  })

  it('should compute zero pricing when cargo weight is below 0.1 kg', async () => {
    const price = await calculateTariff(0.09, 100, ShippingType.LAUT)
    expect(price).toBe(0)
  })
})
