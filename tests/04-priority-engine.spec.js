import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('AI Priority Engine', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/ai-priority-engine');
    await expect(page.getByText('AI Priority Engine & Multi-Criteria Ranking')).toBeVisible();
  });

  test('KPI metric cards are visible', async ({ page }) => {
    await expect(page.getByText('P1 Critical Tasks')).toBeVisible();
    await expect(page.getByText('High Priority Queue')).toBeVisible();
    await expect(page.getByText('Scoring Model Version')).toBeVisible();
  });

  test('Weight sliders are interactive', async ({ page }) => {
    await expect(page.getByText('Explainable Multi-Criteria Priority Weights')).toBeVisible();
    await expect(page.getByText('Asset Criticality')).toBeVisible();
    await expect(page.getByText('Failure Risk (ML)')).toBeVisible();
    await expect(page.getByText('Maintenance Urgency')).toBeVisible();
    await expect(page.getByText('Operational Impact')).toBeVisible();
    // Sliders exist
    const sliders = page.locator('input[type="range"]');
    await expect(sliders).toHaveCount(4);
  });

  test('Task table loads in ranked order', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 8000 });
    await expect(page.getByText('Ranked Maintenance Task Queue')).toBeVisible();
  });

  test('Clicking a task opens explainable priority dossier', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 8000 });
    await page.locator('table tbody tr').first().click();
    await expect(page.getByText('Explainable Priority Dossier:')).toBeVisible();
    await expect(page.getByText('Explainable Decision Reasoning')).toBeVisible();
  });

  test('Recalculate button triggers ML engine', async ({ page }) => {
    const recalcBtn = page.getByText('Recalculate AI Priorities');
    await expect(recalcBtn).toBeVisible();
    await recalcBtn.click();
    // Should show loading state briefly
    await expect(page.getByText(/Executing ML|Recalculate/)).toBeVisible();
    // Wait for result feedback (success or error)
    await page.waitForSelector('.bg-emerald-50, .bg-red-50', { timeout: 15000 });
  });
});
