import { test, expect } from '@playwright/test';

test('should navigate to new product page when link is clicked', async ({ page }) => {
  await page.goto('/products');

  // Check if the link is visible
  await expect(page.locator('a[href="/products/new"]')).toBeVisible();

  await page.locator('a[href="/products/new"]').click();

  await expect(page.url()).toContain('/products/new');
});

test('should render existing products under their correct categories', async ({ page }) => {
  await page.request.post('/e2e/create_sample_products');

  await page.goto('/products');

  // should find an h2 with text "Products"
  const productsHeadingLocator = page.locator('h2:has-text("Products")');
  await expect(productsHeadingLocator).toBeVisible();
  // should find a single a with text "Digital Product"
  const productLocator = productsHeadingLocator.locator('+ table a:has-text("Digital Product")') 
  await expect(productLocator).toBeVisible();

  // should find an h2 with text "Services"
  const servicesHeadingLocator = page.locator('h2:has-text("Services")');
  await expect(servicesHeadingLocator).toBeVisible();
  // should find 3 a elements with hrefs that include /products
  const servicesLocator = servicesHeadingLocator.locator('+ table a[href*="/products/"]');
  await expect(servicesLocator).toHaveCount(3);
});