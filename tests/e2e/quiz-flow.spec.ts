import { expect, test } from '@playwright/test';

test('a user can start and answer ten questions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '开始测试' }).click();
  for (let i = 1; i <= 10; i += 1) {
    await expect(page.getByText(`${i} / 10`)).toBeVisible();
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === 10 ? '查看结果' : '下一题' }).click();
  }
  await expect(page.getByRole('heading', { name: '你的原型' })).toBeVisible();
});

test('next is disabled until chosen and previous preserves the answer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '开始测试' }).click();
  const next = page.getByRole('button', { name: '下一题' });
  await expect(next).toBeDisabled();
  await page.getByRole('radio').first().check();
  await expect(next).toBeEnabled();
  await next.click();
  await expect(page.getByText('2 / 10')).toBeVisible();
  await page.getByRole('button', { name: '上一题' }).click();
  await expect(page.getByText('1 / 10')).toBeVisible();
  await expect(page.getByRole('radio').first()).toBeChecked();
});