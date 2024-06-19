import { test, expect, request } from '@playwright/test';

test.describe('general product functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('/e2e/reset_database');
  });

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

test.describe('coffee', () => {
  test.beforeEach(async () => {
    const reqCtx = await request.newContext()
    await reqCtx.post('/e2e/reset_database');
    await reqCtx.post('/e2e/create_sample_products');
  });

  test('should be able to create a coffee product', async ({ page }) => {
    await page.goto('/products');

    // click through to new product form
    await expect(page.locator('a[href="/products/new"]')).toBeVisible();
    await page.locator('a[href="/products/new"]').click();

    const productName = 'Test Coffee Product';
    const productPrice = '5';
    const productDescription = 'This is a test coffee description';
    const productContent = 'This is test coffee content.';
    const productThanks = 'Thank you for your purchase!';
    const productFirstTierName = 'Coffee';
    const productFirstTierDescription = 'You buy me a coffee.';
    const productSecondTierName = 'Pizza';
    const productSecondTierPrice = '20';
    const productSecondTierDescription = 'I can afford a pizza!';
    const productSecondTierContent = 'This is test content for the second tier.';

    // fill out new product form
    await expect(page.url()).toContain('/products/new');
    await page.locator('input[name="product[name]"]').fill(productName);
    await page.locator('button:has-text("Coffee")').click();
    await page.locator('input[name="product[tiers][0][price]"]').fill(productPrice);
    await page.locator('button[form="new-product-form"]').click();

    // // fill out remaining product details
    await expect(page.getByRole('heading', { name: productName })).toBeVisible();
    await expect(page.locator('input[name="product[name]"]')).toHaveValue(productName);
    await page.locator('textarea[name="product[description]"]').fill(productDescription);
    await page.locator('textarea[name="product[thanks_message]"]').fill(productThanks);

    // name the generated tier, and create a new tier
    const firstTierLocator = page.locator('li:nth-child(1)');
    await firstTierLocator.locator('button[data-testid="button-tier-toggle"]').click();
    // expect first tier to have been given the initial price specified
    await expect(page.locator('input[name="tier[price]"]')).toHaveValue(productPrice);
    await firstTierLocator.locator('input[name="tier[name]"]').fill(productFirstTierName);
    await firstTierLocator.locator('textarea[name="tier[description]"]').fill(productFirstTierDescription);
    await page.locator('button:has-text("Add tier")').click();
    const secondTierLocator = page.locator('li:nth-child(2)');
    await secondTierLocator.locator('button[data-testid="button-tier-toggle"]').click();
    await secondTierLocator.locator('input[name="tier[name]"]').fill(productSecondTierName);
    await secondTierLocator.locator('textarea[name="tier[description]"]').fill(productSecondTierDescription);
    await secondTierLocator.locator('input[name="tier[price]"]').fill(productSecondTierPrice);
    await page.getByRole('button', { name: 'Save and continue' }).click();

    // fill out product content, for each tier
    await page.waitForFunction(() => window.location.hash === '#content');
    await expect(page.locator('a[href="#content"]')).toHaveClass(/bg-white/)
    await page.locator('.tiptap').fill(productContent);
    await page.locator('button:has-text("Editing")').click();
    await page.getByRole('button', { name: productSecondTierName }).click();
    await page.locator('.tiptap').fill(productSecondTierContent);
    await page.getByRole('button', { name: 'Publish and continue' }).click();

    // click back to previous tabs and confirm content saved
    await page.waitForFunction(() => window.location.hash === '#share');
    await page.locator('header').locator('a[href="#"]').click();
    await expect(page.locator('a[href="#"]')).toHaveClass(/bg-white/)
    await firstTierLocator.locator('button[data-testid="button-tier-toggle"]').click();
    await expect(firstTierLocator.locator('textarea[name="tier[description]"]')).toHaveValue(productFirstTierDescription);
    await secondTierLocator.locator('button[data-testid="button-tier-toggle"]').click();
    await expect(secondTierLocator.locator('textarea[name="tier[description]"]')).toHaveValue(productSecondTierDescription);
    await page.locator('header').locator('a[href="#content"]').click();
    await page.waitForFunction(() => window.location.hash === '#content');
    await expect(page.locator('.tiptap')).toHaveText(productContent);
    await page.locator('button:has-text("Editing")').click();
    await page.getByRole('button', { name: productSecondTierName }).click();
    await expect(page.locator('.tiptap')).toHaveText(productSecondTierContent);

    // navigate back to products page and confirm product is listed
    await page.locator('nav').locator('a[href="/products"]').click();
    await expect(page.url()).toContain('/products');
    await expect(page.locator(`a:has-text("${productName}")`)).toBeVisible();
  });

  test('should add a coffee product to the cart when buying a product, if coffee exists', async ({ page, context }) => {
    await page.goto('/products');

    const digitalTableElementLocator = page.locator('td').filter({ hasText: 'Digital Product' });
    const digitalParentElementLocator = digitalTableElementLocator.locator('..');
    const digitalExternalLinkLocator = digitalParentElementLocator.locator('a[href*="/l/"]');

    // click the external digital product link to open a new page
    const pagePromise = context.waitForEvent('page');
    await digitalExternalLinkLocator.click();
    const productPage = await pagePromise;
    // add the digital product to cart
    await productPage.locator('button:has-text("Add to cart")').click();

    // expect coffee product to also be in the cart, with correct thanks message for first tier, and correct total price for cart
    await expect(productPage.locator('h1:has-text("Checkout")')).toBeVisible();
    await expect(productPage.locator('li:has-text("Coffee Product")')).toBeVisible();
    await expect(productPage.locator('li:has-text("Coffee Product")').locator(`p:has-text("Thanks for supporting my work!")`)).toBeVisible();
    await expect(productPage.locator('p:has-text("Total")').locator('..').locator('p:has-text("$")')).toContainText('$15');
  });
});

test.describe('calls', () => {
  test.beforeEach(async () => {
    const reqCtx = await request.newContext()
    await reqCtx.post('/e2e/reset_database');
    await reqCtx.post('/e2e/create_sample_products');
  });

  test('should be able to create a calls product', async ({ page }) => {
    const calendlyLink = 'https://calendly.com/iain-oxlc/test-gumroad-meeting';
    const calendarFrameLocator = page.frameLocator('#iframe-calendar');
    const calendarFrameHeadingLocator = calendarFrameLocator.locator('h1:has-text("Test Gumroad Meeting")');

    await page.goto('/products');

    // click through to new product form
    await expect(page.locator('a[href="/products/new"]')).toBeVisible();
    await page.locator('a[href="/products/new"]').click();

    const productName = 'Test Calls Product';
    const productPrice = '500';
    const productDescription = 'This is a test coffee description';
    const productContent = 'This is test calls content.';

    // fill out new product form
    await expect(page.url()).toContain('/products/new');
    await page.locator('input[name="product[name]"]').fill(productName);
    await page.locator('button:has-text("Calls")').click();
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
    await page.locator('input[name="product[call_link]"]').fill(calendlyLink);
    await page.locator('[data-testid="button-addCalendar"]').click();
    // expect that the iframe has loaded correctly
    await calendarFrameHeadingLocator.waitFor({ state: 'visible' });
    await expect(calendarFrameHeadingLocator).toBeVisible();
    await page.locator('.tiptap').fill(productContent);
    await page.getByRole('button', { name: 'Publish and continue' }).click();

    // click back to previous tabs and confirm content saved
    await page.waitForFunction(() => window.location.hash === '#share');
    await page.locator('header').locator('a[href="#"]').click();
    await expect(page.locator('a[href="#"]')).toHaveClass(/bg-white/)
    await expect(page.locator('textarea[name="product[description]"]')).toHaveValue(productDescription);
    await page.locator('header').locator('a[href="#content"]').click();
    await page.waitForFunction(() => window.location.hash === '#content');
    // expect that the iframe has loaded correctly
    await calendarFrameHeadingLocator.waitFor({ state: 'visible' });
    await expect(calendarFrameHeadingLocator).toBeVisible();
    await expect(page.locator('.tiptap')).toHaveText(productContent);

    // navigate back to products page and confirm product is listed
    await page.locator('nav').locator('a[href="/products"]').click();
    await expect(page.url()).toContain('/products');
    await expect(page.locator(`a:has-text("${productName}")`)).toBeVisible();
  });

  // N.B. test doesn't test actually booking a call via the iframe, as that tests vendor implementation which is subject to change
  test('should get access to calendar when buying a calls product', async ({ page, context }) => {
    await page.goto('/products');

    const callsTableElementLocator = page.locator('td').filter({ hasText: 'Calls Product' });
    const callsParentElementLocator = callsTableElementLocator.locator('..');
    const callsExternalLinkLocator = callsParentElementLocator.locator('a[href*="/l/"]');

    // click the external calls product link to open a new page
    const pagePromiseCart = context.waitForEvent('page');
    await callsExternalLinkLocator.click();
    const productPage = await pagePromiseCart;
    // add the calls product to cart
    await productPage.locator('button:has-text("Add to cart")').click();

    await productPage.locator('button:has-text("Pay")').click()
    await expect(productPage.locator('h3:has-text("Your purchase was successful!")')).toBeVisible();
    const callsProductLocator = productPage.locator('li:has-text("Calls Product")');
    await expect(callsProductLocator).toBeVisible();
    // click the calls product content link to open a new page
    const pagePromiseContent = context.waitForEvent('page');
    await callsProductLocator.locator('a:has-text("View content")').click();
    const productContentPage = await pagePromiseContent;
    await expect(productContentPage.locator('h1:has-text("Calls Product")')).toBeVisible();
    // expect that the iframe has loaded correctly
    const calendarFrameLocator = productContentPage.frameLocator('#iframe-calendar');
    const calendarFrameHeadingLocator = calendarFrameLocator.locator('h1:has-text("Test Gumroad Meeting")');
    await calendarFrameHeadingLocator.waitFor({ state: 'visible' });
    await expect(calendarFrameHeadingLocator).toBeVisible();
  });
});

test.describe('commissions', () => {
  test.beforeEach(async () => {
    const reqCtx = await request.newContext()
    await reqCtx.post('/e2e/reset_database');
    await reqCtx.post('/e2e/create_sample_products');
  });

  test('should be able to create a commissions product', async ({ page }) => {
    await page.goto('/products');

    // click through to new product form
    await expect(page.locator('a[href="/products/new"]')).toBeVisible();
    await page.locator('a[href="/products/new"]').click();

    const productName = 'Test Commissions Product';
    const productPrice = '1000';
    const productDescription = 'This is a test description';
    const productContent = 'This is test content.';
    const productFirstTierName = 'Small Canvas';
    const productFirstTierDescription = 'Artwork on a small canvas.';
    const productSecondTierName = 'Large Canvas';
    const productSecondTierPrice = '5000';
    const productSecondTierDescription = 'Artwork on a large canvas.';
    const productSecondTierContent = 'This is test content for the second tier.';

    // fill out new product form
    await expect(page.url()).toContain('/products/new');
    await page.locator('input[name="product[name]"]').fill(productName);
    await page.locator('button:has-text("Commissions")').click();
    await page.locator('input[name="product[tiers][0][price]"]').fill(productPrice);
    await page.locator('button[form="new-product-form"]').click();

    // fill out remaining product details
    await expect(page.getByRole('heading', { name: productName })).toBeVisible();
    await expect(page.locator('input[name="product[name]"]')).toHaveValue(productName);
    await page.locator('textarea[name="product[description]"]').fill(productDescription);

    // name the generated tier, and create a new tier
    const firstTierLocator = page.locator('li:nth-child(1)');
    await firstTierLocator.locator('button[data-testid="button-tier-toggle"]').click();
    // expect first tier to have been given the initial price specified
    await expect(page.locator('input[name="tier[price]"]')).toHaveValue(productPrice);
    await firstTierLocator.locator('input[name="tier[name]"]').fill(productFirstTierName);
    await firstTierLocator.locator('textarea[name="tier[description]"]').fill(productFirstTierDescription);
    await page.locator('button:has-text("Add tier")').click();
    const secondTierLocator = page.locator('li:nth-child(2)');
    await secondTierLocator.locator('button[data-testid="button-tier-toggle"]').click();
    await secondTierLocator.locator('input[name="tier[name]"]').fill(productSecondTierName);
    await secondTierLocator.locator('textarea[name="tier[description]"]').fill(productSecondTierDescription);
    await secondTierLocator.locator('input[name="tier[price]"]').fill(productSecondTierPrice);
    await page.getByRole('button', { name: 'Save and continue' }).click();

    // fill out product content, for each tier
    await page.waitForFunction(() => window.location.hash === '#content');
    await expect(page.locator('a[href="#content"]')).toHaveClass(/bg-white/)
    await page.locator('.tiptap').fill(productContent);
    await page.locator('button:has-text("Editing")').click();
    await page.getByRole('button', { name: productSecondTierName }).click();
    await page.locator('.tiptap').fill(productSecondTierContent);
    await page.getByRole('button', { name: 'Publish and continue' }).click();

    // click back to previous tabs and confirm content saved
    await page.waitForFunction(() => window.location.hash === '#share');
    await page.locator('header').locator('a[href="#"]').click();
    await expect(page.locator('a[href="#"]')).toHaveClass(/bg-white/)
    await firstTierLocator.locator('button[data-testid="button-tier-toggle"]').click();
    await expect(firstTierLocator.locator('textarea[name="tier[description]"]')).toHaveValue(productFirstTierDescription);
    await secondTierLocator.locator('button[data-testid="button-tier-toggle"]').click();
    await expect(secondTierLocator.locator('textarea[name="tier[description]"]')).toHaveValue(productSecondTierDescription);
    await page.locator('header').locator('a[href="#content"]').click();
    await page.waitForFunction(() => window.location.hash === '#content');
    await expect(page.locator('.tiptap')).toHaveText(productContent);
    await page.locator('button:has-text("Editing")').click();
    await page.getByRole('button', { name: productSecondTierName }).click();
    await expect(page.locator('.tiptap')).toHaveText(productSecondTierContent);

    // navigate back to products page and confirm product is listed
    await page.locator('nav').locator('a[href="/products"]').click();
    await expect(page.url()).toContain('/products');
    await expect(page.locator(`a:has-text("${productName}")`)).toBeVisible();
  });

  test('should get access to correct tier content when buying a commissions product', async ({ page, context }) => {
    await page.goto('/products');

    const commissionsTableElementLocator = page.locator('td').filter({ hasText: 'Commissions Product' });
    const commissionsParentElementLocator = commissionsTableElementLocator.locator('..');
    const commissionsExternalLinkLocator = commissionsParentElementLocator.locator('a[href*="/l/"]');

    // click the external commissions product link to open a new page
    const pagePromiseCart = context.waitForEvent('page');
    await commissionsExternalLinkLocator.click();
    const productPage = await pagePromiseCart;
    // select the large canvas tier
    await productPage.locator('li:has-text("Large Canvas")').locator('button').click();
    // add the commissions product to cart
    await productPage.locator('button:has-text("Add to cart")').click();

    await productPage.locator('button:has-text("Pay")').click()
    await expect(productPage.locator('h3:has-text("Your purchase was successful!")')).toBeVisible();
    const commissionsProductLocator = productPage.locator('li:has-text("Commissions Product")');
    await expect(commissionsProductLocator).toBeVisible();
    // click the commissions product content link to open a new page
    const pagePromiseContent = context.waitForEvent('page');
    await commissionsProductLocator.locator('a:has-text("View content")').click();
    const productContentPage = await pagePromiseContent;
    await expect(productContentPage.locator('h1:has-text("Commissions Product")')).toBeVisible();
  });
});