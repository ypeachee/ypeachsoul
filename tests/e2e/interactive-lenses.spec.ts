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

async function openLens(page: import('@playwright/test').Page, title: string): Promise<void> {
  await completeQuiz(page);
  await page.getByRole('button', { name: '打开六镜附录' }).click();
  await page.getByRole('button', { name: title, exact: true }).click();
}

test('draws three tarot cards locally and returns to the lens appendix', async ({ page }) => {
  await openLens(page, '塔罗');
  await page.getByRole('link', { name: /开始 78 牌三牌实验/ }).click();

  await expect(page.getByRole('heading', { name: '塔罗三牌实验' })).toBeVisible();
  await page.getByLabel(/你此刻想问什么/).fill('我现在最该先处理什么？');
  await page.getByRole('button', { name: '洗牌并抽取三张' }).click();

  await expect(page.locator('[data-tarot-card]')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: '三牌叙事' })).toBeFocused();
  await expect(page.getByText('问题：我现在最该先处理什么？')).toBeVisible();
  const storage = await page.evaluate(() => JSON.stringify(localStorage));
  expect(storage).not.toContain('我现在最该先处理什么');

  await page.getByRole('button', { name: '返回六镜附录' }).click();
  await expect(page.getByRole('heading', { name: '六镜附录' })).toBeVisible();
});

test('calculates a four-pillar bazi profile without persisting birth data', async ({ page }) => {
  await openLens(page, '八字');
  await page.getByRole('link', { name: /输入出生信息，开始排盘/ }).click();

  await expect(page.getByRole('heading', { name: '出生节律排盘' })).toBeVisible();
  await page.getByLabel('出生日期', { exact: true }).fill('1990-06-01');
  await page.getByLabel('出生时间', { exact: true }).fill('08:30');
  await page.getByLabel('性别', { exact: true }).selectOption('male');
  await page.getByRole('button', { name: '排出我的四柱' }).click();

  await expect(page.getByRole('heading', { name: '四柱节律卡' })).toBeFocused();
  await expect(page.locator('[data-bazi-pillar]')).toHaveCount(4);
  await expect(page.getByText('庚午', { exact: true })).toBeVisible();
  await expect(page.getByText('辛巳', { exact: true })).toBeVisible();
  await expect(page.getByText('丁酉', { exact: true })).toBeVisible();
  await expect(page.getByText('甲辰', { exact: true })).toBeVisible();
  const storage = await page.evaluate(() => JSON.stringify(localStorage));
  expect(storage).not.toContain('1990-06-01');
});

