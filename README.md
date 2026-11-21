# 关于你的单案例研究 · V2.0

一个约 **5 分钟**完成、可分享的娱乐性自我观察测试。用户回答 **30 道情境题**，系统在本地生成一份以用户为唯一样本的“人格观察报告”：主原型、竞争解释、证据分布与行动建议。

## 产品边界

- 娱乐性自我报告，不构成心理/医疗诊断
- 无需登录、无后端、无 AI API
- 不上传答案、结果或个人资料
- 不做命理预测、支付、云同步或账号体系
- 刷新页面可恢复本地进度；清除数据前会二次确认

## 方法噱头

产品借用单案例研究的方法语言作为叙事框架：

- 研究对象：你，样本量 `n=1`
- 研究材料：30 个情境选择
- 结果结构：主原型、竞争解释、证据分布、反例与局限
- 方法框架：Anecdotal Case Study Paper Skill

这不是正式心理测量，也不声称能给出稳定人格结论。

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

- Vitest：30 题题库、主副原型评分、确定性、存储恢复与分享文案
- Playwright：完整答题、刷新恢复、分享下载、错误恢复、键盘操作、移动端、离线
- Axe：首页与结果页 critical/serious 可访问性问题检查

## 结构

```text
src/domain/       30 题题库、8 种原型、主副原型评分
src/product.ts    产品名、题量、方法框架等品牌常量
src/state/        localStorage v2、会话状态机
src/ui/           Hash 路由、邀请页、答题页、研究报告结果页
src/share/        Canvas 分享卡、下载、复制
tests/unit/       Vitest
tests/e2e/        Playwright
qa/screenshots/   视觉 QA 证据
```

## 版本兼容

V2 使用新的存储键 `single_case_study_v2` 和 `schemaVersion: 2`。旧版 10 题草稿不会被静默迁移或误用。

## 分享与归因

分享卡按主原型生成 UTM 链接：

```text
?utm_source=share_card&utm_medium=image&utm_content=<archetype-id>
```

默认域名：

```text
https://ypeachee.github.io/ypeachsoul/
```

部署到其他域名时，在构建环境中设置：

```bash
VITE_PUBLIC_BASE_URL=https://your-domain.example/
```
