import { expect, test } from '@playwright/test';

async function completeQuiz(page: import('@playwright/test').Page): Promise<number> {
  await page.goto('/');
  await page.getByRole('button', { name: '开始测试' }).click();
  let transitionMs = 0;
  for (let i = 1; i <= 10; i += 1) {
    await page.getByRole('radio').first().check();
    const startedAt = i === 10 ? Date.now() : 0;
    await page.getByRole('button', { name: i === 10 ? '查看结果' : '下一题' }).click();
    if (i === 10) {
      await expect(page.getByRole('heading', { name: '你的原型' })).toBeVisible();
      transitionMs = Date.now() - startedAt;
    }
  }
  return transitionMs;
}

test('result contains every required section and disclaimer', async ({ page }) => {
  const transitionMs = await completeQuiz(page);
  expect(transitionMs).toBeLessThan(800);
  for (const heading of ['你的原型', '三个优势', '两个盲点', '关系模式', '工作与能量', '此刻的行动']) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
  await expect(page.getByText('娱乐与自我反思用途，不构成心理/医疗诊断')).toBeVisible();
});

test('reset asks first and cancel keeps the result', async ({ page }) => {
  await completeQuiz(page);
  await page.getByRole('button', { name: '重新测试' }).click();
  await expect(page.getByRole('dialog', { name: '清除当前结果？' })).toBeVisible();
  await expect(page.getByRole('button', { name: '取消' })).toBeFocused();
  await page.getByRole('button', { name: '取消' }).click();
  await expect(page.getByRole('heading', { name: '你的原型' })).toBeVisible();
});

test('confirmed reset clears the result and starts from question one', async ({ page }) => {
  await completeQuiz(page);
  await page.getByRole('button', { name: '重新测试' }).click();
  await page.getByRole('button', { name: '确认重新测试' }).click();
  await expect(page.getByText('1 / 10')).toBeVisible();
  await expect(page.getByRole('radio').first()).not.toBeChecked();
});