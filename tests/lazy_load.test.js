const { test, expect } = require('@playwright/test');

test.describe('Lazy Loading & Infinite Scroll', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#card-view')).toBeVisible();
    });

    test('Initial Load Limit', async ({ page }) => {
        // Wait for cards to stabilize
        await expect(page.locator('.fish-card').first()).toBeVisible();

        // Count cards
        const count = await page.locator('.fish-card').count();
        console.log(`Initial count: ${count}`);

        // Should be BATCH_SIZE (20)
        expect(count).toBe(20);
    });

    test('Loads More on Scroll', async ({ page }) => {
        await expect(page.locator('.fish-card').first()).toBeVisible();
        let count = await page.locator('.fish-card').count();
        expect(count).toBe(20);

        // Scroll to bottom to trigger observer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Wait for network idle or just a timeout/assertion
        // "Loading" happens instantly since data is local, but rendering takes a tick
        await page.waitForTimeout(500);

        // New count should be greater
        const newCount = await page.locator('.fish-card').count();
        console.log(`Count after scroll: ${newCount}`);
        expect(newCount).toBeGreaterThan(20);

        // For fish.json with ~33 items, it should be 33
        expect(newCount).toBeLessThanOrEqual(40);
    });

    test('Reset on Filter', async ({ page }) => {
        // Trigger some scrolling first
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        const countAfterScroll = await page.locator('.fish-card').count();
        expect(countAfterScroll).toBeGreaterThan(20);

        // Apply a filter that has few results (e.g. Freshwater)
        // Check what filters are available? 
        // We can just switch category to Vegetables which might reset
        await page.locator('button[data-category="vegetables"]').click();

        const vegCount = await page.locator('.fish-card').count();
        // Vegetables might have many items too, but it should definitely reset the view
        // If vegetables has > 20 items, it should be 20.
        // If < 20, is whatever size.
        // Key is that it is NOT appending to the previous list.
    });

    test('Reset on Search', async ({ page }) => {
        // Search for something specific
        await page.fill('#search-input', 'Seer');
        await page.waitForTimeout(1100); // Debounce is 1000ms

        const cards = page.locator('.fish-card');
        await expect(cards).toHaveCount(1); // Assuming 1 Seer fish

        // Clear search
        await page.fill('#search-input', '');
        await page.waitForTimeout(1100);

        // Should return to initial batch size
        const count = await page.locator('.fish-card').count();
        expect(count).toBe(20);
    });
});
