import { test, expect } from '@playwright/test'

test.describe('Smart Factory Automation System - End-to-End Flow Test', () => {

  test('Complete End-to-End Enterprise Workflow', async ({ page }) => {
    // 1. Visit Login Page
    await page.goto('/login')
    await expect(page.locator('div:has-text("Forge")').first()).toBeVisible()
    await expect(page.locator('text=ENTERPRISE AUTOMATION')).toBeVisible()

    // 2. Perform Login with Seeded Admin Account
    await page.fill('input[type="email"]', 'adminsatu@forge.inc')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Wait for navigation to Dashboard
    await page.waitForURL('http://localhost:6061/')
    await expect(page.locator('main h1')).toContainText(/Executive Dashboard|Control Room/i)

    // 3. Verify Executive Dashboard KPI Summary Cards
    await expect(page.locator('text=Total Products').first()).toBeVisible()
    await expect(page.locator('text=Today\'s Production').first()).toBeVisible()
    await expect(page.locator('text=Low Stock Alerts').first()).toBeVisible()

    // 4. Test Master Products Module Integration
    await page.click('button:has-text("Products")')
    await expect(page.locator('main h1')).toContainText(/Products Management/i)
    await expect(page.locator('table')).toBeVisible()

    // 5. Test Production Logs Module Integration
    await page.click('button:has-text("Production Logs")')
    await expect(page.locator('main h1')).toContainText(/Production Logs/i)
    await expect(page.locator('button:has-text("Submit Log")')).toBeVisible()

    // 6. Test Inventory Management & Stock Out Module
    await page.click('button:has-text("Inventory")')
    await expect(page.locator('main h1')).toContainText(/Inventory Management/i)
    await expect(page.locator('text=Stock Movement').first()).toBeVisible()

    // 7. Test User Management Module
    await page.click('button:has-text("Users")')
    await expect(page.locator('main h1')).toContainText(/User Management/i)
    await expect(page.locator('text=Role Permissions').first()).toBeVisible()

    // 8. Test Analytics & Reports Module
    await page.click('button:has-text("Reports")')
    await expect(page.locator('main h1')).toContainText(/Analytics & Reports/i)
    await expect(page.locator('text=Monthly Production Yield').first()).toBeVisible()

    // 9. Test Settings Module
    await page.click('button:has-text("Settings")')
    await expect(page.locator('main h1')).toContainText(/System Settings/i)

    // 10. Logout Confirmation Modal Test
    await page.click('button:has-text("Logout")')
    await expect(page.getByRole('heading', { name: 'Confirm Sign Out' })).toBeVisible()
    await page.click('button:has-text("Yes, Sign Out")')

    // Verify redirected back to /login
    await page.waitForURL('http://localhost:6061/login')
    await expect(page.locator('text=ENTERPRISE AUTOMATION')).toBeVisible()
  })
})
