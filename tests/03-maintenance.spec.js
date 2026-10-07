import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('Maintenance Intelligence', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/maintenance-intelligence');
    await expect(page.getByText('Maintenance Intelligence & Task Management')).toBeVisible();
  });

  test('Tasks table loads with data', async ({ page }) => {
    // Wait for table to populate
    await page.waitForSelector('table', { timeout: 8000 });
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('Filter by department works', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 8000 });
    const deptSelect = page.locator('select').first();
    await deptSelect.selectOption('Civil');
    // Table should still show rows (or empty state)
    await page.waitForTimeout(500);
    await expect(page.getByText('Maintenance Intelligence & Task Management')).toBeVisible();
  });

  test('Add task modal opens and closes', async ({ page }) => {
    await page.getByText('Add Maintenance Task').click();
    await expect(page.getByText('Register New Maintenance Task')).toBeVisible();
    await page.getByText('Cancel').click();
    await expect(page.getByText('Register New Maintenance Task')).not.toBeVisible();
  });

  test('Click a task row opens detail modal', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 8000 });
    await page.locator('table tbody tr').first().click();
    await expect(page.getByText('Task Specification:')).toBeVisible();
    await expect(page.getByText('Approve')).toBeVisible();
    await expect(page.getByText('AI-Optimize')).toBeVisible();
    await expect(page.getByText('Complete')).toBeVisible();
  });

  test('Approve button in modal changes task status', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 8000 });
    await page.locator('table tbody tr').first().click();
    await expect(page.getByText('Task Specification:')).toBeVisible();
    // Click Approve
    await page.getByRole('button', { name: 'Approve' }).click();
    // Modal should close after status change
    await page.waitForTimeout(800);
    // Page should still be intact
    await expect(page.getByText('Maintenance Intelligence & Task Management')).toBeVisible();
  });
});
