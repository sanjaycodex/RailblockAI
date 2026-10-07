// Shared helper: login as Admin with one click
export async function loginAsAdmin(page) {
  await page.goto('/#/login');
  await page.getByRole('button', { name: /Admin/i }).first().click();
  // Wait for redirect to dashboard
  await page.waitForURL('**/#/dashboard', { timeout: 10000 });
}
