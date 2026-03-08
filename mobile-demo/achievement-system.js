// 成就系统 - Memory Collector
// 包含多种成就类型：收集、战斗、剧情、成长

// 成就定义
const ACHIEVEMENTS = {
    // 收集类成就
    collection: [
        {
            id: 'col_001',
            name: '初次收集',
            desc: '获得第一张卡牌',
            icon: '🎴',
            condition: { type: 'card_count', value: 1 },
            reward: { gold: 100 }
        },
        {
            id: 'col_010',
            name: '卡牌收藏家',
            desc: '收集10张卡牌',
            icon: '📚',
            condition: { type: 'card_count', value: 10 },
            reward: { gold: 500 }
        },
        {
            id: 'col_050',
            name: '卡牌大师',
            desc: '收集50张卡牌',
            icon: '🏆',
            condition: { type: 'card_count', value: 50 },
            reward: { gold: 2000, card: 'SR001' }
        },
        {
            id: 'col_100',
            name: '卡牌传说',
            desc: '收集100张卡牌',
            icon: '👑',
            condition: { type: 'card_count', value: 100 },
            reward: { gold: 5000, card: 'SSR001' }
        },
        {
            id: 'col_ur001',
            name: '终极传说',
            desc: '获得第一张UR卡牌',
            icon: '☀️',
            condition: { type: 'first_ur', value: 1 },
            reward: { gold: 10000 }
        },
        {
            id: 'col_ssr001',
            name: 'SSR！',
            desc: '获得第一张SSR卡牌',
            icon: '✨',
            condition: { type: 'first_ssr', value: 1 },
            reward: { gold: 3000 }
        },
        {
            id: 'col_all_elements',
            name: '元素大师',
            desc: '收集所有7种元素的卡牌',
            icon: '🌈',
            condition: { type: 'all_elements', value: 7 },
            reward: { gold: 2000 }
        }
    ],

    // 战斗类成就
    battle: [
        {
            id: 'bat_001',
            name: '初次胜利',
            desc: '赢得第一场战斗',
            icon: '⚔️',
            condition: { type: 'battle_win', value: 1 },
            reward: { gold: 200 }
        },
        {
            id: 'bat_010',
            name: '百战老兵',
            desc: '赢得10场战斗',
            icon: '🛡️',
            condition: { type: 'battle_win', value: 10 },
            reward: { gold: 1000 }
        },
        {
            id: 'bat_050',
            name: '百战百胜',
            desc: '赢得50场战斗',
            icon: '🏅',
            condition: { type: 'battle_win', value: 50 },
            reward: { gold: 5000 }
        },
        {
            id: 'bat_boss001',
            name: 'Boss克星',
            desc: '击败第一个Boss',
            icon: '👹',
            condition: { type: 'boss_kill', value: 1 },
            reward: { gold: 1000, expCards: 5 }
        },
        {
            id: 'bat_boss010',
            name: 'Boss猎人',
            desc: '击败10个Boss',
            icon: '🐲',
            condition: { type: 'boss_kill', value: 10 },
            reward: { gold: 5000, expCards: 20 }
        },
        {
            id: 'bat_perfect',
            name: '完美胜利',
            desc: '在全员满血状态下赢得战斗',
            icon: '💎',
            condition: { type: 'perfect_win', value: 1 },
            reward: { gold: 2000 }
        },
        {
            id: 'bat_comeback',
            name: '绝地反击',
            desc: '在只剩1%血量时赢得战斗',
            icon: '🔥',
            condition: { type: 'comeback_win', value: 1 },
            reward: { gold: 3000 }
        },
        {
            id: 'bat_critical',
            name: '暴击之王',
            desc: '单次造成10000+伤害',
            icon: '💥',
            condition: { type: 'max_damage', value: 10000 },
            reward: { gold: 5000 }
        }
    ],

    // 剧情类成就
    story: [
        {
            id: 'story_ch1',
            name: '觉醒者',
            desc: '完成第一章',
            icon: '🌙',
            condition: { type: 'chapter_clear', value: 1 },
            reward: { gold: 1000, card: 'SR003' }
        },
        {
            id: 'story_ch2',
            name: '悲伤征服者',
            desc: '完成第二章',
            icon: '💧',
            condition: { type: 'chapter_clear', value: 2 },
            reward: { gold: 1500, card: 'SR008' }
        },
        {
            id: 'story_ch3',
            name: '迷宫探索者',
            desc: '完成第三章',
            icon: '🗿',
            condition: { type: 'chapter_clear', value: 3 },
            reward: { gold: 2000, card: 'SSR007' }
        },
        {
            id: 'story_ch4',
            name: '怒火平息者',
            desc: '完成第四章',
            icon: '🌋',
            condition: { type: 'chapter_clear', value: 4 },
            reward: { gold: 2500, card: 'SSR008' }
        },
        {
            id: 'story_all',
            name: '记忆守护者',
            desc: '完成所有章节',
            icon: '🏆',
            condition: { type: 'all_chapters', value: 4 },
            reward: { gold: 10000, card: 'UR001' }
        },
        {
            id: 'story_memory',
            name: '记忆收集者',
            desc: '收集所有记忆碎片',
            icon: '💎',
            condition: { type: 'all_memories', value: 10 },
            reward: { gold: 5000 }
        }
    ],

    // 成长类成就
    growth: [
        {
            id: 'growth_lvl10',
            name: '初出茅庐',
            desc: '将一张卡牌升到10级',
            icon: '📈',
            condition: { type: 'card_level', value: 10 },
            reward: { gold: 500 }
        },
        {
            id: 'growth_lvl50',
            name: '登峰造极',
            desc: '将一张卡牌升到50级',
            icon: '⭐',
            condition: { type: 'card_level', value: 50 },
            reward: { gold: 3000 }
        },
        {
            id: 'growth_star3',
            name: '三星闪耀',
            desc: '将一张卡牌升到3星',
            icon: '✨',
            condition: { type: 'card_star', value: 3 },
            reward: { gold: 1000 }
        },
        {
            id: 'growth_star5',
            name: '五星传说',
            desc: '将一张卡牌升到5星',
            icon: '🌟',
            condition: { type: 'card_star', value: 5 },
            reward: { gold: 5000 }
        },
        {
            id: 'growth_gacha10',
            name: '抽卡新手',
            desc: '进行10次抽卡',
            icon: '🎰',
            condition: { type: 'gacha_count', value: 10 },
            reward: { gold: 500 }
        },
        {
            id: 'growth_gacha100',
            name: '抽卡达人',
            desc: '进行100次抽卡',
            icon: '🎯',
            condition: { type: 'gacha_count', value: 100 },
            reward: { gold: 3000 }
        },
        {
            id: 'growth_gold10k',
            name: '小有积蓄',
            desc: '累计获得10000金币',
            icon: '💰',
            condition: { type: 'total_gold', value: 10000 },
            reward: { expCards: 10 }
        },
        {
            id: 'growth_gold100k',
            name: '富可敌国',
            desc: '累计获得100000金币',
            icon: '💎',
            condition: { type: 'total_gold', value: 100000 },
            reward: { gold: 10000 }
        }
    ],

    // 特殊成就
    special: [
        {
            id: 'special_first',
            name: '初次见面',
            desc: '第一次登录游戏',
            icon: '👋',
            condition: { type: 'first_login', value: 1 },
            reward: { gold: 100, card: 'N001' }
        },
        {
            id: 'special_daily',
            name: '每日签到',
            desc: '连续登录7天',
            icon: '📅',
            condition: { type: 'login_streak', value: 7 },
            reward: { gold: 1000, expCards: 5 }
        },
        {
            id: 'special_secret',
            name: '隐藏成就',
            desc: '发现游戏中的秘密',
            icon: '🔮',
            condition: { type: 'secret_found', value: 1 },
            reward: { gold: 5000 }
        }
    ]
};

// 成就管理器
class AchievementManager {
    constructor() {
        this.unlockedAchievements = [];
        this.progress = {};
        this.loadProgress();
    }

    // 加载进度
    loadProgress() {
        const saved = localStorage.getItem('achievement_progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.unlockedAchievements = data.unlocked || [];
            this.progress = data.progress || {};
        }
    }

    // 保存进度
    saveProgress() {
        localStorage.setItem('achievement_progress', JSON.stringify({
            unlocked: this.unlockedAchievements,
            progress: this.progress
        }));
    }

    // 更新进度
    updateProgress(type, value = 1) {
        // 更新该类型的累计进度
        if (!this.progress[type]) {
            this.progress[type] = 0;
        }
        this.progress[type] += value;

        // 检查所有成就是否达成
        this.checkAllAchievements();
        this.saveProgress();
    }

    // 设置进度（用于特定值）
    setProgress(type, value) {
        this.progress[type] = value;
        this.checkAllAchievements();
        this.saveProgress();
    }

    // 检查所有成就
    checkAllAchievements() {
        const allAchievements = [
            ...ACHIEVEMENTS.collection,
            ...ACHIEVEMENTS.battle,
            ...ACHIEVEMENTS.story,
            ...ACHIEVEMENTS.growth,
            ...ACHIEVEMENTS.special
        ];

        const newlyUnlocked = [];
        for (const ach of allAchievements) {
            if (!this.unlockedAchievements.includes(ach.id)) {
                if (this.checkAchievement(ach)) {
                    this.unlockAchievement(ach);
                    newlyUnlocked.push(ach);
                }
            }
        }

        return newlyUnlocked;
    }

    // 检查单个成就条件
    checkAchievement(achievement) {
        const condition = achievement.condition;
        const currentValue = this.progress[condition.type] || 0;
        return currentValue >= condition.value;
    }

    // 解锁成就
    unlockAchievement(achievement) {
        this.unlockedAchievements.push(achievement.id);
        this.saveProgress();
        
        // 发放奖励
        this.grantReward(achievement.reward);
        
        // 显示解锁提示
        this.showUnlockNotification(achievement);
    }

    // 发放奖励
    grantReward(reward) {
        if (reward.gold) {
            playerData.gold += reward.gold;
            updateMainUI();
        }
        if (reward.expCards) {
            playerData.expCards += reward.expCards;
            updateMainUI();
        }
        if (reward.card) {
            // 添加卡牌到收藏
            const card = findCardById(reward.card);
            if (card) {
                playerData.cards.push(new CardInstance(card));
                updateMainUI();
            }
        }
    }

    // 显示解锁提示
    showUnlockNotification(achievement) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #1a1a2e;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
            z-index: 9999;
            animation: slideIn 0.5s ease;
            max-width: 300px;
        `;
        notification.innerHTML = `
            <div style="font-size: 40px; text-align: center; margin-bottom: 10px;">🏆</div>
            <div style="font-weight: bold; text-align: center; margin-bottom: 5px;">成就解锁！</div>
            <div style="font-size: 18px; text-align: center; color: #333;">${achievement.name}</div>
            <div style="font-size: 12px; text-align: center; color: #666; margin-top: 5px;">${achievement.desc}</div>
            <div style="text-align: center; margin-top: 10px; font-size: 14px;">
                ${achievement.reward.gold ? `💰 +${achievement.reward.gold}` : ''}
                ${achievement.reward.expCards ? ` 📖 +${achievement.reward.expCards}` : ''}
                ${achievement.reward.card ? ` 🎴 新卡牌!` : ''}
            </div>
        `;

        document.body.appendChild(notification);

        // 3秒后移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // 获取所有成就进度
    getAllProgress() {
        const allAchievements = [
            ...ACHIEVEMENTS.collection.map(a => ({ ...a, category: 'collection' })),
            ...ACHIEVEMENTS.battle.map(a => ({ ...a, category: 'battle' })),
            ...ACHIEVEMENTS.story.map(a => ({ ...a, category: 'story' })),
            ...ACHIEVEMENTS.growth.map(a => ({ ...a, category: 'growth' })),
            ...ACHIEVEMENTS.special.map(a => ({ ...a, category: 'special' }))
        ];

        return allAchievements.map(ach => ({
            ...ach,
            unlocked: this.unlockedAchievements.includes(ach.id),
            progress: this.progress[ach.condition.type] || 0,
            target: ach.condition.value
        }));
    }

    // 获取统计信息
    getStats() {
        const total = [
            ...ACHIEVEMENTS.collection,
            ...ACHIEVEMENTS.battle,
            ...ACHIEVEMENTS.story,
            ...ACHIEVEMENTS.growth,
            ...ACHIEVEMENTS.special
        ].length;

        return {
            total,
            unlocked: this.unlockedAchievements.length,
            percentage: Math.floor((this.unlockedAchievements.length / total) * 100)
        };
    }
}

// 全局成就管理器实例
let achievementManager = null;

// 初始化成就系统
function initAchievementSystem() {
    achievementManager = new AchievementManager();
    console.log('成就系统已初始化');
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ACHIEVEMENTS, AchievementManager, initAchievementSystem };
}
