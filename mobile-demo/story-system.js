// 剧情系统 - 第一章+第二章实现

// 剧情场景定义 - 第一章
const STORY_CHAPTER1 = {
    id: 'chapter1',
    name: '第一章：觉醒',
    stages: [
        {
            id: 'entrance',
            type: 'dialogue',
            background: 'dream_entrance',
            bgm: 'dream_ambience',
            lines: [
                { speaker: 'narrator', text: '又是一个梦境。', effect: 'fade_in' },
                { speaker: 'narrator', text: '在这里，记忆是实体，情感是力量。' },
                { speaker: 'narrator', text: '而我，是回收这些失落记忆的人。' },
                { speaker: 'protagonist', text: '这次的委托...是关于一个失去童年的孩子。', emotion: 'thoughtful' },
                { speaker: 'protagonist', text: '让我看看，他的记忆里藏着什么...', emotion: 'determined' }
            ],
            next: 'tutorial_battle'
        },
        {
            id: 'tutorial_battle',
            type: 'battle',
            background: 'dream_battlefield',
            enemies: ['memory_slime'],
            tutorial: true,
            lines: [
                { speaker: 'protagonist', text: '这是...记忆的守卫？', emotion: 'surprised' },
                { speaker: 'protagonist', text: '看来想要回收记忆，必须先击败它们。', emotion: 'ready' }
            ],
            next: 'memory_fragment1'
        },
        {
            id: 'memory_fragment1',
            type: 'cutscene',
            background: 'memory_space',
            bgm: 'memory_reconstruction',
            lines: [
                { speaker: 'narrator', text: '【记忆碎片收集完成】', effect: 'memory_flash' },
                { speaker: 'narrator', text: '一段关于生日的记忆浮现...' },
                { speaker: 'protagonist', text: '这是...他的五岁生日？', emotion: 'surprised' },
                { speaker: 'protagonist', text: '等等，画面角落里那个黑影是...？', emotion: 'concerned' }
            ],
            reward: { memory: 'birthday_memory', gold: 100 },
            next: 'mid_battle'
        },
        {
            id: 'mid_battle',
            type: 'battle',
            background: 'dream_corridor',
            enemies: ['lost_wisp', 'lost_wisp'],
            lines: [
                { speaker: 'protagonist', text: '前面的记忆波动越来越强烈了...', emotion: 'alert' }
            ],
            next: 'boss_intro'
        },
        {
            id: 'boss_intro',
            type: 'dialogue',
            background: 'boss_room',
            bgm: 'boss_theme',
            lines: [
                { speaker: 'protagonist', text: '这里的雾气变浓了...', emotion: 'alert' },
                { speaker: 'boss', text: '又是回收者...你们这些窃取记忆的小偷！', emotion: 'angry', effect: 'boss_appear' },
                { speaker: 'protagonist', text: '不，我是来拯救这些记忆的。', emotion: 'determined' },
                { speaker: 'boss', text: '可笑！记忆一旦破碎，就永远无法复原！', emotion: 'rage' },
                { speaker: 'protagonist', text: '那我就用行动证明给你看。', emotion: 'ready' }
            ],
            next: 'boss_battle'
        },
        {
            id: 'boss_battle',
            type: 'boss',
            background: 'boss_room',
            enemies: ['forgetting_guardian'],
            bossHp: 2000,
            lines: [
                { speaker: 'boss', text: '感受遗忘的力量吧！', emotion: 'rage', trigger: 'battle_start' }
            ],
            next: 'chapter_end'
        },
        {
            id: 'chapter_end',
            type: 'ending',
            background: 'memory_space',
            bgm: 'victory',
            lines: [
                { speaker: 'boss', text: '不可能...你竟然...', emotion: 'defeated' },
                { speaker: 'protagonist', text: '记忆的力量，来源于想要记住的意志。', emotion: 'determined' },
                { speaker: 'protagonist', text: '这就是为什么我能赢。', emotion: 'confident' },
                { speaker: 'narrator', text: '【第一章完成】', effect: 'chapter_clear' },
                { speaker: 'narrator', text: '获得奖励：SR卡牌「记忆守护者」' }
            ],
            reward: { card: 'SR003', gold: 500, expCards: 5 }
        }
    ]
};

// 剧情管理器
class StoryManager {
    constructor() {
        this.currentChapter = null;
        this.currentStageIndex = 0;
        this.dialogueIndex = 0;
        this.state = 'idle'; // idle, dialogue, battle, cutscene, ending
    }

    // 开始章节
    startChapter(chapterData) {
        this.currentChapter = chapterData;
        this.currentStageIndex = 0;
        this.dialogueIndex = 0;
        this.state = 'dialogue';
        return this.getCurrentStage();
    }

    // 获取当前场景
    getCurrentStage() {
        if (!this.currentChapter) return null;
        return this.currentChapter.stages[this.currentStageIndex];
    }

    // 推进剧情
    advance() {
        const stage = this.getCurrentStage();
        if (!stage) return { type: 'chapter_end' };

        switch (stage.type) {
            case 'dialogue':
                return this.advanceDialogue();
            case 'battle':
            case 'boss':
                return { type: 'start_battle', enemies: stage.enemies, boss: stage.type === 'boss' };
            case 'cutscene':
                return this.playCutscene();
            case 'ending':
                return this.playEnding();
            default:
                return this.nextStage();
        }
    }

    // 推进对话
    advanceDialogue() {
        const stage = this.getCurrentStage();
        if (this.dialogueIndex < stage.lines.length) {
            const line = stage.lines[this.dialogueIndex];
            this.dialogueIndex++;
            return { type: 'dialogue', data: line };
        } else {
            // 对话结束，进入下一阶段
            return this.nextStage();
        }
    }

    // 战斗结束
    onBattleEnd(victory) {
        if (victory) {
            return this.nextStage();
        } else {
            return { type: 'game_over' };
        }
    }

    // 进入下一阶段
    nextStage() {
        this.currentStageIndex++;
        this.dialogueIndex = 0;
        
        if (this.currentStageIndex >= this.currentChapter.stages.length) {
            return { type: 'chapter_complete', rewards: this.getChapterRewards() };
        }
        
        const nextStage = this.getCurrentStage();
        return { 
            type: 'stage_change', 
            stageType: nextStage.type,
            background: nextStage.background,
            bgm: nextStage.bgm
        };
    }

    // 播放过场动画
    playCutscene() {
        const stage = this.getCurrentStage();
        return { 
            type: 'cutscene', 
            lines: stage.lines,
            reward: stage.reward
        };
    }

    // 播放结局
    playEnding() {
        const stage = this.getCurrentStage();
        return {
            type: 'ending',
            lines: stage.lines,
            reward: stage.reward
        };
    }

    // 获取章节奖励
    getChapterRewards() {
        const lastStage = this.currentChapter.stages[this.currentChapter.stages.length - 1];
        return lastStage.reward || {};
    }

    // 加载章节数据
    loadChapter(chapterId) {
        if (chapterId === 'chapter1') {
            this.currentChapter = STORY_CHAPTER1;
        } else if (chapterId === 'chapter2') {
            this.currentChapter = STORY_CHAPTER2;
        } else if (chapterId === 'chapter3') {
            this.currentChapter = STORY_CHAPTER3;
        } else if (chapterId === 'chapter4') {
            this.currentChapter = STORY_CHAPTER4;
        }
    }

    // 保存进度
    saveProgress() {
        return {
            chapter: this.currentChapter?.id,
            stageIndex: this.currentStageIndex,
            dialogueIndex: this.dialogueIndex
        };
    }

    // 加载进度
    loadProgress(data) {
        this.loadChapter(data.chapter);
        this.currentStageIndex = data.stageIndex || 0;
        this.dialogueIndex = data.dialogueIndex || 0;
    }
}

// 剧情场景定义 - 第二章：悲伤沼泽
const STORY_CHAPTER2 = {
    id: 'chapter2',
    name: '第二章：悲伤沼泽',
    stages: [
        {
            id: 'swamp_entrance',
            type: 'dialogue',
            background: 'swamp_mist',
            bgm: 'sorrow_theme',
            lines: [
                { speaker: 'narrator', text: '离开梦境入口后，主角来到了一片被迷雾笼罩的沼泽。', effect: 'fade_in' },
                { speaker: 'narrator', text: '空气中弥漫着悲伤的气息，连呼吸都变得沉重。' },
                { speaker: 'protagonist', text: '这里是...悲伤沼泽？', emotion: 'concerned' },
                { speaker: 'protagonist', text: '委托人说这里有一段关于失去的记忆...', emotion: 'thoughtful' },
                { speaker: 'protagonist', text: '光是站在这里，就感到莫名的悲伤涌上心头。', emotion: 'sad' }
            ],
            next: 'first_encounter'
        },
        {
            id: 'first_encounter',
            type: 'battle',
            background: 'swamp_path',
            enemies: ['sorrow_slime', 'lost_soul'],
            lines: [
                { speaker: 'protagonist', text: '有什么东西从雾中出现了...', emotion: 'alert' },
                { speaker: 'protagonist', text: '这些怪物...是由悲伤具现化而成的？', emotion: 'surprised' }
            ],
            next: 'memory_fragment2'
        },
        {
            id: 'memory_fragment2',
            type: 'cutscene',
            background: 'memory_space',
            bgm: 'memory_reconstruction',
            lines: [
                { speaker: 'narrator', text: '【记忆碎片收集完成】', effect: 'memory_flash' },
                { speaker: 'narrator', text: '一段关于离别的记忆浮现...' },
                { speaker: 'memory_voice', text: '对不起...我必须离开...', emotion: 'sad' },
                { speaker: 'memory_voice', text: '不要忘了我...', emotion: 'crying' },
                { speaker: 'protagonist', text: '这是...恋人分别的场景？', emotion: 'surprised' },
                { speaker: 'protagonist', text: '委托人失去的...是爱人吗？', emotion: 'concerned' }
            ],
            reward: { memory: 'farewell_memory', gold: 150 },
            next: 'deeper_swamp'
        },
        {
            id: 'deeper_swamp',
            type: 'dialogue',
            background: 'swamp_deep',
            bgm: 'sorrow_theme',
            lines: [
                { speaker: 'protagonist', text: '雾气越来越浓了...', emotion: 'alert' },
                { speaker: 'protagonist', text: '悲伤的气息也越来越强烈。', emotion: 'concerned' },
                { speaker: 'narrator', text: '远处传来铠甲碰撞的声音...' },
                { speaker: 'protagonist', text: '有东西过来了，而且...很强大。', emotion: 'ready' }
            ],
            next: 'elite_battle'
        },
        {
            id: 'elite_battle',
            type: 'battle',
            background: 'swamp_deep',
            enemies: ['grief_knight', 'sorrow_slime'],
            lines: [
                { speaker: 'protagonist', text: '这是...哀伤骑士？', emotion: 'surprised' },
                { speaker: 'protagonist', text: '曾经守护某人的骑士，如今却被悲伤吞噬...', emotion: 'sad' },
                { speaker: 'protagonist', text: '让我来解放你吧。', emotion: 'determined' }
            ],
            next: 'queen_intro'
        },
        {
            id: 'queen_intro',
            type: 'dialogue',
            background: 'queen_throne',
            bgm: 'boss_theme_sorrow',
            lines: [
                { speaker: 'narrator', text: '沼泽的最深处，一座由泪水凝结的王座。' },
                { speaker: 'protagonist', text: '那就是...悲伤的源头？', emotion: 'alert' },
                { speaker: 'boss', text: '又一个闯入者...是来嘲笑我的悲伤吗？', emotion: 'sad', effect: 'boss_appear' },
                { speaker: 'protagonist', text: '不，我是来理解这份悲伤的。', emotion: 'calm' },
                { speaker: 'boss', text: '理解？你能理解失去一切的痛苦吗？', emotion: 'angry' },
                { speaker: 'boss', text: '我等了千年...等待那个永远不会回来的人...', emotion: 'crying' },
                { speaker: 'protagonist', text: '所以你把整个沼泽都变成了悲伤的囚笼？', emotion: 'concerned' },
                { speaker: 'boss', text: '闭嘴！你无法体会这种痛苦！', emotion: 'rage' },
                { speaker: 'protagonist', text: '那就让我用行动证明，悲伤可以被治愈。', emotion: 'determined' }
            ],
            next: 'queen_battle'
        },
        {
            id: 'queen_battle',
            type: 'boss',
            background: 'queen_throne',
            enemies: ['sorrow_queen'],
            bossHp: 3500,
            lines: [
                { speaker: 'boss', text: '感受千年的泪水吧！', emotion: 'rage', trigger: 'battle_start' }
            ],
            next: 'chapter2_end'
        },
        {
            id: 'chapter2_end',
            type: 'ending',
            background: 'memory_space',
            bgm: 'victory_sorrow',
            lines: [
                { speaker: 'boss', text: '为什么...为什么你能承受这种悲伤...', emotion: 'defeated' },
                { speaker: 'protagonist', text: '因为我也曾经失去过重要的人。', emotion: 'sad' },
                { speaker: 'protagonist', text: '但悲伤不该成为囚禁自己的牢笼。', emotion: 'determined' },
                { speaker: 'boss', text: '也许...你是对的...', emotion: 'calm' },
                { speaker: 'boss', text: '这千年的泪水...终于...可以停止了...', emotion: 'relieved' },
                { speaker: 'narrator', text: '悲伤女王化作点点光芒消散。', effect: 'fade_out' },
                { speaker: 'narrator', text: '【第二章完成】', effect: 'chapter_clear' },
                { speaker: 'narrator', text: '获得奖励：SR卡牌「哀伤骑士」' }
            ],
            reward: { card: 'SR008', gold: 800, expCards: 8 }
        }
    ]
};

// 剧情场景定义 - 第三章：记忆迷宫
const STORY_CHAPTER3 = {
    id: 'chapter3',
    name: '第三章：记忆迷宫',
    stages: [
        {
            id: 'maze_entrance',
            type: 'dialogue',
            background: 'maze_gate',
            bgm: 'mystery_theme',
            lines: [
                { speaker: 'narrator', text: '离开悲伤沼泽后，一座巨大的石制迷宫出现在眼前。', effect: 'fade_in' },
                { speaker: 'narrator', text: '迷宫的墙壁上刻满了古老的符文，散发着微弱的光芒。' },
                { speaker: 'protagonist', text: '这就是...记忆迷宫？', emotion: 'surprised' },
                { speaker: 'protagonist', text: '据说这里封存着人们最不愿面对的记忆...', emotion: 'thoughtful' },
                { speaker: 'narrator', text: '一阵冷风吹过，入口处传来低沉的回响。' },
                { speaker: 'protagonist', text: '看来，迷宫在欢迎我进去呢。', emotion: 'determined' }
            ],
            next: 'maze_first_room'
        },
        {
            id: 'maze_first_room',
            type: 'battle',
            background: 'maze_corridor',
            enemies: ['memory_guardian', 'nightmare_wisp'],
            lines: [
                { speaker: 'protagonist', text: '这些守卫...是活的石像？', emotion: 'alert' },
                { speaker: 'protagonist', text: '它们在守护着什么东西...', emotion: 'thoughtful' }
            ],
            next: 'maze_puzzle'
        },
        {
            id: 'maze_puzzle',
            type: 'dialogue',
            background: 'maze_crossroad',
            bgm: 'mystery_theme',
            lines: [
                { speaker: 'narrator', text: '击败守卫后，迷宫的墙壁开始移动...' },
                { speaker: 'protagonist', text: '迷宫在变化？这是...活的迷宫？', emotion: 'surprised' },
                { speaker: 'narrator', text: '三条道路出现在眼前。' },
                { speaker: 'protagonist', text: '左边...是恐惧的气息。', emotion: 'concerned' },
                { speaker: 'protagonist', text: '右边...是后悔的味道。', emotion: 'sad' },
                { speaker: 'protagonist', text: '中间...什么都没有，只有虚无。', emotion: 'confused' },
                { speaker: 'protagonist', text: '那就走中间吧。虚无，意味着无限可能。', emotion: 'determined' }
            ],
            next: 'maze_depths'
        },
        {
            id: 'maze_depths',
            type: 'battle',
            background: 'maze_depth',
            enemies: ['phantom', 'nightmare_wisp', 'phantom'],
            lines: [
                { speaker: 'protagonist', text: '这些幻影...它们在模仿我？', emotion: 'surprised' },
                { speaker: 'phantom_voice', text: '你...是...谁...', emotion: 'echo' },
                { speaker: 'protagonist', text: '它们在重复我的话...不，是在读取我的记忆！', emotion: 'alert' }
            ],
            next: 'memory_fragment3'
        },
        {
            id: 'memory_fragment3',
            type: 'cutscene',
            background: 'memory_space',
            bgm: 'memory_reconstruction',
            lines: [
                { speaker: 'narrator', text: '【记忆碎片收集完成】', effect: 'memory_flash' },
                { speaker: 'narrator', text: '一段关于选择的记忆浮现...' },
                { speaker: 'memory_voice', text: '如果当时...我做出了不同的选择...', emotion: 'regret' },
                { speaker: 'memory_voice', text: '一切会不会不一样...', emotion: 'sad' },
                { speaker: 'protagonist', text: '这是...关于后悔的记忆？', emotion: 'surprised' },
                { speaker: 'protagonist', text: '委托人一直在为某个选择而后悔吗...', emotion: 'thoughtful' }
            ],
            reward: { memory: 'regret_memory', gold: 200 },
            next: 'sentinel_encounter'
        },
        {
            id: 'sentinel_encounter',
            type: 'battle',
            background: 'maze_shrine',
            enemies: ['maze_sentinel'],
            lines: [
                { speaker: 'protagonist', text: '那是...更大的守卫？', emotion: 'alert' },
                { speaker: 'protagonist', text: '它在守护着迷宫的核心！', emotion: 'determined' }
            ],
            next: 'keeper_chamber'
        },
        {
            id: 'keeper_chamber',
            type: 'dialogue',
            background: 'maze_core',
            bgm: 'boss_theme_maze',
            lines: [
                { speaker: 'narrator', text: '迷宫的最深处，一座巨大的石像缓缓苏醒。' },
                { speaker: 'protagonist', text: '那就是...迷宫的核心？', emotion: 'alert' },
                { speaker: 'boss', text: '擅闯者...你将永远迷失在记忆的迷宫中...', emotion: 'cold', effect: 'boss_appear' },
                { speaker: 'protagonist', text: '你就是这座迷宫的守护者？', emotion: 'determined' },
                { speaker: 'boss', text: '我是记忆的守门人...任何试图逃避过去的人，都将被我封印...', emotion: 'ominous' },
                { speaker: 'protagonist', text: '我不是来逃避的。我是来面对记忆的。', emotion: 'determined' },
                { speaker: 'boss', text: '面对？可笑...记忆是痛苦的根源，逃避才是解脱！', emotion: 'rage' },
                { speaker: 'protagonist', text: '痛苦也是记忆的一部分。没有痛苦，快乐也失去了意义。', emotion: 'calm' },
                { speaker: 'boss', text: '那就让我看看...你是否真的有勇气面对一切！', emotion: 'rage' }
            ],
            next: 'keeper_battle'
        },
        {
            id: 'keeper_battle',
            type: 'boss',
            background: 'maze_core',
            enemies: ['maze_keeper'],
            bossHp: 4500,
            lines: [
                { speaker: 'boss', text: '感受迷宫的愤怒吧！', emotion: 'rage', trigger: 'battle_start' }
            ],
            next: 'chapter3_end'
        },
        {
            id: 'chapter3_end',
            type: 'ending',
            background: 'memory_space',
            bgm: 'victory_maze',
            lines: [
                { speaker: 'boss', text: '居然...突破了迷宫...', emotion: 'defeated' },
                { speaker: 'protagonist', text: '迷宫的出口，在于直面自己的记忆。', emotion: 'determined' },
                { speaker: 'protagonist', text: '无论痛苦还是快乐，都是构成「我」的一部分。', emotion: 'calm' },
                { speaker: 'boss', text: '也许...你是对的...', emotion: 'calm' },
                { speaker: 'boss', text: '千年来...你是第一个敢于面对记忆的人...', emotion: 'respectful' },
                { speaker: 'narrator', text: '迷宫守护者的石像缓缓崩塌，露出通往深处的道路。', effect: 'fade_out' },
                { speaker: 'narrator', text: '【第三章完成】', effect: 'chapter_clear' },
                { speaker: 'narrator', text: '获得奖励：SSR卡牌「迷宫守护者」' }
            ],
            reward: { card: 'SSR007', gold: 1000, expCards: 10 }
        }
    ]
};

// 剧情场景定义 - 第四章：愤怒火山
const STORY_CHAPTER4 = {
    id: 'chapter4',
    name: '第四章：愤怒火山',
    stages: [
        {
            id: 'volcano_base',
            type: 'dialogue',
            background: 'volcano_base',
            bgm: 'rage_theme',
            lines: [
                { speaker: 'narrator', text: '离开迷宫后，炽热的气息扑面而来。', effect: 'fade_in' },
                { speaker: 'narrator', text: '远处，一座巨大的火山正在喷发，天空被染成了血红色。' },
                { speaker: 'protagonist', text: '好热...这里简直像地狱一样...', emotion: 'concerned' },
                { speaker: 'protagonist', text: '委托人的记忆中...竟然隐藏着如此强烈的愤怒？', emotion: 'surprised' },
                { speaker: 'narrator', text: '地面开始震动，岩浆从裂缝中涌出。' },
                { speaker: 'protagonist', text: '看来这座火山不欢迎访客啊。', emotion: 'determined' }
            ],
            next: 'volcano_path'
        },
        {
            id: 'volcano_path',
            type: 'battle',
            background: 'volcano_slope',
            enemies: ['lava_beast', 'fire_elemental'],
            lines: [
                { speaker: 'protagonist', text: '这些怪物...是由岩浆构成的？', emotion: 'alert' },
                { speaker: 'protagonist', text: '愤怒让这里的记忆变得狂暴了！', emotion: 'concerned' }
            ],
            next: 'rage_memory'
        },
        {
            id: 'rage_memory',
            type: 'cutscene',
            background: 'memory_space',
            bgm: 'memory_reconstruction',
            lines: [
                { speaker: 'narrator', text: '【记忆碎片收集完成】', effect: 'memory_flash' },
                { speaker: 'narrator', text: '一段关于背叛的记忆浮现...' },
                { speaker: 'memory_voice', text: '为什么...为什么要背叛我！', emotion: 'rage' },
                { speaker: 'memory_voice', text: '我把一切都给了你...你却...', emotion: 'anger' },
                { speaker: 'protagonist', text: '这是...被背叛的愤怒？', emotion: 'surprised' },
                { speaker: 'protagonist', text: '委托人曾经遭受过严重的背叛...', emotion: 'thoughtful' }
            ],
            reward: { memory: 'betrayal_memory', gold: 250 },
            next: 'volcano_climb'
        },
        {
            id: 'volcano_climb',
            type: 'dialogue',
            background: 'volcano_cliff',
            bgm: 'rage_theme',
            lines: [
                { speaker: 'narrator', text: '越往上走，温度越高，空气都仿佛要燃烧起来。' },
                { speaker: 'protagonist', text: '这种愤怒...快要失控了...', emotion: 'struggling' },
                { speaker: 'protagonist', text: '如果不尽快平息，委托人的意识会被愤怒完全吞噬！', emotion: 'determined' },
                { speaker: 'narrator', text: '山顶传来震耳欲聋的咆哮声...' },
                { speaker: 'protagonist', text: '那就是愤怒的源头吗...', emotion: 'alert' }
            ],
            next: 'rage_warrior_encounter'
        },
        {
            id: 'rage_warrior_encounter',
            type: 'battle',
            background: 'volcano_path',
            enemies: ['rage_warrior', 'rage_warrior'],
            lines: [
                { speaker: 'protagonist', text: '这些战士...他们被愤怒完全控制了！', emotion: 'concerned' },
                { speaker: 'protagonist', text: '必须快点，否则来不及了！', emotion: 'determined' }
            ],
            next: 'magma_giant_battle'
        },
        {
            id: 'magma_giant_battle',
            type: 'battle',
            background: 'volcano_ridge',
            enemies: ['magma_giant'],
            lines: [
                { speaker: 'protagonist', text: '那是...熔岩巨人？', emotion: 'alert' },
                { speaker: 'protagonist', text: '它在守护着通往山顶的道路！', emotion: 'determined' }
            ],
            next: 'rage_throne'
        },
        {
            id: 'rage_throne',
            type: 'dialogue',
            background: 'volcano_peak',
            bgm: 'boss_theme_rage',
            lines: [
                { speaker: 'narrator', text: '火山顶峰，一个由熔岩构成的王座。' },
                { speaker: 'narrator', text: '王座上，一个燃烧的身影缓缓站起。' },
                { speaker: 'boss', text: '入侵者...你将化为灰烬！', emotion: 'rage', effect: 'boss_appear' },
                { speaker: 'protagonist', text: '你就是愤怒之王？', emotion: 'determined' },
                { speaker: 'boss', text: '愤怒！只有愤怒才是真实！', emotion: 'rage' },
                { speaker: 'boss', text: '信任只会带来背叛！感情只会带来痛苦！', emotion: 'rage' },
                { speaker: 'boss', text: '唯有愤怒，才能保护我免受伤害！', emotion: 'rage' },
                { speaker: 'protagonist', text: '愤怒确实能保护人...但也会让人失去更多。', emotion: 'calm' },
                { speaker: 'protagonist', text: '你被愤怒囚禁了，让我来解放你。', emotion: 'determined' },
                { speaker: 'boss', text: '可笑！先打倒我再说吧！', emotion: 'rage' }
            ],
            next: 'rage_king_battle'
        },
        {
            id: 'rage_king_battle',
            type: 'boss',
            background: 'volcano_peak',
            enemies: ['rage_king'],
            bossHp: 6000,
            lines: [
                { speaker: 'boss', text: '感受无尽的怒火吧！', emotion: 'rage', trigger: 'battle_start' }
            ],
            next: 'chapter4_end'
        },
        {
            id: 'chapter4_end',
            type: 'ending',
            background: 'memory_space',
            bgm: 'victory_rage',
            lines: [
                { speaker: 'boss', text: '我的愤怒...竟然...被平息了...', emotion: 'defeated' },
                { speaker: 'protagonist', text: '愤怒会蒙蔽双眼，让人看不见真相。', emotion: 'calm' },
                { speaker: 'protagonist', text: '只有放下愤怒，才能看清真正重要的东西。', emotion: 'determined' },
                { speaker: 'boss', text: '真正重要的...东西...', emotion: 'confused' },
                { speaker: 'protagonist', text: '是的。被背叛固然痛苦，但不能让愤怒毁掉自己的人生。', emotion: 'calm' },
                { speaker: 'boss', text: '也许...是时候...放下了...', emotion: 'relieved' },
                { speaker: 'narrator', text: '愤怒之王的火焰渐渐熄灭，火山也慢慢平静下来。', effect: 'fade_out' },
                { speaker: 'narrator', text: '【第四章完成】', effect: 'chapter_clear' },
                { speaker: 'narrator', text: '获得奖励：SSR卡牌「愤怒之王」' }
            ],
            reward: { card: 'SSR008', gold: 1200, expCards: 12 }
        }
    ]
};

// 对话UI控制器
class DialogueUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentSpeaker = null;
        this.currentText = '';
        this.typingSpeed = 50; // 打字速度(ms)
        this.typingTimer = null;
    }

    // 显示对话
    showDialogue(speaker, text, emotion) {
        this.clear();
        
        const speakerName = this.getSpeakerName(speaker);
        const speakerClass = speaker === 'protagonist' ? 'protagonist' : 
                            speaker === 'boss' ? 'boss' : 'narrator';
        
        this.container.innerHTML = `
            <div class="dialogue-box ${speakerClass}">
                <div class="dialogue-speaker">${speakerName}</div>
                <div class="dialogue-text"></div>
                <div class="dialogue-click-hint">点击继续 ▼</div>
            </div>
        `;
        
        this.typeText(text);
    }

    // 打字机效果
    typeText(text) {
        const textElement = this.container.querySelector('.dialogue-text');
        let index = 0;
        
        this.typingTimer = setInterval(() => {
            if (index < text.length) {
                textElement.textContent += text[index];
                index++;
            } else {
                clearInterval(this.typingTimer);
            }
        }, this.typingSpeed);
    }

    // 跳过打字
    skipTyping() {
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
            const textElement = this.container.querySelector('.dialogue-text');
            textElement.textContent = this.currentText;
        }
    }

    // 获取说话者名称
    getSpeakerName(speaker) {
        const names = {
            narrator: '旁白',
            protagonist: '主角',
            boss: '遗忘守护者',
            system: '系统'
        };
        return names[speaker] || speaker;
    }

    // 清除
    clear() {
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
        }
        this.container.innerHTML = '';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StoryManager, DialogueUI, STORY_CHAPTER1, STORY_CHAPTER2, STORY_CHAPTER3, STORY_CHAPTER4 };
}
