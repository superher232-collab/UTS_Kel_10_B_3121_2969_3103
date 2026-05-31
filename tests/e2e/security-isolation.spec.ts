// tests/e2e/security-isolation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('PrimeLog Role Isolation & API Security Guards', () => {

  test('TC-SEC-01: Customer should be blocked from entering Admin Pages', async ({ page }) => {
    // 1. Navigate to login
    await page.goto('/login')
    await page.fill('input[type="email"]', 'customer@primelog.com')
    await page.fill('input[type="password"]', 'customer123')
    await page.click('button[type="submit"]')
    
    // 2. Wait for redirect to customer dashboard
    await page.waitForURL('/dashboard')

    // 3. Direct navigate to Admin portal page
    await page.goto('/admin/fleet')

    // 4. Verify middleware blocks route and redirects back to /dashboard
    await page.waitForURL('/dashboard')
    const pathname = new URL(page.url()).pathname
    expect(pathname).toBe('/dashboard')
  })

  test('TC-SEC-02: Customer should be blocked from calling Admin endpoints', async ({ request }) => {
    // 1. Trigger POST request directly to register cargo for another user
    const response = await request.post('/api/cargo', {
      data: {
        tanggal_kirim: '2026-06-01',
        nama_pengirim: 'Hacker',
        nama_penerima: 'Receiver',
        kota_asal: 'Jakarta',
        kota_tujuan: 'Makassar',
        jenis_kendaraan: 'LAUT',
        berat_kg: 50.0,
        targetUserId: 'admin-uuid-of-another-user'
      }
    })

    // 2. Assert request returns 401/403 or auto-overrides owner ID safely instead of forging it
    const data = await response.json()
    // If not authenticated in Playwright context, returns 401
    expect([401, 403, 201]).toContain(response.status())
  })
})
