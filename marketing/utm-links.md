# 灵魂使用说明书 UTM 投放链接

基础地址：

```text
https://ypeachee.github.io/ypeachsoul/
```

系统采用首次归因：用户第一次通过带 UTM 的链接进入后，来源会保存在 `localStorage`，后续刷新和后续投放链接不会覆盖首次来源。

## 小红书

通用链接：

```text
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=profile
```

原型系列内容：

```text
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=deep-diver
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=stargazer
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=alchemist
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=dream-weaver
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=architect
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=pathfinder
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=fire-keeper
https://ypeachee.github.io/ypeachsoul/?utm_source=xiaohongshu&utm_medium=social&utm_campaign=launch_202611&utm_content=wind-chaser
```

## 抖音

```text
https://ypeachee.github.io/ypeachsoul/?utm_source=douyin&utm_medium=video&utm_campaign=launch_202611&utm_content=ten_questions_demo
```

原型卡片视频：

```text
https://ypeachee.github.io/ypeachsoul/?utm_source=douyin&utm_medium=video&utm_campaign=launch_202611&utm_content=archetype_cards
```

## 微信

群聊：

```text
https://ypeachee.github.io/ypeachsoul/?utm_source=wechat&utm_medium=group&utm_campaign=seed_202611&utm_content=friends
```

朋友圈：

```text
https://ypeachee.github.io/ypeachsoul/?utm_source=wechat&utm_medium=moments&utm_campaign=launch_202611&utm_content=timeline
```

私信：

```text
https://ypeachee.github.io/ypeachsoul/?utm_source=wechat&utm_medium=dm&utm_campaign=seed_202611&utm_content=one_to_one
```

## 分享卡和复制文案

二维码和复制文案由产品自动生成：

```text
utm_source=share_card&utm_medium=image&utm_campaign=referral&utm_content=<archetype-id>
utm_source=share_text&utm_medium=copy&utm_campaign=referral&utm_content=<archetype-id>
```

如果访问者本身来自某个渠道，分享链接会额外保留：

```text
ref=<首次来源>
```

例如小红书用户继续分享后：

```text
utm_source=share_card&utm_medium=image&utm_campaign=referral&utm_content=architect&ref=xiaohongshu
```

## 命名规则

- `utm_source`：平台，例如 `xiaohongshu`、`douyin`、`wechat`
- `utm_medium`：形式，例如 `social`、`video`、`group`、`moments`、`image`、`copy`
- `utm_campaign`：活动批次，例如 `launch_202611`、`seed_202611`
- `utm_content`：具体内容或原型 ID
- `ref`：用户继续分享时保留的首次来源