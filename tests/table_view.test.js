// tests/table_view.test.js
const { test, expect } = require('@playwright/test');

test.describe('Fish Name Lookup - Table View', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('M4: Table View & Columns (Spec 6.2)', async ({ page }) => {
        // Switch to Table View
        await page.locator('#btn-table-view').click();
        await expect(page.locator('#table-view')).toBeVisible();
        await expect(page.locator('#card-view')).toBeHidden();

        // Check sticky column
        await expect(page.locator('th.sticky-col')).toHaveText('Fish');

        // Verify Image size (Spec mentions 80px thumb in table)
        const thumb = page.locator('.table-thumb').first();
        const box = await thumb.boundingBox();
        expect(box.width).toBeCloseTo(80, 1);

        // Verify Default Columns: Tamil, Kannada, Telugu, Hindi, Malayalam
        // Checking ALL default columns explicitly
        await expect(page.locator('th', { hasText: 'Tamil' })).toBeVisible();
        await expect(page.locator('th', { hasText: 'Kannada' })).toBeVisible();
        await expect(page.locator('th', { hasText: 'Telugu' })).toBeVisible();
        await expect(page.locator('th', { hasText: 'Hindi' })).toBeVisible();
        await expect(page.locator('th', { hasText: 'Malayalam' })).toBeVisible();

        // Column Selector
        await page.getByRole('button', { name: '🌐 Languages' }).click();
        await expect(page.locator('#column-selector-dialog')).toBeVisible();

        // Toggle a column (e.g., Urdu)
        const urduCheckbox = page.locator('input[value="urdu"]');
        await urduCheckbox.check();
        await page.locator('#btn-close-cols').click();

        // Verify Table Header
        await expect(page.locator('th', { hasText: 'Urdu' })).toBeVisible();
    });

    test('M5: Persistence (Spec 8.3)', async ({ page }) => {
        // Switch to Table View
        await page.locator('#btn-table-view').click();

        // Reload page
        await page.reload();

        // Should still be in Table View
        await expect(page.locator('#table-view')).toBeVisible();

        // Switch back to Card for cleanup/next test implication
        await page.locator('#btn-card-view').click();
    });
});
