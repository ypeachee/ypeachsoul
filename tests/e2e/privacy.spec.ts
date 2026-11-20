import { expect, test } from '@playwright/test';

test('P0 has no account, payment, upload or answer-transmission requests', async ({ page }) => {
  const requests: Array<{ url: string; method: string }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method() }));
  await page.goto('/');
  await page.getByRole('button', { name: '开始测试' }).click();
  for (let i = 1; i <= 10; i += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === 10 ? '查看结果' : '下一题' }).click();
  }
  await page.getByRole('button', { name: '生成分享卡' }).click();
  expect(requests.every((request) => request.method === 'GET')).toBe(true);
  expect(requests.every((request) => new URL(request.url).origin === 'http://127.0.0.1:4173')).toBe(true);
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  await expect(page.getByText('登录')).toHaveCount(0);
  await expect(page.getByText('支付')).toHaveCount(0);
});