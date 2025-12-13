import { expect, test } from '@playwright/test';

// Basic smoke test to ensure the app boots and home route renders

test('home page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Budgeto/i);
});
