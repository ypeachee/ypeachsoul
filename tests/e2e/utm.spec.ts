import { expect, test } from '@playwright/test';

test('captures UTM parameters with first-touch attribution', async ({ page }) => {
  await page.goto('/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=archetype_01');
  const attribution = await page.evaluate(() => JSON.parse(localStorage.getItem('soul_manual_attribution_v1') ?? '{}'));
  expect(attribution).toMatchObject({
    utm_source: 'xiaohongshu',
    utm_medium: 'social',
    utm_campaign: 'launch_202611',
    utm_content: 'archetype_01',
  });

  await page.goto('/?utm_source=douyin&utm_medium=video&utm_campaign=later');
  const firstTouch = await page.evaluate(() => JSON.parse(localStorage.getItem('soul_manual_attribution_v1') ?? '{}'));
  expect(firstTouch.utm_source).toBe('xiaohongshu');
  expect(firstTouch.utm_medium).toBe('social');
});