import { expect, test } from '@playwright/test';

test('landing page exposes the product promise', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /关于你的.*单案例研究/ })).toBeVisible();
  await expect(page.getByRole('button', { name: '开始研究' })).toBeVisible();
  await expect(page.getByText('娱乐性自我报告，不构成心理/医疗诊断、命理预测或现实决策依据')).toBeVisible();
});