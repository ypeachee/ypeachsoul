import { expect, test } from '@playwright/test';
import { PNG } from 'pngjs';

test('exposes a complete 1200x630 social preview', async ({ page, request }) => {
  await page.goto('/');

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', '关于你的单案例研究');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'zh_CN');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://ypeachee.github.io/ypeachsoul/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://ypeachee.github.io/ypeachsoul/og.png',
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    'https://ypeachee.github.io/ypeachsoul/og.png',
  );

  const response = await request.get('/og.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
  const image = PNG.sync.read(await response.body());
  expect(image.width).toBe(1200);
  expect(image.height).toBe(630);
});