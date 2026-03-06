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
    module.exports = { StoryManager, DialogueUI, STORY_CHAPTER1, STORY_CHAPTER2 };
}
