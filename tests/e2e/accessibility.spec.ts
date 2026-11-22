import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { questions } from '../../src/domain/questions';

async function completeQuizWithKeyboard(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).focus();
  await page.keyboard.press('Enter');
  for (let i = 1; i <= questions.length; i += 1) {
    await page.getByRole('radio').first().focus();
    await page.keyboard.press('Space');
    await page.getByRole('button', { name: i === questions.length ? '查看研究结论' : '下一题' }).focus();
    await page.keyboard.press('Enter');
  }
}

test('keyboard completes the quiz and focus moves to new headings', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading').first()).toBeFocused();
  await page.getByRole('radio').first().focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: '下一题' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /完全陌生的任务/ })).toBeFocused();
  await expect(page.locator('#app-live-region')).toContainText('第 2 题');
});

test('critical accessibility scan is clean on the intro and result screens', async ({ page }) => {
  await page.goto('/');
  const intro = await new AxeBuilder({ page }).analyze();
  expect(intro.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
  await completeQuizWithKeyboard(page);
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: '打开六镜附录' }).click();
  const lenses = await new AxeBuilder({ page }).analyze();
  expect(lenses.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
});

test('375px layout has no horizontal overflow and touch targets are large enough', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  const box = await page.getByRole('radio').first().boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test('reduced motion keeps the flow usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: '开始研究' }).click();
  await page.getByRole('radio').first().check();
  await expect(page.getByRole('button', { name: '下一题' })).toBeEnabled();
  const durationSeconds = await page.getByRole('radio').first().evaluate((element) => parseFloat(getComputedStyle(element.closest('label') ?? element).transitionDuration));
  expect(durationSeconds).toBeLessThan(0.1);
});

test('cached app remains usable offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /关于你的.*单案例研究/ })).toBeVisible();
});