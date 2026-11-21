import { expect, test } from '@playwright/test';
import { questions } from '../../src/domain/questions';

test('refresh restores progress and completed results reopen from the intro', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: '下一题' }).click();
  await page.reload();
  await expect(page.getByText(`2 / ${questions.length}`)).toBeVisible();
  await page.goto('/#intro');
  await page.getByRole('button', { name: '继续上次研究' }).click();
  await expect(page.getByText(`2 / ${questions.length}`)).toBeVisible();

  for (let i = 2; i <= questions.length; i += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === questions.length ? '查看研究结论' : '下一题' }).click();
  }
  await page.goto('/#intro');
  await page.getByRole('button', { name: '查看上次结果' }).click();
  await expect(page.getByRole('heading', { name: '研究结论' })).toBeVisible();
});