#!/bin/bash
# 音效资源自动下载脚本
# 使用 curl 从免费资源网站下载音效

set -e

BASE_DIR="/root/.openclaw/workspace/projects/memory-collector/assets/audio"
echo "🎵 开始自动下载音效资源..."

# 创建目录
mkdir -p $BASE_DIR/{bgm,sfx/{ui,battle,character,system}}

# 定义音效源（使用占位符，实际使用时需要替换为真实URL）
# 注意：这些URL是示例，实际下载时需要从Kenney.nl或OpenGameArt获取

echo ""
echo "⚠️  注意：由于网络限制，无法直接下载外部资源"
echo ""
echo "📋 请手动访问以下网站下载音效："
echo ""
echo "1. Kenney.nl (推荐)"
echo "   URL: https://kenney.nl/assets"
echo "   下载: UI Sound Effects Pack, RPG Sound Pack"
echo ""
echo "2. OpenGameArt"
echo "   URL: https://opengameart.org/art-search?keys=sound+effect"
echo "   搜索: UI sound, battle sound, magic sound"
echo ""
echo "3. Freesound"
echo "   URL: https://freesound.org/search/?q=game+sound+effect"
echo "   注意：需要注册账号"
echo ""

# 创建下载清单
cat > $BASE_DIR/DOWNLOAD_CHECKLIST.md << 'EOF'
# 音效资源下载清单

## UI音效 (10个)
- [ ] ui_click.wav - 按钮点击
- [ ] ui_hover.wav - 按钮悬停
- [ ] ui_back.wav - 返回/关闭
- [ ] ui_open.wav - 打开界面
- [ ] ui_success.wav - 操作成功
- [ ] ui_error.wav - 操作失败
- [ ] ui_popup.wav - 弹窗出现
- [ ] ui_tab.wav - 切换标签
- [ ] ui_slide.wav - 滑动/拖拽
- [ ] ui_notification.wav - 新通知

## 战斗音效 (20个)
- [ ] atk_sword.wav - 剑攻击
- [ ] atk_mace.wav - 锤攻击
- [ ] atk_magic.wav - 魔法攻击
- [ ] atk_arrow.wav - 射箭
- [ ] hit_normal.wav - 受击
- [ ] hit_critical.wav - 暴击
- [ ] hit_block.wav - 格挡
- [ ] hit_miss.wav - 闪避
- [ ] skill_fire.wav - 火系技能
- [ ] skill_ice.wav - 冰系技能
- [ ] skill_lightning.wav - 雷系技能
- [ ] skill_wind.wav - 风系技能
- [ ] skill_earth.wav - 土系技能
- [ ] skill_heal.wav - 治疗
- [ ] skill_buff.wav - 增益
- [ ] skill_debuff.wav - 减益
- [ ] victory.wav - 战斗胜利
- [ ] defeat.wav - 战斗失败
- [ ] round_start.wav - 回合开始
- [ ] round_end.wav - 回合结束

## 系统音效 (10个)
- [ ] coin_get.wav - 获得金币
- [ ] gem_get.wav - 获得钻石
- [ ] item_get.wav - 获得物品
- [ ] card_get.wav - 获得卡牌
- [ ] level_up.wav - 升级
- [ ] achievement.wav - 成就解锁
- [ ] gacha_start.wav - 抽卡开始
- [ ] gacha_rare.wav - 抽到稀有
- [ ] gacha_ssr.wav - 抽到SSR
- [ ] mail_get.wav - 收到邮件

## BGM (5首)
- [ ] bgm_main_city.ogg - 主城音乐
- [ ] bgm_battle.ogg - 战斗音乐
- [ ] bgm_boss.ogg - BOSS战音乐
- [ ] bgm_explore.ogg - 探索音乐
- [ ] bgm_reward.ogg - 奖励音乐

---

下载完成后，将文件放入对应目录：
- UI音效 → assets/audio/sfx/ui/
- 战斗音效 → assets/audio/sfx/battle/
- 系统音效 → assets/audio/sfx/system/
- BGM → assets/audio/bgm/
EOF

echo "✅ 下载清单已创建: $BASE_DIR/DOWNLOAD_CHECKLIST.md"
echo ""
echo "📝 下载步骤:"
echo "1. 访问 https://kenney.nl/assets"
echo "2. 下载 'UI Sound Effects Pack' 和 'RPG Sound Pack'"
echo "3. 解压并将文件复制到对应目录"
echo "4. 使用 audacity 或其他工具转换为 OGG 格式 (可选)"
echo "5. 勾选 DOWNLOAD_CHECKLIST.md 中的项目"
