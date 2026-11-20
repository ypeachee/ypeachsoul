import { expect, test } from '@playwright/test';

test('refresh restores progress and completed results reopen from the intro', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '开始测试' }).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: '下一题' }).click();
  await page.reload();
  await expect(page.getByText('2 / 10')).toBeVisible();
  await page.goto('/#intro');
  await page.getByRole('button', { name: '继续上次测试' }).click();
  await expect(page.getByText('2 / 10')).toBeVisible();

  for (let i = 2; i <= 10; i += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === 10 ? '查看结果' : '下一题' }).click();
  }
  await page.goto('/#intro');
  await page.getByRole('button', { name: '查看上次结果' }).click();
  await expect(page.getByRole('heading', { name: '你的原型' })).toBeVisible();
});