import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('share preview produces a 1080x1440 card and copyable text', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: '开始测试' }).click();
  for (let i = 1; i <= 10; i += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === 10 ? '查看结果' : '下一题' }).click();
  }
  await page.getByRole('button', { name: '生成分享卡' }).click();
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute('width', '1080');
  await expect(canvas).toHaveAttribute('height', '1440');
  await page.getByRole('button', { name: '复制结果文案' }).click();
  await expect(page.getByText('结果文案已复制')).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('灵魂使用说明书');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 PNG' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.png$/);
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const png = await readFile(downloadPath!);
  expect(png.readUInt32BE(16)).toBe(1080);
  expect(png.readUInt32BE(20)).toBe(1440);

  let repeatedDownloads = 0;
  page.on('download', () => { repeatedDownloads += 1; });
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>('#download-card');
    button?.click();
    button?.click();
    button?.click();
  });
  await page.waitForTimeout(800);
  expect(repeatedDownloads).toBe(1);
});