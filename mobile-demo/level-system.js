/**
 * 关卡系统 - 扩展至10个关卡
 * 目标：10个独特关卡
 */

// 关卡数据库
const LEVEL_DATABASE = {
    // 第一章：梦境入口 (已有)
    chapter1: {
        id: 1,
        name: '第一章：觉醒',
        description: '在崩坏的世界中，收集失落的记忆',
        stages: 5,
        difficulty: '简单',
        rewards: { gold: 500, expCards: 5, card: 'SR001' }
    },
    
    // 第二章：悲伤沼泽
    chapter2: {
        id: 2,
        name: '第二章：悲伤沼泽',
        description: '被悲伤情绪笼罩的沼泽地带',
        stages: 5,
        difficulty: '中等',
        enemies: ['sorrow_slime', 'lost_soul', 'grief_knight'],
        boss: {
            name: '悲伤女王',
            icon: '👑',
            hp: 3000,
            atk: 120,
            element: 'water',
            skill: '悲伤之歌(全体降攻)'
        },
        rewards: { gold: 800, expCards: 8, card: 'SR008' }
    },
    
    // 第三章：记忆迷宫
    chapter3: {
        id: 3,
        name: '第三章：记忆迷宫',
        description: '错综复杂的记忆迷宫',
        stages: 6,
        difficulty: '中等',
        enemies: ['memory_guardian', 'nightmare_wisp', 'phantom'],
        boss: {
            name: '迷宫守护者',
            icon: '🗿',
            hp: 4000,
            atk: 140,
            element: 'earth',
            skill: '迷宫陷阱(随机控制)'
        },
        rewards: { gold: 1000, expCards: 10, card: 'SSR007' }
    },
    
    // 第四章：愤怒火山
    chapter4: {
        id: 4,
        name: '第四章：愤怒火山',
        description: '被愤怒吞噬的火焰之地',
        stages: 5,
        difficulty: '困难',
        enemies: ['lava_beast', 'fire_elemental', 'rage_warrior'],
        boss: {
            name: '愤怒之王',
            icon: '👹',
            hp: 5000,
            atk: 160,
            element: 'fire',
            skill: '怒火爆发(全体高伤害)'
        },
        rewards: { gold: 1200, expCards: 12, card: 'SSR008' }
    },
    
    // 第五章：寂静冰原
    chapter5: {
        id: 5,
        name: '第五章：寂静冰原',
        description: '冰封一切的寂静世界',
        stages: 5,
        difficulty: '困难',
        enemies: ['ice_wraith', 'frozen_guardian', 'blizzard_mage'],
        boss: {
            name: '冰霜巨龙',
            icon: '🐉',
            hp: 6000,
            atk: 150,
            element: 'water',
            skill: '冰封世界(全体冰冻)'
        },
        rewards: { gold: 1500, expCards: 15, card: 'SSR009' }
    },
    
    // 第六章：黄金圣殿
    chapter6: {
        id: 6,
        name: '第六章：黄金圣殿',
        description: '神圣不可侵犯的光明圣殿',
        stages: 6,
        difficulty: '困难',
        enemies: ['holy_knight', 'light_sentinel', 'divine_healer'],
        boss: {
            name: '圣殿大天使',
            icon: '👼',
            hp: 5500,
            atk: 170,
            element: 'light',
            skill: '圣光审判(净化+伤害)'
        },
        rewards: { gold: 1800, expCards: 18, card: 'SSR011' }
    },
    
    // 第七章：暗影深渊
    chapter7: {
        id: 7,
        name: '第七章：暗影深渊',
        description: '最深处的黑暗与恐惧',
        stages: 6,
        difficulty: '极难',
        enemies: ['shadow_demon', 'void_walker', 'abyss_watcher'],
        boss: {
            name: '深渊之主',
            icon: '😈',
            hp: 8000,
            atk: 200,
            element: 'dark',
            skill: '深渊凝视(恐惧+吸血)'
        },
        rewards: { gold: 2000, expCards: 20, card: 'SSR010' }
    },
    
    // 第八章：时空裂隙
    chapter8: {
        id: 8,
        name: '第八章：时空裂隙',
        description: '时空交错的不稳定区域',
        stages: 5,
        difficulty: '极难',
        enemies: ['time_warper', 'space_rifter', 'paradox_guardian'],
        boss: {
            name: '时空管理者',
            icon: '⏰',
            hp: 7000,
            atk: 180,
            element: 'metal',
            skill: '时间回溯(恢复生命)'
        },
        rewards: { gold: 2200, expCards: 22, card: 'SSR013' }
    },
    
    // 第九章：元素风暴
    chapter9: {
        id: 9,
        name: '第九章：元素风暴',
        description: '所有元素暴走的风暴中心',
        stages: 7,
        difficulty: '噩梦',
        enemies: ['fire_storm', 'ice_storm', 'lightning_storm', 'earth_quaker'],
        boss: {
            name: '元素混沌',
            icon: '🌪️',
            hp: 10000,
            atk: 220,
            element: 'random',
            skill: '元素暴走(随机元素伤害)'
        },
        rewards: { gold: 2500, expCards: 25, card: 'SSR014' }
    },
    
    // 第十章：最终之战
    chapter10: {
        id: 10,
        name: '第十章：记忆之源',
        description: '一切记忆的起点与终点',
        stages: 8,
        difficulty: '噩梦',
        enemies: ['memory_guardian_elite', 'void_master', 'time_lord'],
        boss: {
            name: '遗忘之神',
            icon: '👁️',
            hp: 15000,
            atk: 250,
            element: 'dark',
            skill: '终极遗忘(清除所有buff+巨额伤害)',
            phases: 3
        },
        rewards: { gold: 5000, expCards: 50, card: 'SSR020' }
    }
};

// 关卡管理器
class LevelManager {
    constructor() {
        this.currentChapter = 1;
        this.completedChapters = [];
        this.currentStage = 1;
    }
    
    // 获取关卡信息
    getChapter(chapterId) {
        return LEVEL_DATABASE[`chapter${chapterId}`];
    }
    
    // 获取所有关卡
    getAllChapters() {
        return Object.values(LEVEL_DATABASE);
    }
    
    // 检查关卡是否解锁
    isChapterUnlocked(chapterId) {
        if (chapterId === 1) return true;
        return this.completedChapters.includes(chapterId - 1);
    }
    
    // 完成关卡
    completeChapter(chapterId) {
        if (!this.completedChapters.includes(chapterId)) {
            this.completedChapters.push(chapterId);
        }
    }
    
    // 获取关卡进度
    getProgress() {
        return {
            current: this.currentChapter,
            completed: this.completedChapters.length,
            total: Object.keys(LEVEL_DATABASE).length
        };
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVEL_DATABASE, LevelManager };
}
