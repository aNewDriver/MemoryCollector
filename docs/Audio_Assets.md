# 音效资源清单

## BGM (背景音乐)

### 必需
| 文件名 | 场景 | 风格参考 | 时长 |
|--------|------|----------|------|
| main_theme.mp3 | 主界面/登录 | 废土、史诗感、弦乐+钢琴 | 2-3分钟循环 |
| city.mp3 | 主城 | 宁静、略带忧伤、吉他+轻打击 | 2分钟循环 |
| battle.mp3 | 战斗 | 紧张、鼓点、电子+管弦 | 1-2分钟循环 |
| tower.mp3 | 爬塔 | 压抑、递进、低音弦乐 | 2分钟循环 |
| victory.mp3 | 战斗胜利 | 欢快、铜管+弦乐 | 5-10秒 |
| defeat.mp3 | 战斗失败 | 低沉、大提琴 | 5-10秒 |

### 可选
| 文件名 | 场景 | 说明 |
|--------|------|------|
| adventure.mp3 | 探险关卡选择 | 神秘、探索感 |
| gacha.mp3 | 抽卡界面 | 梦幻、期待感 |
| boss_battle.mp3 | Boss战 | 更激烈、有压迫感 |

## SFX (音效)

### UI 音效
| 文件名 | 触发时机 | 描述 |
|--------|----------|------|
| button_click.mp3 | 按钮点击 | 轻快的"咔哒"声 |
| panel_open.mp3 | 面板打开 | 滑入声 |
| panel_close.mp3 | 面板关闭 | 滑出声 |
| tab_switch.mp3 | 标签切换 | 轻触声 |
| popup.mp3 | 弹窗出现 | 提示音 |

### 战斗音效
| 文件名 | 触发时机 | 描述 |
|--------|----------|------|
| attack_normal.mp3 | 普通攻击 | 挥剑/打击声 |
| attack_heavy.mp3 | 重击 | 沉闷的撞击 |
| skill_cast.mp3 | 技能释放 | 能量聚集声 |
| skill_hit.mp3 | 技能命中 | 爆炸/冲击声 |
| buff_apply.mp3 | 增益效果 | 上升音效 |
| debuff_apply.mp3 | 减益效果 | 下降音效 |
| heal.mp3 | 治疗 | 恢复音效 |
| shield.mp3 | 护盾 | 防护罩声 |
| dodge.mp3 | 闪避 | 风声 |
| crit.mp3 | 暴击 | 金属撞击+回响 |
| unit_die.mp3 | 单位死亡 | 消散声 |
| battle_start.mp3 | 战斗开始 | 号角/鼓声 |
| battle_win.mp3 | 战斗胜利 | 欢呼+胜利音乐开头 |
| battle_lose.mp3 | 战斗失败 | 低沉音效 |

### 养成音效
| 文件名 | 触发时机 |
|--------|----------|
| level_up.mp3 | 卡牌升级 |
| ascension.mp3 | 卡牌突破 |
| awaken.mp3 | 卡牌觉醒 |
| equip_enhance.mp3 | 装备强化 |
| equip_equip.mp3 | 穿戴装备 |

### 抽卡音效
| 文件名 | 触发时机 |
|--------|----------|
| gacha_start.mp3 | 抽卡开始 |
| gacha_result_common.mp3 | 普通结果 |
| gacha_result_rare.mp3 | 稀有结果 |
| gacha_result_epic.mp3 | 史诗结果 |
| gacha_result_legend.mp3 | 传说结果 |
| gacha_result_myth.mp3 | 神话结果 |

### 其他
| 文件名 | 触发时机 |
|--------|----------|
| reward_get.mp3 | 获得奖励 |
| task_complete.mp3 | 任务完成 |
| item_get.mp3 | 获得物品 |
| error.mp3 | 操作错误 |
| new_message.mp3 | 新消息提示 |

## 格式要求

- **格式**: MP3 (兼容性好) 或 OGG (更小)
- **采样率**: 44.1kHz
- **位率**: BGM 192kbps, SFX 128kbps
- **循环**: BGM 需要无缝循环

## 占位文件

开发阶段可以使用空音频文件或简单的"哔"声占位。
