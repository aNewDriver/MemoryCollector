# 音效资源配置方案

**项目**: 记忆回收者  
**日期**: 2026-03-02  
**需求**: BGM 5首 + SFX 50+个

---

## 一、背景音乐 (BGM) - 5首

### 1. 主城音乐 (Main City)
- **风格**: 轻松、治愈、梦幻
- **时长**: 2-3分钟循环
- **情绪**: 温馨、安全、家园感
- **参考**: Genshin Impact 蒙德城音乐
- **用途**: 主城场景、公会场景

### 2. 战斗音乐 (Battle)
- **风格**: 紧张、激昂、史诗
- **时长**: 1-2分钟循环
- **情绪**: 热血、压迫感
- **参考**: 传统JRPG战斗音乐
- **用途**: 普通战斗、PVP

### 3. BOSS战音乐 (Boss Battle)
- **风格**: 黑暗、史诗、危机
- **时长**: 2-3分钟循环
- **情绪**: 绝望、壮烈
- **参考**: Dark Souls BOSS战音乐
- **用途**: 世界BOSS、公会BOSS

### 4. 探索音乐 (Exploration)
- **风格**: 神秘、空灵、悠扬
- **时长**: 2-3分钟循环
- **情绪**: 好奇、探索
- **用途**: 关卡探索、爬塔

### 5. 抽卡/奖励音乐 (Gacha/Reward)
- **风格**: 华丽、期待、爽快感
- **时长**: 30秒-1分钟
- **情绪**: 兴奋、惊喜
- **用途**: 抽卡动画、奖励结算

---

## 二、音效 (SFX) - 50+个

### 2.1 UI音效 (10个)

| 音效名称 | 触发场景 | 风格 |
|---------|---------|------|
| ui_click | 按钮点击 | 清脆、短促 |
| ui_hover | 按钮悬停 | 轻微、柔和 |
| ui_back | 返回/关闭 | 低沉、确认感 |
| ui_open | 打开界面 | 展开感 |
| ui_success | 操作成功 | 悦耳、正向 |
| ui_error | 操作失败 | 轻微警示 |
| ui_popup | 弹窗出现 | 轻微提示音 |
| ui_tab | 切换标签 | 滑动感 |
| ui_slide | 滑动/拖拽 | 流畅 |
| ui_notification | 新通知 | 轻微提醒 |

### 2.2 战斗音效 (20个)

| 音效名称 | 触发场景 | 风格 |
|---------|---------|------|
| atk_sword | 剑攻击 | 斩击声 |
| atk_mace | 锤攻击 | 重击声 |
| atk_magic | 魔法攻击 | 能量声 |
| atk_arrow | 射箭 | 破空声 |
| hit_normal | 受击 | 闷响 |
| hit_critical | 暴击 | 清脆、强调 |
| hit_block | 格挡 | 金属碰撞 |
| hit_miss | 闪避 | 风声 |
| skill_fire | 火系技能 | 燃烧、爆炸 |
| skill_ice | 冰系技能 | 碎裂、寒气 |
| skill_lightning | 雷系技能 | 电击、轰鸣 |
| skill_wind | 风系技能 | 呼啸 |
| skill_earth | 土系技能 | 撞击、碎石 |
| skill_heal | 治疗 | 恢复、光效 |
| skill_buff | 增益 | 上升音效 |
| skill_debuff | 减益 | 下降音效 |
| victory | 战斗胜利 | 华丽、胜利感 |
| defeat | 战斗失败 | 低沉 |
| round_start | 回合开始 | 提示音 |
| round_end | 回合结束 | 确认音 |

### 2.3 角色音效 (10个)

| 音效名称 | 触发场景 | 风格 |
|---------|---------|------|
| char_step | 行走 | 轻微 |
| char_jump | 跳跃 | 轻快 |
| char_land | 落地 | 轻微 |
| char_levelup | 升级 | 华丽、成就感 |
| char_evolve | 进化 | 神圣、蜕变 |
| char_awaken | 觉醒 | 史诗、爆发 |
| char_death | 死亡 | 消散 |
| char_revive | 复活 | 希望感 |
| char_equip | 装备更换 | 金属 |
| char_skill | 释放必杀 | 强调 |

### 2.4 系统音效 (10个)

| 音效名称 | 触发场景 | 风格 |
|---------|---------|------|
| coin_get | 获得金币 | 清脆 |
| gem_get | 获得钻石 | 珍贵感 |
| item_get | 获得物品 | 提示音 |
| card_get | 获得卡牌 | 期待感 |
| mail_get | 收到邮件 | 提示音 |
| quest_complete | 任务完成 | 成就感 |
| achievement | 成就解锁 | 华丽 |
| gacha_start | 抽卡开始 | 悬念 |
| gacha_rare | 抽到稀有 | 惊喜 |
| gacha_ssr | 抽到SSR | 史诗、庆祝 |

---

## 三、音效获取方案

### 方案A: 免费开源资源

**推荐网站**:
1. **OpenGameArt.org** - 免费游戏音效
2. **Freesound.org** - 创意共享音效
3. **Zapsplat.com** - 免费游戏音效库
4. **Kenney.nl** - 免费游戏资源
5. ** itch.io** - 独立游戏资源

**优点**: 完全免费  
**缺点**: 需要筛选和后期处理  
**预估耗时**: 2-3天筛选和适配

### 方案B: 商业音效包

**推荐资源**:
1. **Unity Asset Store** - 专业音效包 ($10-50)
2. **Epic Stock Media** - 游戏音效 ($20-100)
3. **Pro Sound Effects** - 高质量音效

**优点**: 质量高、即拿即用  
**缺点**: 需要付费  
**预估成本**: $50-200

### 方案C: AI生成音效

**推荐工具**:
1. **ElevenLabs Sound Effects** - AI生成 (免费额度)
2. **Audiocraft (Meta)** - 开源AI音频
3. **Stable Audio** - Stability AI

**优点**: 定制化、无版权  
**缺点**: 需要后期处理  
**预估成本**: $0 (使用免费额度)

---

## 四、实施建议

### 阶段1: 获取核心音效 (今天)
- 从Kenney.nl下载免费UI音效
- 从OpenGameArt下载基础战斗音效

### 阶段2: AI生成定制音效 (明天)
- 使用ElevenLabs生成5首BGM
- 使用AI生成特色技能音效

### 阶段3: 后期处理 (本周)
- 统一音量标准化
- 格式转换 (OGG/MP3)
- 命名规范化

---

## 五、文件命名规范

```
assets/audio/
├── bgm/
│   ├── bgm_main_city.ogg
│   ├── bgm_battle.ogg
│   ├── bgm_boss.ogg
│   ├── bgm_explore.ogg
│   └── bgm_reward.ogg
├── sfx/
│   ├── ui/
│   │   ├── ui_click.ogg
│   │   └── ...
│   ├── battle/
│   │   ├── atk_sword.ogg
│   │   └── ...
│   ├── character/
│   │   ├── char_levelup.ogg
│   │   └── ...
│   └── system/
│       ├── coin_get.ogg
│       └── ...
```

---

*文档完成 - 等待实施*
