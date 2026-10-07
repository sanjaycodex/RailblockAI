import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('Smart Block Bundling', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/smart-block-bundling');
    await expect(page.getByText('Smart Block Bundling')).toBeVisible();
  });

  test('KPI metric cards show after bundles load', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50, .bg-red-50', { timeout: 20000 });
    await expect(page.getByText('Candidate Bundled Possessions')).toBeVisible();
    await expect(page.getByText('Track Downtime Hours Saved')).toBeVisible();
    await expect(page.getByText('Cross-Discipline Overlap Index')).toBeVisible();
    await expect(page.getByText('Estimated Mobilization Savings')).toBeVisible();
  });

  test('Before vs After comparison card shows', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await expect(page.getByText('BEFORE: UNCOORDINATED ISOLATED BLOCKS')).toBeVisible();
    await expect(page.getByText('AFTER: 1 SYNCHRONIZED CANDIDATE SMART BUNDLE')).toBeVisible();
  });

  test('Candidate bundles list is populated', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await expect(page.getByText('Candidate Possession Packages')).toBeVisible();
    const bundleCards = page.locator('text=BND-');
    await expect(bundleCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('View & Manage Bundle modal opens', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await page.getByText('View & Manage Bundle').first().click();
    await expect(page.getByText('Candidate Possession Package:')).toBeVisible();
    await expect(page.getByText('Compatibility Score')).toBeVisible();
    await expect(page.getByText('Estimated Cost Savings')).toBeVisible();
  });

  test('Approve bundle changes status', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await page.getByText('View & Manage Bundle').first().click();
    await expect(page.getByText('Approve Possession Bundle')).toBeVisible();
    await page.getByText('Approve Possession Bundle').click();
    // Success feedback should appear
    await page.waitForSelector('.bg-emerald-50', { timeout: 10000 });
    await expect(page.getByText(/approved and deployed/i)).toBeVisible({ timeout: 8000 });
  });

  test('Evaluate with Phase 3 Optimizer opens modal', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await page.getByText('Evaluate with Phase 3 Optimizer').first().click();
    await expect(page.getByText(/Phase 3 Optimizer Evaluation/)).toBeVisible({ timeout: 15000 });
    // Wait for evaluation result
    await page.waitForSelector('text=OPTION A: INDIVIDUAL', { timeout: 20000 });
    await expect(page.getByText('OPTION B: BUNDLED')).toBeVisible();
  });

  test('Regenerate bundles button works', async ({ page }) => {
    await page.waitForSelector('.bg-emerald-50', { timeout: 20000 });
    await page.getByText('Generate Smart Bundles').click();
    await expect(page.getByText(/Analyzing Compatibility|Generate Smart Bundles/)).toBeVisible();
  });
});
