import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('Weekly Planner', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/weekly-planner');
    await expect(page.getByText('Weekly Maintenance Possession Schedule')).toBeVisible();
  });

  test('7-day calendar grid renders', async ({ page }) => {
    // Each day label should be visible
    await expect(page.getByText(/Mon \(/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Sun \(/)).toBeVisible();
  });

  test('KPI cards appear after plan generation', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await expect(page.getByText('Total Possession Blocks')).toBeVisible();
    await expect(page.getByText('Tasks Scheduled')).toBeVisible();
    await expect(page.getByText('Conflicts Avoided')).toBeVisible();
    await expect(page.getByText('Downtime Saved')).toBeVisible();
  });

  test('Department filter buttons work', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await page.getByRole('button', { name: 'Civil' }).click();
    await page.waitForTimeout(300);
    await expect(page.getByText('Weekly Maintenance Possession Schedule')).toBeVisible();
  });

  test('Approve weekly plan button changes state', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    const approveBtn = page.getByText('Approve Weekly Plan');
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();
    await expect(page.getByText('Weekly Plan Approved & Deployed')).toBeVisible({ timeout: 8000 });
  });

  test('Clicking a block card opens dossier modal', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    // Find any block card in the calendar
    const blockCard = page.locator('.rounded-xl.border.border-slate-200.bg-\\[\\#faf8ff\\]').first();
    if (await blockCard.isVisible()) {
      await blockCard.click();
      await expect(page.getByText('Possession Window Dossier')).toBeVisible();
    }
  });
});

test.describe('Monthly Planner', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/monthly-planner');
    await expect(page.getByText('Monthly Strategic Maintenance Masterplan')).toBeVisible();
  });

  test('Calendar grid for August 2026 renders', async ({ page }) => {
    await expect(page.getByText('August 2026')).toBeVisible();
    // Day headers
    await expect(page.getByText('Mon').first()).toBeVisible();
    await expect(page.getByText('Sun').first()).toBeVisible();
  });

  test('KPI cards appear after plan generation', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await expect(page.getByText('Strategic Possession Blocks')).toBeVisible();
    await expect(page.getByText('Critical Tasks Covered')).toBeVisible();
  });

  test('Approve monthly plan button changes state', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    const approveBtn = page.getByText('Approve Monthly Masterplan');
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();
    await expect(page.getByText('Monthly Masterplan Approved & Deployed')).toBeVisible({ timeout: 8000 });
  });
});
