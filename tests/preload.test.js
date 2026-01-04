const { test, expect } = require('@playwright/test');

test.describe('Performance Optimization', () => {

    test('Data Preloading', async ({ page }) => {
        await page.goto('/');

        // Verify that the preload link for fish-seafood.json exists
        const preloadLink = await page.locator('link[rel="preload"][href="/data/fish-seafood.json"]');
        await expect(preloadLink).toHaveCount(1);
        await expect(preloadLink).toHaveAttribute('as', 'fetch');
        await expect(preloadLink).toHaveAttribute('crossorigin', 'anonymous');
    });

});
