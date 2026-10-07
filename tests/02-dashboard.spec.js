import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('KPI cards show live data', async ({ page }) => {
    await expect(page.getByText('TOTAL MAINTENANCE TASKS')).toBeVisible();
    await expect(page.getByText('In Queue')).toBeVisible();
    await expect(page.getByText('CRITICAL SAFETY DEFECTS')).toBeVisible();
    await expect(page.getByText('AVERAGE ASSET HEALTH INDEX')).toBeVisible();
    await expect(page.getByText('AVAILABLE BLOCK WINDOWS')).toBeVisible();
  });

  test('Corridor section cards are visible', async ({ page }) => {
    await expect(page.getByText('Tirunelveli–Madurai Corridor Section Status')).toBeVisible();
    // Should show at least one section card
    await expect(page.getByText('TEN-MEJ').first()).toBeVisible();
  });

  test('Clicking a section shows deep-dive dossier', async ({ page }) => {
    await page.getByText('TEN-MEJ').first().click();
    await expect(page.getByText('SELECTED SECTION TELEMETRY')).toBeVisible();
    await expect(page.getByText('Open Tasks')).toBeVisible();
  });

  test('Department workload bars are visible', async ({ page }) => {
    await expect(page.getByText('Department Workload Distribution')).toBeVisible();
    await expect(page.getByText('Civil Engineering')).toBeVisible();
    await expect(page.getByText('Signal & Telecom')).toBeVisible();
    await expect(page.getByText('Electrical (TRD)')).toBeVisible();
  });

  test('Smart Orchestration panel is visible', async ({ page }) => {
    await expect(page.getByText('Cross-Department Block Bundles')).toBeVisible();
    await expect(page.getByText('Saved Track Downtime')).toBeVisible();
  });

  test('Refresh button triggers reload', async ({ page }) => {
    const refreshBtn = page.locator('button[title="Refresh Live Metrics"]');
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();
    // Spinner should briefly appear — just check page stays intact
    await expect(page.getByText('Railway Maintenance & Block Orchestration')).toBeVisible();
  });

  test('Navigate to Maintenance Intelligence via table link', async ({ page }) => {
    await page.getByText('Open Intelligence Suite').click();
    await page.waitForURL('**/#/maintenance-intelligence', { timeout: 8000 });
    await expect(page.getByText('Maintenance Intelligence & Task Management')).toBeVisible();
  });
});
