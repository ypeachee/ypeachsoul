# 关于你的单案例研究 · V3.1

一个约 **5 分钟**完成、可分享的娱乐性自我观察测试。用户回答 **30 道情境题**，系统在本地生成一份以用户为唯一样本的“人格观察报告”，并附上一份可选的**六镜文化附录**。

## 产品边界

- 娱乐性自我报告，不构成心理/医疗诊断、命理预测或现实决策依据
- 无需登录、无后端、无 AI API
- 不上传答案、结果、出生信息或个人资料
- 不做支付、云同步或账号体系
- 刷新页面可恢复本地进度；清除数据前会二次确认

## 方法噱头

产品借用单案例研究的方法语言作为叙事框架：

- 研究对象：你，样本量 `n=1`
- 研究材料：30 个情境选择
- 结果结构：主原型、竞争解释、证据分布、反例与局限
- 六镜导航与折叠附录：奇门/紫微、八字、月老、佛学、风水、塔罗

方法框架：`Anecdotal Case Study Paper Skill × Six-Lens Culture Lab`

六镜层只提供文化解释与反思问题，不调用真实排盘，不预测未来，也不替代专业建议。

## 六镜来源

| 镜头 | 来源 | 许可 |
|---|---|---|
| 奇门 / 紫微 | `FANzR-arch/Numerologist_skills` | 未声明许可证，仅作方法论参考 |
| 八字 | `jinchenma94/bazi-skill` | MIT |
| 月老 | `Ming-H/yinyuan-skills` | 未声明许可证，仅作方法论参考 |
| 佛学 | `xr843/Master-skill` | NOASSERTION，仅作方法论参考 |
| 风水 | `voidforall/fengshui.skill` | 未声明许可证，仅作方法论参考 |
| 塔罗 | `daman-ovo-0404/tarot-skill` | MIT |

V3 不复制未授权内容；页面内保留来源链接和许可说明。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:4173/`。

## 验证

```bash
npm run test
npm run test:e2e
npm run build
```

- Vitest：30 题题库、主副原型评分、六镜生成、存储恢复与分享文案
- Playwright：完整答题、六镜附录、刷新恢复、分享下载、错误恢复、键盘操作、移动端、离线
- Axe：首页、结果页与六镜附录的 critical/serious 可访问性问题检查

## 结构

```text
src/domain/       30 题题库、8 种原型、主副原型评分
src/knowledge/    六镜定义、确定性叙事生成、塔罗抽牌
src/product.ts    产品名、题量、版本与方法框架
src/state/        localStorage v2、会话状态机
src/ui/           首页、答题页、研究结论页、六镜附录、分享页
src/share/        Canvas 分享卡、下载、复制
tests/unit/       Vitest
tests/e2e/        Playwright
qa/screenshots/   视觉 QA 证据
```

## 版本兼容

V3 沿用 V2 的存储键 `single_case_study_v2` 和 `schemaVersion: 2`；旧版 10 题草稿不会被静默迁移或误用。

## 分享与归因

分享卡按主原型生成 UTM 链接：

```text
?utm_source=share_card&utm_medium=image&utm_content=<archetype-id>
```

默认域名：

```text
https://ypeachee.github.io/ypeachsoul/
```
