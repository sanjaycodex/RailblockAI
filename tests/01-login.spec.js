import { test, expect } from '@playwright/test';

test.describe('3 Separate Login Portals', () => {
  test('Login page displays 3 distinct role portals', async ({ page }) => {
    await page.goto('/#/login');
    await expect(page.getByText('RailBlockAI Command Access')).toBeVisible();
    await expect(page.getByText('Select Your Role Login Portal')).toBeVisible();
    await expect(page.getByRole('button', { name: /admin/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /planner/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /viewer/i }).first()).toBeVisible();
  });

  test('Admin portal one-click login redirects to Admin Control Panel', async ({ page }) => {
    await page.goto('/#/login');
    await page.getByRole('button', { name: /Instant ADMIN Login/i }).click();
    await page.waitForURL('**/#/admin-panel', { timeout: 10000 });
    await expect(page.getByText('Admin Approval & Inspection Hub')).toBeVisible();
  });

  test('Planner portal one-click login redirects to Planner Control Panel', async ({ page }) => {
    await page.goto('/#/login');
    await page.getByRole('button', { name: /planner/i }).first().click();
    await page.getByRole('button', { name: /Instant PLANNER Login/i }).click();
    await page.waitForURL('**/#/planner-panel', { timeout: 10000 });
    await expect(page.getByText('Planner Control & Assignment Panel')).toBeVisible();
    await expect(page.getByText('Live Field Staff & Viewer Availability Roster')).toBeVisible();
  });

  test('Viewer portal one-click login redirects to Viewer Monitoring Panel', async ({ page }) => {
    await page.goto('/#/login');
    await page.getByRole('button', { name: /viewer/i }).first().click();
    await page.getByRole('button', { name: /Instant VIEWER Login/i }).click();
    await page.waitForURL('**/#/viewer-panel', { timeout: 10000 });
    await expect(page.getByText('Corridor Operations & Plan Monitor')).toBeVisible();
    await expect(page.getByText('READ-ONLY AUTHORIZATION')).toBeVisible();
  });
});
