# 六镜与 V4 交互实验的来源说明

V4 在 V3 的六镜文化附录上增加了两个完整本地链路：

- **塔罗三牌实验**：完整 78 张牌、本地安全随机、三牌叙事。
- **出生节律排盘**：浏览器内四柱与表层五行计算。

所有结果仍然只是文化娱乐与自我观察工具，不声称预测未来、诊断人格或替代专业建议。

## 来源与许可

| 镜头 | 仓库 / 依赖 | 许可证 | V4 使用方式 |
|---|---|---|---|
| 奇门 / 紫微 | [FANzR-arch/Numerologist_skills](https://github.com/FANzR-arch/Numerologist_skills) | 未声明 | 仅借鉴“先定位、再解释”的高层结构 |
| 八字 | [jinchenma94/bazi-skill](https://github.com/jinchenma94/bazi-skill) | MIT | 借鉴结构化输入、排盘与来源意识；实际四柱由 lunar-typescript 计算 |
| 月老 | [Ming-H/yinyuan-skills](https://github.com/Ming-H/yinyuan-skills) | 未声明 | 仅借鉴关系期待、边界与回应节奏的拆解 |
| 佛学 | [xr843/Master-skill](https://github.com/xr843/Master-skill) | NOASSERTION | 仅借鉴来源意识、边界意识与执着检查 |
| 风水 | [voidforall/fengshui.skill](https://github.com/voidforall/fengshui.skill) | MIT | 仅借鉴环境摩擦的观察方式，不复用代码 |
| 塔罗 | [daman-ovo-0404/tarot-skill](https://github.com/daman-ovo-0404/tarot-skill) | MIT | 借鉴 78 张牌、三牌结构与本地抽牌方法 |
| 四柱历法 | [6tail/lunar-typescript](https://github.com/6tail/lunar-typescript) | MIT | 在浏览器内计算四柱、农历、生肖与大运 |

完整 MIT 许可文本与版权信息见仓库根目录的 `THIRD_PARTY_NOTICES.md`。

## 产品边界

- 不把塔罗或八字结果描述成确定预测。
- 不提供医疗、法律、投资买卖或重大人身决策结论。
- 出生信息只在当前页面内存中处理，不写入 localStorage、不上传。
- 出生时间按北京时间计算，不校正出生地真太阳时。
- 八字页在出生时间未知时只展示年、月、日三柱。
- 表层五行统计不包含地支藏干。
- 未声明许可证或 `NOASSERTION` 的仓库只参考高层方法，不复制代码或大段文案。
