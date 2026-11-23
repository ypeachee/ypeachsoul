import { expect, test } from '@playwright/test';
import { questions } from '../../src/domain/questions';

async function completeQuiz(page: import('@playwright/test').Page): Promise<number> {
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  let transitionMs = 0;
  for (let i = 1; i <= questions.length; i += 1) {
    await page.getByRole('radio').first().check();
    const startedAt = i === questions.length ? Date.now() : 0;
    await page.getByRole('button', { name: i === questions.length ? '查看研究结论' : '下一题' }).click();
    if (i === questions.length) {
      await expect(page.getByRole('heading', { name: '研究结论' })).toBeVisible();
      transitionMs = Date.now() - startedAt;
    }
  }
  return transitionMs;
}

test('result contains every required section and disclaimer', async ({ page }) => {
  const transitionMs = await completeQuiz(page);
  expect(transitionMs).toBeLessThan(800);
  for (const heading of ['研究结论', '证据分布', '荣格八维倾向', '职业方向与职场定位', '主要证据', '反例与盲点', '关系场景', '工作场景', '下一步观察', '研究局限']) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
  await expect(page.getByText('主功能', { exact: true })).toBeVisible();
  await expect(page.getByText('辅助功能', { exact: true })).toBeVisible();
  await expect(page.getByText('压力盲区', { exact: true })).toBeVisible();
  await expect(page.getByText('娱乐性自我报告，不构成心理/医疗诊断、命理预测或现实决策依据')).toBeVisible();
});

test('reset asks first and cancel keeps the result', async ({ page }) => {
  await completeQuiz(page);
  await page.getByRole('button', { name: '重新研究' }).click();
  await expect(page.getByRole('dialog', { name: '清除当前研究？' })).toBeVisible();
  await expect(page.getByRole('button', { name: '取消' })).toBeFocused();
  await page.getByRole('button', { name: '取消' }).click();
  await expect(page.getByRole('heading', { name: '研究结论' })).toBeVisible();
});

test('confirmed reset clears the result and starts from question one', async ({ page }) => {
  await completeQuiz(page);
  await page.getByRole('button', { name: '重新研究' }).click();
  await page.getByRole('button', { name: '确认重新研究' }).click();
  await expect(page.getByText(`1 / ${questions.length}`)).toBeVisible();
  await expect(page.getByRole('radio').first()).not.toBeChecked();
});
