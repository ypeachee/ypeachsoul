# Acceptance Mapping

日期：2026-11-22
验证命令：`npm run test`、`npm run test:e2e`、`npm run build`
结果：Vitest 20/20，Playwright 21/21，生产构建成功。

| AT ID | 自动化覆盖 | 证据 | 状态 |
| --- | --- | --- | --- |
| AT-001 | `tests/e2e/smoke.spec.ts` · landing page exposes the product promise | Playwright 输出、`qa/screenshots/01-intro.png` | passed |
| AT-002 | `tests/e2e/quiz-flow.spec.ts` · next is disabled until chosen | Playwright 输出、`qa/screenshots/02-quiz.png` | passed |
| AT-003 | `tests/e2e/quiz-flow.spec.ts`、`tests/e2e/accessibility.spec.ts` · 题号与焦点推进 | Playwright 输出、keyboard test | passed |
| AT-004 | `tests/e2e/quiz-flow.spec.ts` · previous preserves the answer | Playwright 输出 | passed |
| AT-005 | `tests/e2e/quiz-flow.spec.ts`、`tests/unit/storage.test.ts` · finish once | Vitest/Playwright 输出 | passed |
| AT-006 | `tests/e2e/result.spec.ts` · result transition <800ms | Playwright 输出 | passed |
| AT-007 | `tests/unit/scoring.test.ts` · deterministic result | Vitest 输出 | passed |
| AT-008 | `tests/e2e/persistence.spec.ts` · refresh restores progress | Playwright 输出 | passed |
| AT-009 | `tests/e2e/recovery.spec.ts` · corrupt draft preserved | Playwright 输出 | passed |
| AT-010 | `tests/e2e/recovery.spec.ts` · session-only fallback | Playwright 输出 | passed |
| AT-011 | `tests/e2e/persistence.spec.ts` · completed result reopen | Playwright 输出 | passed |
| AT-012 | `tests/e2e/result.spec.ts` · required sections and disclaimer | `qa/screenshots/03-result.png` | passed |
| AT-013 | `tests/e2e/share.spec.ts` · 1080×1440 preview and scannable QR | `qa/screenshots/04-share.png` | passed |
| AT-014 | `tests/e2e/share.spec.ts` · downloaded PNG header dimensions | Playwright download artifact + PNG header assertions | passed |
| AT-015 | `tests/e2e/share.spec.ts` · clipboard text | Playwright clipboard assertion | passed |
| AT-016 | `tests/e2e/share.spec.ts` · repeated download clicks | Playwright download count | passed |
| AT-017 | `tests/e2e/recovery.spec.ts` · share fallback | Playwright 输出 | passed |
| AT-018 | `tests/e2e/result.spec.ts` · cancel reset | Playwright 输出 | passed |
| AT-019 | `tests/e2e/result.spec.ts` · confirm reset | Playwright 输出 | passed |
| AT-020 | `tests/e2e/accessibility.spec.ts` · 375px and touch target | Playwright 输出 | passed |
| AT-021 | `tests/e2e/accessibility.spec.ts` · keyboard completion | Playwright 输出 | passed |
| AT-022 | `tests/e2e/accessibility.spec.ts` · Axe and live region | Axe/Playwright 输出 | passed |
| AT-023 | `tests/e2e/accessibility.spec.ts` · reduced motion | Playwright computed style assertion | passed |
| AT-024 | `tests/e2e/accessibility.spec.ts` · offline reload | Playwright offline test | passed |
| AT-025 | `tests/e2e/privacy.spec.ts` · no POST/remote/file input/account/payment | Playwright request log | passed |
| AT-026 | `tests/e2e/lenses.spec.ts` · six-lens appendix | Playwright 输出、`qa/screenshots/05-lenses.png`、`qa/screenshots/06-lens-expanded.png` | passed |

## 补充回归测试

- `tests/e2e/og.spec.ts：验证 OG/X Meta 标签、绝对图片地址以及 1200×630 PNG 尺寸。
- `tests/unit/attribution.test.ts、`tests/e2e/utm.spec.ts：验证 UTM 捕获、参数清理、首次归因与后续分享传参。
- `tests/unit/analytics-events.test.ts、`tests/e2e/analytics.spec.ts：验证转化漏斗事件、UTM 参数和不上传答案。
