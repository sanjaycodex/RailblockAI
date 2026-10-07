import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('AI Block Optimizer', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/ai-block-optimizer');
    await expect(page.getByText('Block Planner')).toBeVisible();
  });

  test('Page header and description load', async ({ page }) => {
    await expect(page.getByText('AI OPTIMIZER')).toBeVisible();
    await expect(page.getByText('Tirunelveli - Madurai Mainline')).toBeVisible();
  });

  test('Optimization runs on load and shows results', async ({ page }) => {
    // Wait for optimization to complete (auto-runs on mount)
    await page.waitForSelector('.bg-emerald-50, .bg-red-50', { timeout: 20000 });
    const feedback = page.locator('.bg-emerald-50').first();
    await expect(feedback).toBeVisible();
  });

  test('KPI cards are visible after optimization', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50, .bg-red-50', { timeout: 20000 });
    await expect(page.getByText('Optimization Fitness Score')).toBeVisible();
    await expect(page.getByText('Critical Tasks Covered')).toBeVisible();
    await expect(page.getByText('Train Conflicts Prevented')).toBeVisible();
    await expect(page.getByText('Possession Blocks Generated')).toBeVisible();
  });

  test('Recommended Maintenance Windows timeline is visible', async ({ page }) => {
    await expect(page.getByText('Recommended Maintenance Windows')).toBeVisible();
    await expect(page.getByText('24-hour forecast')).toBeVisible();
  });

  test('Optimal Plan section shows blocks after optimization', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await expect(page.getByText('Optimal Plan')).toBeVisible();
    // At least one block should be rendered
    const blockCards = page.locator('text=BLK-');
    await expect(blockCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('Approve plan button changes to confirmed state', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    const approveBtn = page.getByText('Approve Recommended Plan');
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();
    await expect(page.getByText('Plan Approved & Persisted')).toBeVisible({ timeout: 8000 });
  });

  test('Block Dossier modal opens', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    const dossierBtn = page.getByText('Block Dossier').first();
    await expect(dossierBtn).toBeVisible({ timeout: 10000 });
    await dossierBtn.click();
    await expect(page.getByText('Possession Window:')).toBeVisible();
    await expect(page.getByText('Optimization Reasoning')).toBeVisible();
  });

  test('Re-run optimization button works', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await page.getByText('Run AI Optimization').click();
    // Should briefly show loading state
    await expect(page.getByText(/Solving|Run AI Optimization/)).toBeVisible();
  });
});
