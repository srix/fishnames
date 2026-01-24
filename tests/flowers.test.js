const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Flowers Category Verification', () => {

    const flowersPath = path.resolve(__dirname, '../src/data/flowers.json');
    let flowersData;

    test.beforeAll(() => {
        if (fs.existsSync(flowersPath)) {
            flowersData = JSON.parse(fs.readFileSync(flowersPath, 'utf-8'));
        }
    });

    test('flowers.json file exists', () => {
        expect(fs.existsSync(flowersPath)).toBe(true);
        expect(flowersData).toBeDefined();
        expect(Array.isArray(flowersData)).toBe(true);
    });

    test('Contains at least 40 flowers', () => {
        expect(flowersData.length).toBeGreaterThanOrEqual(40);
        console.log(`Total flowers found: ${flowersData.length}`);
    });

    test('Contains key flowers from Batches 1 & 2', () => {
        const keyIds = [
            'jasmine', 'rose', 'lotus', 'marigold', 'hibiscus', // Batch 1
            'balsam', 'canna', 'zinnia', 'rangoon-creeper', 'kewda', // Batch 2
            'datura', 'morning-glory', 'dahlia'
        ];

        keyIds.forEach(id => {
            const item = flowersData.find(i => i.id === id);
            expect(item, `Flower with id '${id}' should exist`).toBeDefined();
        });
    });

    test('All flowers have required fields', () => {
        flowersData.forEach(item => {
            expect(item.id).toBeTruthy();
            expect(item.names).toBeDefined();
            expect(item.names.english).toBeDefined();
            expect(item.names.english.length).toBeGreaterThan(0);
            expect(item.photo).toBeDefined();
        });
    });

    test('Language coverage is sufficient', () => {
        // Check a random sample for major languages
        const sample = flowersData.find(i => i.id === 'jasmine');
        expect(sample.names.hindi).toBeDefined();
        expect(sample.names.tamil).toBeDefined();
        expect(sample.names.kannada).toBeDefined();
        expect(sample.names.bengali).toBeDefined();
    });

});
