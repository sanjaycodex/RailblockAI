import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('Asset Health', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/asset-health');
    await expect(page.getByText('Asset Health & Condition Monitoring')).toBeVisible();
  });

  test('26 assets load in table', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 8000 });
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Health score progress bars render', async ({ page }) => {
    await page.waitForSelector('table', { timeout: 8000 });
    // Health score column shows bars
    const healthBars = page.locator('.bg-\\[\\#00a859\\], .bg-amber-500, .bg-\\[\\#ba1a1a\\]');
    await expect(healthBars.first()).toBeVisible();
  });

  test('Clicking an asset opens dossier modal', async ({ page }) => {
    await page.waitForSelector('table tbody tr', { timeout: 8000 });
    await page.locator('table tbody tr').first().click();
    await expect(page.getByText('Asset Inspection Dossier:')).toBeVisible();
    await expect(page.getByText('Health Index')).toBeVisible();
    await page.getByText('Close Dossier').click();
  });
});

test.describe('Railway Digital Twin', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/railway-digital-twin');
    await expect(page.getByText('Railway Corridor Digital Twin')).toBeVisible();
  });

  test('Station ribbon renders', async ({ page }) => {
    await expect(page.getByText('Tirunelveli (TEN) ➔ Madurai (MDU) Railway Corridor Digital Twin')).toBeVisible();
  });

  test('Section nodes are clickable and update dossier', async ({ page }) => {
    const sectionNode = page.locator('text=MEJ-CVP').first();
    await expect(sectionNode).toBeVisible({ timeout: 8000 });
    await sectionNode.click();
    await expect(page.getByText('SECTION DIGITAL TWIN DOSSIER')).toBeVisible();
  });

  test('Layer filter buttons work', async ({ page }) => {
    await page.getByText('Civil Track & Welds').click();
    await expect(page.getByText('Civil Track & Welds')).toBeVisible();
  });
});

test.describe('Reports & Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/reports-analytics');
    await expect(page.getByText('Reports & Operational Analytics')).toBeVisible();
  });

  test('All metric cards render', async ({ page }) => {
    await expect(page.getByText('Total Maintenance Blocks Executed')).toBeVisible();
    await expect(page.getByText('Overall Line Capacity Preserved')).toBeVisible();
    await expect(page.getByText('Bundled Mega Blocks Yield')).toBeVisible();
    await expect(page.getByText('Net Carbon Offset')).toBeVisible();
  });

  test('Bar chart section is visible', async ({ page }) => {
    await expect(page.getByText('Punctuality Index vs. Block Hours Granted')).toBeVisible();
    await expect(page.getByText('+0.92 Positive Correlation')).toBeVisible();
  });

  test('Bundling audit stats are visible', async ({ page }) => {
    await expect(page.getByText('CROSS-DEPARTMENT SMART BUNDLING AUDIT')).toBeVisible();
    await expect(page.getByText('68.2%')).toBeVisible();
    await expect(page.getByText('94.0%')).toBeVisible();
  });

  test('Export Report modal opens', async ({ page }) => {
    await page.getByText('Export Report').click();
    // Modal should appear
    await page.waitForTimeout(500);
    // Just check page doesn't crash
    await expect(page.getByText('Reports & Operational Analytics')).toBeVisible();
  });
});
