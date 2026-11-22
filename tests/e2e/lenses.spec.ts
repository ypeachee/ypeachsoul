import { expect, test } from '@playwright/test';
import { questions } from '../../src/domain/questions';

async function completeQuiz(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  for (let index = 1; index <= questions.length; index += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', {
      name: index === questions.length ? '查看研究结论' : '下一题',
    }).click();
  }
}

test('opens the six-lens appendix and returns to the research result', async ({ page }) => {
  await completeQuiz(page);
  await page.getByRole('button', { name: '打开六镜附录' }).click();

  await expect(page.getByRole('heading', { name: '六镜附录' })).toBeVisible();
  await expect(page.getByText('APPENDIX A · SIX INTERPRETIVE LENSES · V3.0')).toBeVisible();
  await expect(page.locator('[data-lens-id]')).toHaveCount(6);
  for (const title of ['奇门 / 紫微', '八字', '月老', '佛学', '风水', '塔罗']) {
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }
  await expect(page.locator('.tarot-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: '工具台账' })).toBeVisible();
  await expect(page.getByText('不构成心理/医疗诊断、命理预测或现实决策依据')).toBeVisible();

  await page.getByRole('button', { name: '返回研究结论' }).click();
  await expect(page.getByRole('heading', { name: '研究结论' })).toBeVisible();
});
