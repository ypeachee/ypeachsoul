import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = new URL('../public/og.png', import.meta.url);
await mkdir(new URL('../public/', import.meta.url), { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await page.setContent(`
  <!doctype html>
  <html lang="zh-CN">
    <style>
      * { box-sizing: border-box; }
      html, body { width: 1200px; height: 630px; margin: 0; }
      body {
        position: relative;
        overflow: hidden;
        background:
          radial-gradient(circle at 82% 18%, rgba(255,109,77,.30), transparent 31%),
          linear-gradient(135deg, #111513 0%, #1b211d 58%, #38443b 100%);
        color: #f2eddf;
        font-family: "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif;
      }
      .frame { position: absolute; inset: 40px; border: 1px solid rgba(242,237,223,.20); }
      .copy { position: absolute; left: 88px; top: 82px; width: 760px; }
      .eyebrow { margin: 0 0 24px; color: #ffd9cb; font-size: 17px; font-weight: 600; letter-spacing: .2em; }
      h1 { margin: 0; font-family: "Songti SC", "STSong", serif; font-size: 92px; line-height: .98; letter-spacing: -.045em; }
      .lede { margin: 25px 0 0; width: 660px; font-family: "Songti SC", "STSong", serif; font-size: 30px; line-height: 1.55; color: rgba(242,237,223,.86); }
      .chips { position: absolute; left: 88px; bottom: 78px; display: flex; flex-wrap: wrap; gap: 9px; width: 720px; }
      .chip { padding: 8px 14px; border: 1px solid rgba(242,237,223,.20); border-radius: 999px; color: rgba(242,237,223,.78); font-size: 15px; }
      .orb { position: absolute; right: 82px; top: 82px; width: 245px; height: 245px; border: 1px solid rgba(242,237,223,.25); border-radius: 50%; background: rgba(242,237,223,.08); }
      .orb::after { content: ''; position: absolute; inset: 50px; border-radius: 50%; background: #ff6d4d; opacity: .92; }
      .count { position: absolute; right: 118px; top: 230px; font-family: "Songti SC", "STSong", serif; font-size: 150px; line-height: 1; color: #151817; }
      .caption { position: absolute; right: 98px; top: 380px; width: 210px; text-align: center; font-size: 20px; line-height: 1.55; color: rgba(242,237,223,.78); }
      .brand { position: absolute; right: 88px; bottom: 82px; color: rgba(242,237,223,.58); font-size: 14px; letter-spacing: .12em; }
      .accent { color: #ff6d4d; }
    </style>
  </html>
  <body>
    <div class="frame"></div>
    <div class="orb"><span class="count">1</span></div>
    <div class="copy">
      <p class="eyebrow">A SINGLE-CASE STUDY OF YOU · V3.0</p>
      <h1>关于你的<br /><span class="accent">单案例研究</span></h1>
      <p class="lede">30 个情境选择 + 六镜文化附录，约 5 分钟，生成一份以你为唯一样本的人格观察报告。</p>
    </div>
    <div class="chips">
      <span class="chip">30 道题</span><span class="chip">约 5 分钟</span><span class="chip">主原型 × 副原型</span><span class="chip">六镜附录</span>
    </div>
    <div class="caption">研究对象<br />n=1</div>
    <div class="brand">关于你的单案例研究 · 娱乐性自我报告</div>
  </body>
  </html>
`);

await page.screenshot({ path: fileURLToPath(output), type: 'png' });
await browser.close();