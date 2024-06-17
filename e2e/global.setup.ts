import { test as setup } from '@playwright/test';

setup('create new database', async ({ page }) => {
  await page.request.post('/e2e/reset_database');
});