import { test, expect } from '@playwright/test';

test.describe('Individual Access Privileges E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch to Individual Access tab', async ({ page }) => {
    const individualTab = page.getByRole('button', { name: /Individual Access/i });
    await individualTab.click();

    await expect(page.locator('h2')).toContainText('Individual Access Privileges');
  });

  test('should open Add Individual Access modal and create privilege override', async ({ page }) => {
    const individualTab = page.getByRole('button', { name: /Individual Access/i });
    await individualTab.click();

    const addBtn = page.getByRole('button', { name: /Add Individual Access/i }).first();
    await addBtn.click();

    await expect(page.locator('h2', { hasText: 'Add Individual Access' })).toBeVisible();

    const userSelect = page.locator('select').filter({ hasText: /Select User/i });
    await userSelect.selectOption({ index: 1 });

    await page.getByRole('button', { name: /Save Individual Access/i }).click();

    await expect(page.locator('table')).toBeVisible();
  });
});
