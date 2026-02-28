# AI美术生成指南

## 整体风格定义

**关键词**：废土美学、记忆碎片、低饱和度、电影感、叙事性

**色调**：
- 主色调：暗灰、炭黑、深褐（废土基底）
- 强调色：金色记忆光芒、蓝色灵魂微光
- 避免：高饱和糖果色、过于明亮的动漫风格

**画风参考**：
- 角色：Gris + 影之刃 + 略带水墨质感
- 场景：概念艺术风格，有故事感的光影

---

## 角色立绘生成

### 统一基础 Prompt

```
character design, full body, [角色描述], 
post-apocalyptic wasteland setting, 
ethereal golden light particles, memory fragments floating around,
dark muted color palette with golden accents,
concept art style, painterly style, cinematic lighting,
vertical composition, game character portrait,
high detail, 4K, --ar 9:16 --style raw
```

### 各角色专属Prompt

#### 1. 烬羽（火/剑士/稀有）

**中文描述**：
年轻的武士，身穿燃烧殆尽的铠甲，铠甲边缘有焦黑痕迹。手持残破但锋利的长刀，刀身有火焰纹路。眼神坚定而悲伤，黑色长发在风中飘动。背景是燃烧的村庄废墟。

**英文Prompt**：
```
young samurai warrior, charred armor with burnt edges, 
holding a damaged but sharp katana with flame patterns on blade,
determined and sorrowful expression, long black hair flowing,
background of burning village ruins, embers floating in air,
warm orange and red tones mixed with dark grays,
--ar 9:16 --style raw
```

---

#### 2. 青漪（水/琴师/史诗）

**中文描述**：
温婉的女性琴师，身着青色长裙，怀抱古琴。长发如瀑，发间有蓝色丝带。背景是月光下的竹林，有淡淡的水雾和蓝色光点。整体氛围宁静而忧伤。

**英文Prompt**：
```
elegant female musician in flowing cyan dress, holding ancient guqin,
long hair like waterfall with blue ribbons,
serene and melancholic expression,
background of bamboo forest in moonlight, mist and blue light particles,
cool blue and silver tones, peaceful atmosphere,
--ar 9:16 --style raw
```

---

#### 3. 逐风（风/刺客/史诗）

**中文描述**：
神秘的蒙面刺客，身着深色劲装，身形修长。手持双短刃，姿态如蓄势待发的猎豹。背景是狂风中的废墟，风沙和落叶环绕。眼神锐利如刀。

**英文Prompt**：
```
mysterious masked assassin in dark fitted outfit, 
slim agile build, dual short blades ready,
predatory stance like a hunting panther,
background of ruins in strong wind, sand and leaves swirling,
sharp piercing eyes visible through mask,
motion blur effect, dynamic composition,
gray and green tones,
--ar 9:16 --style raw
```

---

#### 4. 岩心（土/盾卫/稀有）

**中文描述**：
魁梧的重装战士，全身覆盖厚重铠甲，手持巨盾。铠甲上有无数划痕和凹痕，是无数战斗的见证。姿态如山岳般稳固。背景是破碎的城墙。

**英文Prompt**：
```
bulky heavy armored warrior, full plate armor with countless battle scars,
holding massive tower shield with crack patterns,
stance immovable like a mountain,
broken city wall background, dust and debris,
stoic determined face partially visible,
brown and gray metallic tones,
--ar 9:16 --style raw
```

---

#### 5. 明烛（光/祭司/传说）

**中文描述**：
圣洁的女性祭司，手持永不熄灭的金色烛灯。白色长袍上有金色纹路，周围环绕着温暖的光芒。面容慈祥而悲悯。背景是黑暗中的微光。

**英文Prompt**：
```
holy female priestess holding golden lantern that never extinguishes,
white robes with golden embroidery patterns,
warm holy light surrounding her,
kind and compassionate face with gentle smile,
background of darkness pierced by golden light rays,
ethereal divine atmosphere,
gold and white color scheme,
--ar 9:16 --style raw --stylize 250
```

---

#### 6. 残影（暗/神话/核心角色）

**中文描述**：
神秘的人形剪影，轮廓模糊但散发出熟悉感。身体由记忆碎片构成，碎片间透出幽蓝光芒。看不清面容，但能感受到复杂的情感。背景是虚无的星空。

**英文Prompt**：
```
mysterious humanoid silhouette made of memory fragments,
fragments showing glimpses of different scenes,
ethereal blue glow between fragments,
face obscured but feeling of familiarity and complex emotions,
void space background with distant stars,
fragmented reality aesthetic,
dark blue and black with blue luminescence,
--ar 9:16 --style raw --stylize 300
```

---

## 通用元素

### 记忆碎片效果
```
floating geometric crystal fragments,
golden and blue luminescence,
ethereal particles,
memories visible inside fragments like holograms,
--ar 9:16
```

### UI背景/边框
```
minimalist frame design, dark weathered metal texture,
golden accent lines, memory crystal decorations at corners,
post-apocalyptic aesthetic, vertical format,
--ar 9:16
```

### 技能图标（512x512）
```
skill icon design, [技能名称/效果],
simple silhouette style, dark background with golden glow,
circular frame with ornate border,
game UI element, high contrast,
--ar 1:1 --style raw
```

例如：
- 火属性技能：`flame slash icon, crossed swords with fire trail, orange and red gradient`
- 治疗技能：`healing light icon, hands with glowing light, soft blue and white`
- 护盾技能：`shield icon, ornate tower shield, stone texture, gray and gold`

---

## 注意事项

1. **统一性**：所有角色保持一致的废土+记忆碎片风格
2. **分辨率**：立绘建议 1024x1820（9:16），头像 512x512
3. **后期处理**：AI出图后需要统一调色、裁剪、添加边框
4. **命名规范**：`角色名_类型.png`，如 `jin_yu_full.png`
5. **版本管理**：保留原始AI出图和后期处理后的版本

---

## 推荐工具

- **Midjourney**：角色立绘首选，风格稳定
- **Stable Diffusion**：本地部署，批量生成图标/UI
- **Photoshop/Procreate**：后期处理、统一风格
- **Upscayl**：AI放大，提升分辨率
