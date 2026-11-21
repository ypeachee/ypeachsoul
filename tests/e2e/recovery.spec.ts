import { expect, test } from '@playwright/test';
import { questions } from '../../src/domain/questions';
import { STORAGE_KEY } from '../../src/state/storage';

test('corrupt draft is preserved until the user confirms reset', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, '{bad-json'), STORAGE_KEY);
  await page.goto('/');
  await expect(page.getByText('旧版草稿无法恢复')).toBeVisible();
  await expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe('{bad-json');
  await page.getByRole('button', { name: '清空旧草稿并重新开始' }).click();
  await expect(page.getByText(`1 / ${questions.length}`)).toBeVisible();
});

test('storage failure falls back to session-only without blocking the quiz', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('quota', 'QuotaExceededError');
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  await expect(page.getByText('本次进度仅在当前页面保留')).toBeVisible();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: '下一题' }).click();
  await expect(page.getByText(`2 / ${questions.length}`)).toBeVisible();
});

test('share fallback keeps a recovery path visible', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  for (let i = 1; i <= questions.length; i += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === questions.length ? '查看研究结论' : '下一题' }).click();
  }
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.getByRole('button', { name: '生成分享卡' }).click();
  await expect(page.getByRole('heading', { name: '分享卡生成失败' })).toBeVisible();
  await expect(page.getByRole('button', { name: '重新生成' })).toBeVisible();
  await expect(page.getByRole('button', { name: '复制文字版' })).toBeVisible();
  await expect(page.getByRole('button', { name: '返回结果' })).toBeVisible();
});