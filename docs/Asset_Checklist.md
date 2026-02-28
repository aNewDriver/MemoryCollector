# 资源制作清单

## 美术资源总览

| 分类 | 数量 | 优先级 | 状态 |
|------|------|--------|------|
| 角色立绘 | 18张 | P0 | ⏳ 待生成 |
| UI素材 | 约50个 | P1 | ⏳ 待制作 |
| 特效 | 约20个 | P2 | ⏳ 待制作 |
| 场景背景 | 5张 | P1 | ⏳ 待制作 |

---

## P0 - 必需（影响核心玩法）

### 角色立绘（18张）

每个角色3张：头像(1:1) + 全身(9:16) + 觉醒(9:16)

| 角色 | 头像 | 全身 | 觉醒 | 用途 |
|------|------|------|------|------|
| 烬羽 | ⬜ | ⬜ | ⬜ | 火系输出 |
| 青漪 | ⬜ | ⬜ | ⬜ | 水系治疗 |
| 逐风 | ⬜ | ⬜ | ⬜ | 风系刺客 |
| 岩心 | ⬜ | ⬜ | - | 土系坦克 |
| 明烛 | ⬜ | ⬜ | ⬜ | 光系辅助 |
| 残影 | ⬜ | ⬜ | ⬜ | 暗系核心 |

**生成方式：** 使用 `docs/Art_Prompts.md` 中的Prompt

**文件命名：**
```
assets/resources/images/cards/
├── jin_yu_portrait.png      (512x512)
├── jin_yu_full.png          (1024x1820)
├── jin_yu_awaken.png        (1024x1820)
├── qing_yi_portrait.png
├── qing_yi_full.png
├── qing_yi_awaken.png
...以此类推
```

### 技能图标（约15个）

| 图标 | 描述 | 风格 |
|------|------|------|
| skill_fire_slash.png | 炎斩 - 火焰剑气 | 红色，剑形 |
| skill_red_lotus.png | 红莲业火 - 范围火焰 | 莲花+火焰 |
| skill_clear_sound.png | 清音 - 治疗音符 | 蓝色，音符 |
| skill_flowing_water.png | 流水回春 - 群体治疗 | 水波效果 |
| skill_wind_blade.png | 风刃 - 快速斩击 | 绿色，风痕 |
| skill_shield_bash.png | 盾击 - 嘲讽 | 盾牌撞击 |
| skill_candle_light.png | 烛照 - 光芒 | 蜡烛+光晕 |
| ... | ... | ... |

**尺寸：** 128x128 或 256x256
**风格：** 剪影+光效，与游戏UI统一

---

## P1 - 重要（影响体验）

### UI素材

#### 基础组件
| 素材 | 尺寸 | 用途 |
|------|------|------|
| btn_primary.png | 可调 | 主按钮背景 |
| btn_secondary.png | 可调 | 次按钮背景 |
| btn_disabled.png | 可调 | 禁用按钮 |
| panel_bg.png | 可调 | 面板背景 |
| frame_common.png | 可调 | 普通卡牌边框 |
| frame_rare.png | 可调 | 稀有卡牌边框 |
| frame_epic.png | 可调 | 史诗卡牌边框 |
| frame_legend.png | 可调 | 传说卡牌边框 |
| frame_myth.png | 可调 | 神话卡牌边框 |

#### 图标
| 素材 | 尺寸 | 用途 |
|------|------|------|
| icon_gold.png | 64x64 | 金币图标 |
| icon_crystal.png | 64x64 | 魂晶图标 |
| icon_exp.png | 64x64 | 经验图标 |
| icon_energy.png | 64x64 | 能量图标 |
| icon_heart.png | 64x64 | 生命图标 |
| icon_attack.png | 64x64 | 攻击图标 |
| icon_defense.png | 64x64 | 防御图标 |
| icon_speed.png | 64x64 | 速度图标 |

#### 元素图标
| 素材 | 尺寸 | 用途 |
|------|------|------|
| element_fire.png | 64x64 | 火元素 |
| element_water.png | 64x64 | 水元素 |
| element_wind.png | 64x64 | 风元素 |
| element_earth.png | 64x64 | 土元素 |
| element_light.png | 64x64 | 光元素 |
| element_dark.png | 64x64 | 暗元素 |

### 场景背景

| 场景 | 尺寸 | 描述 |
|------|------|------|
| bg_city.png | 750x1334 | 主城 - 废墟城市远景 |
| bg_adventure.png | 750x1334 | 探险 - 废土地图风格 |
| bg_tower.png | 750x1334 | 爬塔 - 通天塔内部 |
| bg_battle.png | 750x1334 | 战斗 - 战场废墟 |
| bg_gacha.png | 750x1334 | 抽卡 - 神秘空间 |

---

## P2 - 加分项（可后续补充）

### 特效

| 特效 | 用途 |
|------|------|
| fx_attack_normal | 普通攻击 |
| fx_attack_crit | 暴击 |
| fx_skill_fire | 火系技能 |
| fx_skill_water | 水技能 |
| fx_skill_heal | 治疗 |
| fx_skill_buff | 增益 |
| fx_level_up | 升级 |
| fx_gacha_common | 普通抽卡 |
| fx_gacha_rare | 稀有抽卡 |
| fx_gacha_epic | 史诗抽卡 |
| fx_gacha_legend | 传说抽卡 |

### 装备图标

6个部位 × 3-4种品质 = 约20个图标

| 部位 | 普通 | 稀有 | 史诗 | 传说 |
|------|------|------|------|------|
| 武器 | ⬜ | ⬜ | ⬜ | ⬜ |
| 头盔 | ⬜ | ⬜ | ⬜ | ⬜ |
| 护甲 | ⬜ | ⬜ | ⬜ | ⬜ |
| 护腿 | ⬜ | ⬜ | ⬜ | ⬜ |
| 饰品 | ⬜ | ⬜ | ⬜ | ⬜ |
| 戒指 | ⬜ | ⬜ | ⬜ | ⬜ |

---

## 音效资源

详见 `docs/Audio_Assets.md`

**优先级：**
1. **P0**：button_click, battle_start, attack_normal, skill_cast, level_up, reward_get
2. **P1**：BGM (main_theme, battle, city), gacha 系列
3. **P2**：其他SFX

---

## 字体

**中文字体推荐：**
- 思源黑体（免费商用）
- 站酷高端黑（免费商用）
- 阿里巴巴普惠体（免费商用）

**用途：**
- 标题字体：粗体，有设计感
- 正文字体：清晰易读
- 数字字体：等宽，易读

---

## 资源制作工具推荐

### AI生成
- **Midjourney**：角色立绘首选
- **Stable Diffusion**：本地部署，批量生成
- **Leonardo.ai**：免费额度多，适合图标

### 图像处理
- **Photoshop**：专业修图、切图
- **Figma**：UI设计
- **Aseprite**：像素风格（备选）

### 音效制作
- **Bfxr**：8-bit音效生成
- **Audacity**：音频编辑
- **爱给网/站长素材**：免费音效下载

### 特效制作
- **Spine**：2D骨骼动画
- **Particle Designer**：粒子特效

---

## 外包建议

如果资源制作工作量太大，可考虑外包：

| 平台 | 适合 |
|------|------|
| 米画师 | 角色立绘 |
| 涂鸦王国 | 角色立绘 |
| 站酷海洛 | UI设计 |
| Fiverr | 海外画师 |

**预算参考：**
- 角色立绘（全身）：500-2000元/张
- UI设计整套：3000-10000元
- 音效打包：500-2000元

---

## 占位资源

开发阶段可使用占位图：
- 纯色色块 + 文字标签
- 网络素材（注意版权）
- AI生成草稿

**占位图命名：**
- 在原文件名后加 `_placeholder`
- 例如：`jin_yu_portrait_placeholder.png`
