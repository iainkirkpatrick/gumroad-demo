import { test, expect } from '@playwright/test';

test.describe('general product functionality', () => {
  test('should be able to create a new digital product', async ({ page }) => {
    await page.goto('/products');

    // click through to new product form
    await expect(page.locator('a[href="/products/new"]')).toBeVisible();
    await page.locator('a[href="/products/new"]').click();

    const productName = 'Test Digital Product';
    const productPrice = '10';
    const productDescription = 'This is a test description';
    const productContent = 'This is test content.';

    // fill out new product form
    await expect(page.url()).toContain('/products/new');
    await page.locator('input[name="product[name]"]').fill(productName);
    await page.locator('button:has-text("Digital product")').click();
    await page.locator('input[name="product[price_range]"]').fill(productPrice);
    await page.locator('button[form="new-product-form"]').click();

    // fill out remaining product details
    await expect(page.getByRole('heading', { name: productName })).toBeVisible();
    await expect(page.locator('input[name="product[name]"]')).toHaveValue(productName);
    await expect(page.locator('input[name="product[price_range]"]')).toHaveValue(productPrice);
    await page.locator('textarea[name="product[description]"]').fill(productDescription);
    await page.getByRole('button', { name: 'Save and continue' }).click();

    // fill out product content
    await page.waitForFunction(() => window.location.hash === '#content');
    await expect(page.locator('a[href="#content"]')).toHaveClass(/bg-white/)
    await page.locator('.tiptap').fill(productContent);
    await page.getByRole('button', { name: 'Publish and continue' }).click();

    // click back to previous tabs and confirm content saved
    await page.waitForFunction(() => window.location.hash === '#share');
    await page.locator('header').locator('a[href="#"]').click();
    await expect(page.locator('a[href="#"]')).toHaveClass(/bg-white/)
    await expect(page.locator('textarea[name="product[description]"]')).toHaveValue(productDescription);
    await page.locator('header').locator('a[href="#content"]').click();
    await page.waitForFunction(() => window.location.hash === '#content');
    await expect(page.locator('.tiptap')).toHaveText(productContent);

    // navigate back to products page and confirm product is listed
    await page.locator('nav').locator('a[href="/products"]').click();
    await expect(page.url()).toContain('/products');
    await expect(page.locator(`a:has-text("${productName}")`)).toBeVisible();
  });

  test('should be able to navigate to an existing product\'s edit page', async ({ page }) => {
    await page.request.post('/e2e/create_sample_products');

    await page.goto('/products');

    // should find an h2 with text "Services"
    const servicesHeadingLocator = page.locator('h2:has-text("Services")');
    const firstServiceLocator = servicesHeadingLocator.locator('+ table a[href*="/products/"]').first()
    const firstServiceName = await firstServiceLocator.innerText();
    await firstServiceLocator.click();

    await expect(page.url()).toContain('/products/');
    // should have navigated to the edit page for the product
    await expect(page.url()).toContain('edit');

    // should see the product name heading, and at least a text input with the name already filled out
    await expect(page.getByRole('heading', { name: firstServiceName })).toBeVisible();
    await expect(page.locator(`input[value="${firstServiceName}"]`)).toBeVisible();
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
})

// coffee
// a creator should be able to create a coffee product
// a creator should be able to add a thanks message
// when buying a product, if seller has a coffee product, it gets added to the cart
test.describe('coffee', () => {
  test('should be able to create a coffee product', async ({ page }) => {
    await page.goto('/products');
  });
});

// calls
// a creator should be able to create a calls product
// a creator should be able to add calls product tiers, each with a separate calendar link
// when buying a call, buyer should get access to their calendar, and be able to book a time
test.describe('calls', () => {
  test('should be able to create a calls product', async ({ page }) => {
    await page.goto('/products');
  });
});

// commissions
// a creator should be able to create a commissions product
// a creator should be able to add commissions product tiers, each with separate content
// when buying a commission, a buyer should get access to the content
test.describe('commissions', () => {
  test('should be able to create a commissions product', async ({ page }) => {
    await page.goto('/products');
  });
});