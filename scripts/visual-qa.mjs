import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const baseURL = process.env.QA_URL ?? 'http://127.0.0.1:4174';
const questionCount = 30;
const output = new URL('../qa/screenshots/', import.meta.url);
const outputDir = fileURLToPath(output);
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(`${baseURL}/#intro`);
await page.screenshot({ path: fileURLToPath(new URL('01-intro.png', output)), fullPage: true });
await page.getByRole('button', { name: '开始研究' }).click();
await page.screenshot({ path: fileURLToPath(new URL('02-quiz.png', output)), fullPage: true });
for (let i = 1; i <= questionCount; i += 1) {
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: i === questionCount ? '查看研究结论' : '下一题' }).click();
}
await page.screenshot({ path: fileURLToPath(new URL('03-result.png', output)), fullPage: true });
await page.getByRole('button', { name: '打开六镜附录' }).click();
await page.screenshot({ path: fileURLToPath(new URL('05-lenses.png', output)), fullPage: true });
await page.getByRole('button', { name: '塔罗', exact: true }).click();
await page.screenshot({ path: fileURLToPath(new URL('06-lens-expanded.png', output)), fullPage: true });
await page.getByRole('button', { name: '返回研究结论' }).click();
await page.getByRole('button', { name: '生成分享卡' }).click();
await page.locator('#share-status').filter({ hasText: '分享卡已准备好' }).waitFor();
await page.screenshot({ path: fileURLToPath(new URL('04-share.png', output)), fullPage: true });
await browser.close();