import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';

test('share preview produces a 1080x1440 card with a scannable attribution QR', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: '开始测试' }).click();
  for (let i = 1; i <= 10; i += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === 10 ? '查看结果' : '下一题' }).click();
  }
  await page.getByRole('button', { name: '生成分享卡' }).click();
  await expect(page.locator('#share-status')).toHaveText('分享卡已准备好');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute('width', '1080');
  await expect(canvas).toHaveAttribute('height', '1440');
  await page.getByRole('button', { name: '复制结果文案' }).click();
  await expect(page.locator('#share-status')).toHaveText('结果文案已复制');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('灵魂使用说明书');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 PNG' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.png$/);
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const pngBuffer = await readFile(downloadPath!);
  const png = PNG.sync.read(pngBuffer);
  expect(png.width).toBe(1080);
  expect(png.height).toBe(1440);
  const qr = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  expect(qr, 'share card should contain a decodable QR code').not.toBeNull();
  expect(qr!.data).toContain('https://ypeachee.github.io/ypeachsoul/');
  expect(qr!.data).toContain('utm_source=share_card');
  expect(qr!.data).toContain('utm_medium=image');
  expect(qr!.data).toContain('utm_content=');

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