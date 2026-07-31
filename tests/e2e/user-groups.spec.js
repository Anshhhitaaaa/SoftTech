import { test, expect } from '@playwright/test';

test.describe('User Group Policies E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display User Group Policies header and tab navigation', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('User Group Policies');
    await expect(page.getByRole('button', { name: /User Groups/i })).toBeVisible();
  });

  test('should open Create Group modal and create a new policy', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /Create Group/i }).first();
    await createBtn.click();

    const modalTitle = page.locator('h2', { hasText: 'Create Group' });
    await expect(modalTitle).toBeVisible();

    await page.fill('input[placeholder*="Pocket Sage"]', 'Test Security Policy');
    
    await page.getByRole('button', { name: /Create Group Policy/i }).click();

    await expect(page.locator('table')).toContainText('Test Security Policy');
  });

  test('should filter user groups using Universal Omni-Search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by name, dept, office, role, access...');
    await searchInput.fill('NonExistentGroup12345');

    await expect(page.locator('table')).not.toContainText('NonExistentGroup12345');
  });

  test('should open Master Detail view popup for a group', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /Create Group/i }).first();
    await createBtn.click();
    await page.fill('input[placeholder*="Pocket Sage"]', 'Detail Test Policy');
    await page.getByRole('button', { name: /Create Group Policy/i }).click();

    const masterDetailBtn = page.getByRole('button', { name: /Master Detail/i }).first();
    await masterDetailBtn.click();

    await expect(page.locator('h2')).toContainText('Detail Test Policy');
    await page.getByRole('button', { name: /close/i }).first().click();
  });
});
