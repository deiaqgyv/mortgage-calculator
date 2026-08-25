import { expect, test } from '@playwright/test';

test('calculates, shares and exposes noindex metadata for a shared estimate', async ({ page }) => {
  await page.goto('/en-us/mortgage-calculator/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const inputs = page.locator('input[type="number"]');
  await inputs.nth(0).fill('300000');
  await expect(page.locator('.hero-number')).toContainText('$1,847');
  await page.getByRole('button', { name: 'Copy share link' }).click();
  await expect(page).toHaveURL(/share=/);
  await page.goto(page.url());
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('uses French core labels on the Canadian French route', async ({ page }) => {
  await page.goto('/fr-ca/mortgage-calculator/');
  await expect(page.locator('main')).toHaveAttribute('lang', 'fr-CA');
  await expect(page.getByText('Montant du prêt', { exact: true })).toBeVisible();
});

test('serves every indexed calculator and guidance page', async ({ page }) => {
  const locales = ['en-us', 'en-gb', 'en-ca', 'fr-ca', 'de-de', 'fr-fr', 'es-es'];
  const articles = ['amortization', 'extra-payments', 'affordability', 'methodology', 'legal-notice', 'privacy'];
  for (const locale of locales) {
    const calculator = await page.goto(`/${locale}/mortgage-calculator/`);
    expect(calculator?.status()).toBe(200);
    for (const article of articles) {
      const response = await page.goto(`/${locale}/mortgage-calculator/${article}/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('article h1')).toBeVisible();
    }
  }
});

test('downloads CSV and PDF estimates', async ({ page }) => {
  await page.goto('/en-us/mortgage-calculator/');
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download amortization CSV' }).click();
  expect((await csvDownload).suggestedFilename()).toBe('mortgage-amortization.csv');
  const pdfDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PDF estimate' }).click();
  expect((await pdfDownload).suggestedFilename()).toBe('mortgage-estimate.pdf');
});

test('publishes machine-readable AI search guidance and article schema', async ({ page, request }) => {
  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  await expect(llms.text()).resolves.toContain('MortgageBreezy');
  await page.goto('/en-us/mortgage-calculator/methodology/');
  expect(await page.locator('script[type="application/ld+json"]').evaluate((node) => node.innerHTML)).toContain('"Article"');
  await expect(page.getByText('Short answer:', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Primary sources used for local-rule data' })).toBeVisible();
});

test('matches the desktop calculator visual baseline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/en-us/mortgage-calculator/');
  await expect(page).toHaveScreenshot('calculator-desktop.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
});

test('matches the mobile calculator visual baseline', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/de-de/mortgage-calculator/');
  await expect(page).toHaveScreenshot('calculator-mobile.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
});
