import { test, expect } from '@playwright/test';

test.describe('Playwright Setup Sanity Check', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verify body element is visible
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verify main navigation header is present
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should have expected document title or brand name', async ({ page }) => {
    await page.goto('/');
    
    // Verify brand logo or title text is present
    const brandName = page.locator('header').getByText('ILORI AYOMIDE');
    await expect(brandName).toBeVisible();
  });
});
