import { expect, test } from '@playwright/test';

test('landing page exposes the product promise', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '灵魂使用说明书' })).toBeVisible();
  await expect(page.getByRole('button', { name: '开始测试' })).toBeVisible();
  await expect(page.getByText('娱乐与自我反思用途，不构成心理/医疗诊断')).toBeVisible();
});