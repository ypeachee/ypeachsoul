# 灵魂使用说明书

一个 60–90 秒完成、可分享的自我人格原型测试。用户回答 10 道情境题，本地生成 8 种人格原型之一，并下载一张 1080×1440 竖版分享卡。

## 产品边界

- 娱乐与自我反思用途，不构成心理/医疗诊断
- 无需登录、无后端、无 AI API
- 不上传答案、结果或个人资料
- 不做命理预测、支付、云同步或账号体系
- 刷新页面可恢复本地进度；清除数据前会二次确认

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:4173/`。

## 构建与预览

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

生产构建包含 PWA manifest、Service Worker 和离线缓存。

## 验证

```bash
npm run test
npm run test:e2e
npm run build
```

- Vitest：题库、确定性评分、存储恢复、分享文案
- Playwright：完整答题、刷新恢复、分享下载、错误恢复、键盘操作、移动端、离线
- Axe：首页与结果页 critical/serious 可访问性问题检查

当前自动化结果：15 个单元测试、19 个端到端测试全部通过。

## 截图

视觉 QA 截图位于 `qa/screenshots/`：

- `01-intro.png`
- `02-quiz.png`
- `03-result.png`
- `04-share.png`

重新生成截图：

```bash
npm run preview -- --host 127.0.0.1 --port 4174
# 另开终端
QA_URL=http://127.0.0.1:4174 npm run qa:visual
```

在 PowerShell 中可使用：

```powershell
$env:QA_URL='http://127.0.0.1:4174'; npm run qa:visual
```

## 结构

```text
src/domain/       题库、原型、评分
src/state/        localStorage、会话状态机
src/ui/           Hash 路由、可访问界面
src/share/        Canvas 分享卡、下载、复制
tests/unit/       Vitest
tests/e2e/        Playwright
qa/screenshots/   视觉 QA 证据
```

规格与验收契约：

```text
interaction-contract/INTERACTION_SPEC.md
interaction-contract/ACCEPTANCE_TESTS.csv
```
## 分享二维码

分享卡上的二维码会按人格原型生成独立 UTM 链接：

```text
?utm_source=share_card&utm_medium=image&utm_content=<archetype-id>
```

默认域名是：

```text
https://ypeachee.github.io/ypeachsoul/
```

部署到其他域名时，在构建环境中设置：

```bash
VITE_PUBLIC_BASE_URL=https://your-domain.example/
```

参考 `.env.example`。
## OG 社交分享预览

公开页面包含 Open Graph 和 X/Twitter 大图卡片：

- `public/og.png`：1200×630
- `og:title`、`og:description`、`og:image`、`og:url`
- X：`summary_large_image`

重新生成 OG 图片：

```bash
npm run qa:og
```

图片地址由 `VITE_PUBLIC_BASE_URL` 生成，默认：

```text
https://ypeachee.github.io/ypeachsoul/og.png
```
## UTM 归因

首次访问会捕获并保存以下参数：

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
ref
```

后续分享会自动生成独立归因链接：

- 二维码：`utm_source=share_card&utm_medium=image&utm_campaign=referral`
- 复制文案：`utm_source=share_text&utm_medium=copy&utm_campaign=referral`
- 原始渠道通过 `ref` 继续传递

完整投放链接见 `marketing/utm-links.md`。