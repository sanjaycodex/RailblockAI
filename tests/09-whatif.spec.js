import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('What-If Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/what-if-simulator');
    await expect(page.getByText('What-If Scenario Simulation Workbench')).toBeVisible();
  });

  test('5 scenario cards are visible', async ({ page }) => {
    await expect(page.getByText('A. Train Delay (Headway Conflict)')).toBeVisible();
    await expect(page.getByText('B. Emergency Track Fracture / OHE Trip')).toBeVisible();
    await expect(page.getByText('C. Block Window Withdrawn by Control')).toBeVisible();
    await expect(page.getByText('D. Machine Breakdown & Window Over-run')).toBeVisible();
    await expect(page.getByText('E. Seasonal Passenger/Freight Traffic Surge')).toBeVisible();
  });

  test('Selecting a different scenario updates parameter options', async ({ page }) => {
    await page.getByText('B. Emergency Track Fracture / OHE Trip').click();
    await expect(page.getByText('Estimated Duration (Min)')).toBeVisible();
  });

  test('Parameter buttons are selectable', async ({ page }) => {
    await page.getByRole('button', { name: '60 min' }).first().click();
    await expect(page.getByRole('button', { name: '60 min' }).first()).toBeVisible();
  });

  test('Run simulation produces Before/After results', async ({ page }) => {
    await page.getByText('Run What-If Simulation').click();
    await page.waitForSelector('text=MONTE CARLO PROJECTION RESULTS', { timeout: 30000 });
    await expect(page.getByText('Before vs. After Calculated Impact Metrics')).toBeVisible();
    await expect(page.getByText('Network Availability')).toBeVisible();
    await expect(page.getByText('Optimization Score')).toBeVisible();
    await expect(page.getByText('Headway Delay Mitigation')).toBeVisible();
    await expect(page.getByText('Tasks Protected')).toBeVisible();
  });

  test('AI Recovery Strategy card shows after simulation', async ({ page }) => {
    await page.getByText('Run What-If Simulation').click();
    await page.waitForSelector('text=MONTE CARLO PROJECTION RESULTS', { timeout: 30000 });
    await expect(page.getByText('AI Recommended Recovery Strategy')).toBeVisible();
  });

  test('Apply New Plan button changes to confirmed state', async ({ page }) => {
    await page.getByText('Run What-If Simulation').click();
    await page.waitForSelector('text=MONTE CARLO PROJECTION RESULTS', { timeout: 30000 });
    const applyBtn = page.getByText('Apply New Plan to Production');
    await expect(applyBtn).toBeVisible();
    await applyBtn.click();
    await expect(page.getByText('Plan Applied to DB')).toBeVisible({ timeout: 8000 });
  });
});
