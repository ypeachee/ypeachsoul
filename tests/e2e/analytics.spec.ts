import { expect, test } from '@playwright/test';

test('records the conversion funnel without sending answers or personal data', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __analyticsEvents?: unknown[] }).__analyticsEvents = [];
    (window as Window & { goatcounter?: { count: (payload: unknown) => void } }).goatcounter = {
      count(payload: unknown) {
        (window as Window & { __analyticsEvents?: unknown[] }).__analyticsEvents?.push(payload);
      },
    };
  });

  await page.goto('/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=archetype_01');
  await page.getByRole('button', { name: '开始测试' }).click();
  for (let i = 1; i <= 10; i += 1) {
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i === 10 ? '查看结果' : '下一题' }).click();
  }
  await page.getByRole('button', { name: '生成分享卡' }).click();
  await expect(page.locator('#share-status')).toHaveText('分享卡已准备好');
  await page.getByRole('button', { name: '复制结果文案' }).click();
  await expect(page.locator('#share-status')).toHaveText('结果文案已复制');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 PNG' }).click();
  await downloadPromise;

  const events = await page.evaluate(() =>
    (window as Window & { __analyticsEvents?: Array<{ path: string; title: string; event: boolean }> }).__analyticsEvents ?? [],
  );
  const names = events.map((event) => event.title);
  expect(names).toEqual(expect.arrayContaining([
    'test_start',
    'test_complete',
    'result_view',
    'share_card_open',
    'share_text_copy',
    'share_card_download',
  ]));
  expect(events.every((event) => event.event === true)).toBe(true);
  for (const event of events) {
    expect(event.path).toContain('utm_source=xiaohongshu');
    expect(event.path).not.toContain('answer');
  }
});