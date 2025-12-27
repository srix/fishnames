// tests/card_view.test.js
const { test, expect } = require('@playwright/test');

test.describe('Fish Name Lookup - Card View', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('M1: Core Visualization - Loads correctly', async ({ page }) => {
        await expect(page).toHaveTitle(/South Indian Fish Name Guide/);
        // Spec 6.1: Card View is default
        await expect(page.locator('#card-view')).toBeVisible();
        await expect(page.locator('#table-view')).toBeHidden();

        // Check for Seer Fish card
        const seerCard = page.locator('.fish-card').filter({ hasText: 'Seer fish' }).first();
        await expect(seerCard).toBeVisible();
        await expect(seerCard.locator('img')).toBeVisible();
    });

    test('M2: Data & Language Expansion', async ({ page }) => {
        // Check for languages in default view (Tamil, Kannada, Telugu, Hindi)
        const seerCard = page.locator('.fish-card').filter({ hasText: 'Seer fish' }).first();

        // Verify Card Default Languages: Tamil, Kannada, Telugu, Hindi
        await expect(seerCard.locator('.lang-label', { hasText: 'Tamil' })).toBeVisible();
        await expect(seerCard.locator('.lang-label', { hasText: 'Kannada' })).toBeVisible();
        await expect(seerCard.locator('.lang-label', { hasText: 'Telugu' })).toBeVisible();
        await expect(seerCard.locator('.lang-label', { hasText: 'Hindi' })).toBeVisible();

        // Expand Details (Spec 6.1)
        const summary = seerCard.locator('summary');
        await expect(summary).toHaveText('Show all languages');
        await summary.click();

        // Malayalam (which is in Table defaults but NOT Card defaults) should be here
        await expect(seerCard.locator('.more-langs .lang-label', { hasText: 'Malayalam' })).toBeVisible();
        await expect(seerCard.locator('.more-langs .lang-label', { hasText: 'Assamese' })).toBeVisible();
    });

    test('M3: Search Functionality (Spec 6.3)', async ({ page }) => {
        const search = page.locator('#search-input');

        // Search by Romanized
        await search.fill('Vanjaram');
        await expect(page.locator('.fish-card')).toHaveCount(1);
        await expect(page.locator('.fish-card')).toContainText('Seer fish');

        // Clear
        await search.fill('');
        await expect(page.locator('.fish-card').count()).resolves.toBeGreaterThan(1);

        // Search by Native Script (Hindi)
        await search.fill('सुरमई');
        await expect(page.locator('.fish-card')).toContainText('Seer fish');
    });
});
