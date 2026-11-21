import { expect, test } from '@playwright/test';
import { questions } from '../../src/domain/questions';

test('a user can start and answer all questions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  for (let i = 1; i <= questions.length; i += 1) {
    await expect(page.getByText(`${i} / ${questions.length}`)).toBeVisible();
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === questions.length ? '查看研究结论' : '下一题' }).click();
  }
  await expect(page.getByRole('heading', { name: '研究结论' })).toBeVisible();
});

test('next is disabled until chosen and previous preserves the answer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  const next = page.getByRole('button', { name: '下一题' });
  await expect(next).toBeDisabled();
  await page.getByRole('radio').first().check();
  await expect(next).toBeEnabled();
  await next.click();
  await expect(page.getByText(`2 / ${questions.length}`)).toBeVisible();
  await page.getByRole('button', { name: '上一题' }).click();
  await expect(page.getByText(`1 / ${questions.length}`)).toBeVisible();
  await expect(page.getByRole('radio').first()).toBeChecked();
});