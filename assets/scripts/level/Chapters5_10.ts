/**
 * 第五章：时光回廊
 * 主题：时间循环与记忆重置
 */

import { LevelConfig } from '../LevelData';

export const CHAPTER_5_LEVELS: LevelConfig[] = [
    {
        id: 'level_5_1',
        name: '时间裂隙',
        chapter: 5,
        description: '时光之河出现了裂隙，过去与现在交织在一起。玩家需要在不断重置的时间循环中找到出路。',
        background: 'time_rift',
        difficulty: 4,
        enemyIds: ['time_wraith', 'memory_fragment', 'chrono_guard'],
        enemyLevel: 45,
        rewards: {
            exp: 2500,
            gold: 1500,
            memoryShards: 80,
            cards: ['time_walker', 'chrono_blade']
        },
        specialRules: ['时间循环：每3回合重置双方状态', '记忆回溯：可使用上一回合的手牌'],
        storySegments: [
            { trigger: 'start', dialogId: 'ch5_start' },
            { trigger: 'mid', dialogId: 'ch5_rift_discovered' },
            { trigger: 'end', dialogId: 'ch5_time_master_appears' }
        ]
    },
    {
        id: 'level_5_2',
        name: '遗忘档案馆',
        chapter: 5,
        description: '存放着所有被遗忘记忆的神秘档案馆。这里的历史可以被改写，但代价是失去自己的记忆。',
        background: 'archive_hall',
        difficulty: 4,
        enemyIds: ['archive_keeper', 'forgotten_librarian', 'history_rewriter'],
        enemyLevel: 48,
        rewards: {
            exp: 2800,
            gold: 1700,
            memoryShards: 90,
            cards: ['archivist_wisdom', 'forgotten_spell']
        },
        specialRules: ['记忆代价：使用强力卡牌会失去一张手牌', '历史修正：敌方会复制你上回合使用的技能'],
        storySegments: [
            { trigger: 'start', dialogId: 'ch5_archive_entrance' },
            { trigger: 'boss', dialogId: 'ch5_librarian_boss' }
        ]
    },
    {
        id: 'level_5_3',
        name: '时光守护者',
        chapter: 5,
        description: '第五章Boss战。时光守护者掌控着时间的流动，他能将敌人送回过去或抛向未来。',
        background: 'time_throne',
        difficulty: 5,
        enemyIds: ['chronos_keeper_boss'],
        enemyLevel: 52,
        isBossLevel: true,
        rewards: {
            exp: 5000,
            gold: 3000,
            memoryShards: 150,
            cards: ['time_master', 'eternal_moment'],
            relics: ['relic_time_amulet']
        },
        specialRules: [
            '时间加速：Boss每回合获得额外行动',
            '时光倒流：Boss生命值低于50%时，回到满血状态（限1次）',
            '时间停滞：随机冻结玩家手牌1回合'
        ],
        storySegments: [
            { trigger: 'start', dialogId: 'ch5_boss_intro' },
            { trigger: 'phase2', dialogId: 'ch5_boss_phase2' },
            { trigger: 'end', dialogId: 'ch5_victory' }
        ]
    }
];

/**
 * 第六章：虚空边境
 * 主题：现实与虚空的交界
 */
export const CHAPTER_6_LEVELS: LevelConfig[] = [
    {
        id: 'level_6_1',
        name: '虚空裂缝',
        chapter: 6,
        description: '现实世界的边缘出现了裂缝，虚空正在侵蚀这个世界。',
        background: 'void_rift',
        difficulty: 5,
        enemyIds: ['void_spawn', 'reality_tear', 'entropy_being'],
        enemyLevel: 55,
        rewards: {
            exp: 3000,
            gold: 1800,
            memoryShards: 100,
            cards: ['void_walker', 'entropy_touch']
        },
        specialRules: ['虚空腐蚀：每回合损失5%最大生命', '现实扭曲：随机改变卡牌效果']
    },
    {
        id: 'level_6_2',
        name: '镜像迷宫',
        chapter: 6,
        description: '虚空中的迷宫，每一个转角都可能是陷阱，也可能是通往真相的道路。',
        background: 'mirror_maze',
        difficulty: 5,
        enemyIds: ['mirror_clone', 'reflection_demon', 'illusion_master'],
        enemyLevel: 58,
        rewards: {
            exp: 3300,
            gold: 2000,
            memoryShards: 110,
            cards: ['mirror_image', 'reflection_spell']
        },
        specialRules: ['镜像复制：敌人会复制你的属性', '真假难辨：无法区分敌人和镜像']
    },
    {
        id: 'level_6_3',
        name: '虚空之主',
        chapter: 6,
        description: '第六章Boss战。虚空之主吞噬一切存在，连光线都无法逃脱。',
        background: 'void_throne',
        difficulty: 6,
        enemyIds: ['void_lord_boss'],
        enemyLevel: 62,
        isBossLevel: true,
        rewards: {
            exp: 6000,
            gold: 3500,
            memoryShards: 180,
            cards: ['void_emperor', 'reality_tear'],
            relics: ['relic_void_heart']
        },
        specialRules: [
            '虚空吞噬：每回合随机移除玩家一张卡牌',
            '黑暗降临：第5回合后，所有治疗效果反转',
            '虚空召唤：Boss会召唤虚空生物协助战斗'
        ]
    }
];

/**
 * 第七章：记忆圣殿
 * 主题：终极记忆的守护
 */
export const CHAPTER_7_LEVELS: LevelConfig[] = [
    {
        id: 'level_7_1',
        name: '圣殿前厅',
        chapter: 7,
        description: '通往记忆圣殿的道路，只有最纯净的记忆才能通过。',
        background: 'temple_entrance',
        difficulty: 6,
        enemyIds: ['temple_guardian', 'memory_sentinel', 'sacred_warden'],
        enemyLevel: 65,
        rewards: {
            exp: 3500,
            gold: 2200,
            memoryShards: 120,
            cards: ['temple_guardian', 'sacred_light']
        },
        specialRules: ['纯净考验：只有N和R品质卡牌可用', '记忆审判：根据收集的记忆碎片数量获得增益']
    },
    {
        id: 'level_7_2',
        name: '记忆回廊',
        chapter: 7,
        description: '无数记忆在此交织，真实与虚假难以分辨。',
        background: 'memory_corridor',
        difficulty: 6,
        enemyIds: ['memory_phantom', 'false_memory', 'reality_checker'],
        enemyLevel: 68,
        rewards: {
            exp: 3800,
            gold: 2400,
            memoryShards: 130,
            cards: ['memory_phantom', 'truth_seeker']
        },
        specialRules: ['记忆混乱：每回合随机交换手牌', '真实之眼：连续3回合使用相同元素卡牌可揭示真相']
    },
    {
        id: 'level_7_3',
        name: '圣殿守护者',
        chapter: 7,
        description: '第七章Boss战。圣殿守护者拥有所有记忆的力量。',
        background: 'sanctum_inner',
        difficulty: 7,
        enemyIds: ['sanctum_guardian_boss'],
        enemyLevel: 72,
        isBossLevel: true,
        rewards: {
            exp: 7000,
            gold: 4000,
            memoryShards: 200,
            cards: ['memory_sage', 'eternal_guardian'],
            relics: ['relic_sanctum_key']
        },
        specialRules: [
            '记忆共鸣：Boss会使用你之前战斗中使用过的技能',
            '时间回溯：Boss每3回合恢复所有生命值',
            '记忆封印：随机封印玩家一种元素的卡牌'
        ]
    }
];

/**
 * 第八至十章关卡配置
 */
export const CHAPTER_8_10_LEVELS: LevelConfig[] = [
    // 第八章：命运交织
    {
        id: 'level_8_1',
        name: '命运之网',
        chapter: 8,
        description: '所有选择汇聚于此，命运之网开始编织最终结局。',
        background: 'fate_loom',
        difficulty: 7,
        enemyIds: ['fate_weaver', 'destiny_spinner', 'karma_collector'],
        enemyLevel: 75,
        rewards: { exp: 4000, gold: 2500, memoryShards: 140, cards: ['fate Weaver', 'destiny_thread'] }
    },
    {
        id: 'level_8_2',
        name: '因果轮回',
        chapter: 8,
        description: '因果循环，每一个选择都影响着最终的结果。',
        background: 'karma_circle',
        difficulty: 7,
        enemyIds: ['karma_lord', 'cause_effect_entity'],
        enemyLevel: 78,
        rewards: { exp: 4300, gold: 2700, memoryShards: 150, cards: ['karma_master', 'cause_effect'] }
    },
    {
        id: 'level_8_3',
        name: '命运编织者',
        chapter: 8,
        description: '第八章Boss战。命运编织者掌控着所有生命的轨迹。',
        background: 'fate_throne',
        difficulty: 8,
        enemyIds: ['fate_weaver_boss'],
        enemyLevel: 82,
        isBossLevel: true,
        rewards: { exp: 8000, gold: 4500, memoryShards: 220, cards: ['fate_maker', 'destiny_controller'], relics: ['relic_fate_thread'] }
    },
    
    // 第九章：真相浮现
    {
        id: 'level_9_1',
        name: '真相迷宫',
        chapter: 9,
        description: '真相被隐藏在迷宫深处，只有真正的记忆回收者才能找到。',
        background: 'truth_maze',
        difficulty: 8,
        enemyIds: ['truth_guardian', 'secret_keeper', 'mystery_solver'],
        enemyLevel: 85,
        rewards: { exp: 4500, gold: 2800, memoryShards: 160, cards: ['truth_seeker', 'secret_revealer'] }
    },
    {
        id: 'level_9_2',
        name: '终极记忆',
        chapter: 9,
        description: '玩家自己的记忆开始浮现，真相即将揭晓。',
        background: 'ultimate_memory',
        difficulty: 9,
        enemyIds: ['memory_eater', 'truth_devourer'],
        enemyLevel: 88,
        rewards: { exp: 4800, gold: 3000, memoryShards: 170, cards: ['memory_master', 'truth_sayer'] }
    },
    {
        id: 'level_9_3',
        name: '真相守护者',
        chapter: 9,
        description: '第九章Boss战。真相的代价是沉重的。',
        background: 'truth_sanctum',
        difficulty: 9,
        enemyIds: ['truth_guardian_boss'],
        enemyLevel: 92,
        isBossLevel: true,
        rewards: { exp: 9000, gold: 5000, memoryShards: 250, cards: ['ultimate_truth', 'reality_eye'], relics: ['relic_truth_crystal'] }
    },
    
    // 第十章：最终回收
    {
        id: 'level_10_1',
        name: '记忆之源',
        chapter: 10,
        description: '所有记忆的源头，世界的真相即将揭晓。',
        background: 'memory_source',
        difficulty: 9,
        enemyIds: ['source_guardian', 'origin_protector'],
        enemyLevel: 95,
        rewards: { exp: 5000, gold: 3200, memoryShards: 180, cards: ['source_guardian', 'origin_power'] }
    },
    {
        id: 'level_10_2',
        name: '终极考验',
        chapter: 10,
        description: '最终试炼，玩家的所有选择都将在此得到验证。',
        background: 'final_trial',
        difficulty: 10,
        enemyIds: ['trial_master', 'final_judge', 'destiny_arbiter'],
        enemyLevel: 98,
        rewards: { exp: 5500, gold: 3500, memoryShards: 200, cards: ['trial_champion', 'destiny_breaker'] }
    },
    {
        id: 'level_10_3',
        name: '记忆之主',
        chapter: 10,
        description: '最终Boss战。记忆之主的真面目终于揭晓——竟然是玩家自己。',
        background: 'memory_throne_final',
        difficulty: 10,
        enemyIds: ['memory_master_final_boss'],
        enemyLevel: 100,
        isBossLevel: true,
        isFinalLevel: true,
        rewards: {
            exp: 15000,
            gold: 10000,
            memoryShards: 500,
            cards: ['memory_overlord', 'eternal_recycler', 'truth_incarnate'],
            relics: ['relic_memory_crown', 'relic_eternal_locket']
        },
        specialRules: [
            '自我对决：Boss会复制玩家的所有属性和卡组',
            '记忆融合：每回合随机获得玩家已通关Boss的技能',
            '终极选择：战斗第10回合必须做出最终选择，影响结局'
        ]
    }
];

// 导出所有新关卡
export const NEW_LEVELS_CONFIG = [
    ...CHAPTER_5_LEVELS,
    ...CHAPTER_6_LEVELS,
    ...CHAPTER_7_LEVELS,
    ...CHAPTER_8_10_LEVELS
];

// 关卡统计
export const LEVEL_STATISTICS = {
    totalNewLevels: 21,
    chapters: 7, // 第5-10章
    bossLevels: 7,
    finalLevel: 'level_10_3',
    totalLevelsAfterUpdate: 31 // 原有10关 + 新增21关
};
