import { test, expect } from '@playwright/test';

test.beforeAll(async ({ request }) => {

    // Clear the database
    await request.post('http://localhost:3000/api/reset');
});

test('Create a new board with a list and cards', async ({ page }) => {

    // Load the app
    await page.goto('http://localhost:3000/');

    // Create a new board
    await page.getByPlaceholder('Name of your first board').fill('Joes');
    await page.getByPlaceholder('Name of your first board').press('Enter');
    await expect(page.locator('[name="board-title"]')).toHaveValue('Joes');
    await expect(page.getByPlaceholder('Enter list title...')).toBeVisible();
    await expect(page.locator('[data-cy="list"]')).not.toBeVisible();

    // Create a new list
    await page.getByPlaceholder('Enter list title...').fill('TODO');
    await page.getByPlaceholder('Enter list title...').press('Enter');
    await expect(page.locator('[data-cy="list-name"]')).toHaveValue('TODO');

    // Add cards to the list
    await page.getByText('Add another card').click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Jogging');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Going to the office');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByPlaceholder('Enter a title for this card...').fill('Attending theatre');
    await page.getByRole('button', { name: 'Add card' }).click();
    await expect(page.locator('[data-cy="card-text"]')).toHaveText(
        ['Jogging', 'Going to the office', 'Attending theatre']);

    // Navigate to the home page
    await page.getByRole('navigation').getByRole('button').click();
    await expect(page.getByText('My Boards')).toBeVisible();
    await expect(page.getByText('Joes')).toBeVisible();
});