import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('Dynamic Replanning', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/#/dynamic-replanning');
    await expect(page.getByText('Dynamic Replanning & Contingency Engine')).toBeVisible();
  });

  test('Step 1 configuration panel is visible', async ({ page }) => {
    await expect(page.getByText('Step 1: Configure Operational Disruption Event')).toBeVisible();
    await expect(page.getByText('Disruption Event Type')).toBeVisible();
    await expect(page.getByText('Affected Railway Section')).toBeVisible();
    await expect(page.getByText('Delay / Extension (Minutes)')).toBeVisible();
  });

  test('Event type dropdown has all 5 options', async ({ page }) => {
    const select = page.locator('select').first();
    const options = await select.locator('option').allTextContents();
    expect(options.length).toBe(5);
  });

  test('Delay buttons are selectable', async ({ page }) => {
    await page.getByRole('button', { name: '+60m' }).click();
    // Button should show active state (bg-[#002869])
    await expect(page.getByRole('button', { name: '+60m' })).toBeVisible();
  });

  test('Simulate disruption detects conflicts', async ({ page }) => {
    await page.getByText('Simulate Disruption & Detect Conflicts').click();
    // Wait for conflict detection result
    await page.waitForSelector('text=Step 2: Conflict Detected', { timeout: 20000 });
    await expect(page.getByText('Step 2: Conflict Detected')).toBeVisible();
  });

  test('Full flow: simulate → replan → accept', async ({ page }) => {
    // Step 1: Simulate
    await page.getByText('Simulate Disruption & Detect Conflicts').click();
    await page.waitForSelector('text=Step 2: Conflict Detected', { timeout: 20000 });

    // Step 2: Run AI Replanner
    await page.getByText('Run Dynamic AI Replanner').click();
    await page.waitForSelector('text=Step 3: AI REPLANNING RESULTS', { timeout: 25000 });
    await expect(page.getByText('Original Approved Plan vs. Proposed AI Replanned Plan')).toBeVisible();

    // Step 3: Accept
    await page.getByText('Accept & Deploy AI Replan').click();
    await page.waitForSelector('.bg-emerald-50', { timeout: 8000 });
    await expect(page.getByText(/accepted and deployed/i)).toBeVisible();
  });

  test('Full flow: simulate → replan → reject', async ({ page }) => {
    await page.getByText('Simulate Disruption & Detect Conflicts').click();
    await page.waitForSelector('text=Step 2: Conflict Detected', { timeout: 20000 });
    await page.getByText('Run Dynamic AI Replanner').click();
    await page.waitForSelector('text=Step 3: AI REPLANNING RESULTS', { timeout: 25000 });
    await page.getByText('Reject (Keep Original Schedule)').click();
    await expect(page.getByText(/Original approved maintenance schedule/i)).toBeVisible({ timeout: 5000 });
  });

  test('Manual Override modal opens and closes', async ({ page }) => {
    await page.getByText('Simulate Disruption & Detect Conflicts').click();
    await page.waitForSelector('text=Step 2: Conflict Detected', { timeout: 20000 });
    await page.getByText('Run Dynamic AI Replanner').click();
    await page.waitForSelector('text=Step 3: AI REPLANNING RESULTS', { timeout: 25000 });
    await page.getByText('Manual Override').click();
    await expect(page.getByText('Manual Timetable Override Workbench')).toBeVisible();
    await page.getByText('Cancel').click();
    await expect(page.getByText('Manual Timetable Override Workbench')).not.toBeVisible();
  });
});
