# 角色立绘文件命名规范

生成时间: 3/1/2026, 5:39:31 PM

## 文件命名格式

```
{角色ID}_{类型}.png
```

### 示例

| 角色 | 普通立绘 | 觉醒立绘 | 头像 |
|------|----------|----------|------|
| 烬羽 | jin_yu_full.png | jin_yu_awaken.png | jin_yu_portrait.png |
| 青漪 | qing_yi_full.png | qing_yi_awaken.png | qing_yi_portrait.png |
| 逐风 | zhu_feng_full.png | zhu_feng_awaken.png | zhu_feng_portrait.png |
| 岩心 | yan_xin_full.png | yan_xin_awaken.png | yan_xin_portrait.png |
| 明烛 | ming_zhu_full.png | ming_zhu_awaken.png | ming_zhu_portrait.png |
| 残影 | can_ying_full.png | can_ying_awaken.png | can_ying_portrait.png |

## 存放路径

```
assets/resources/images/cards/
├── jin_yu_full.png
├── jin_yu_awaken.png
├── jin_yu_portrait.png
├── qing_yi_full.png
├── ...
```

## 分辨率要求

| 类型 | 分辨率 | 用途 |
|------|--------|------|
| full | 1024 x 1820 | 卡牌详情页全身立绘 |
| awaken | 1024 x 1820 | 觉醒后全身立绘 |
| portrait | 512 x 512 | 头像/列表展示 |

## 格式要求

- **格式**: PNG (支持透明通道)
- **色彩空间**: sRGB
- **位深度**: 8-bit

## 注意事项

1. 生成完成后请检查人物面部是否清晰
2. 确保角色特征与描述一致（发色、眼睛颜色、服装等）
3. 觉醒版本需要有明显的视觉升级效果
4. 所有图片需保持风格统一
