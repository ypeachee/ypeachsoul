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

当前自动化结果：10 个单元测试、17 个端到端测试全部通过。

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