/**
 * 新手引导系统
 * 引导新玩家了解游戏核心玩法
 */

export interface TutorialStep {
    id: string;
    order: number;
    type: 'dialog' | 'highlight' | 'action' | 'battle';
    content: {
        title?: string;
        text: string;
        speaker?: string;
        speakerImage?: string;
    };
    target?: string;  // 高亮目标UI元素
    requiredAction?: string;  // 需要的操作
    canSkip: boolean;
    reward?: {
        gold?: number;
        soulCrystal?: number;
        cards?: string[];
        items?: { itemId: string; count: number }[];
    };
}

export interface TutorialChapter {
    id: string;
    name: string;
    description: string;
    steps: TutorialStep[];
    unlockCondition?: {
        playerLevel?: number;
        completeChapter?: string;
    };
    completionReward: {
        gold: number;
        soulCrystal: number;
        specialCard?: string;
    };
}

// 新手引导章节配置
export const TUTORIAL_CHAPTERS: TutorialChapter[] = [
    {
        id: 'chapter_0',
        name: '初识记忆',
        description: '了解游戏的基本操作和世界观',
        completionReward: { gold: 5000, soulCrystal: 300 },
        steps: [
            {
                id: 'tutorial_001',
                order: 1,
                type: 'dialog',
                content: {
                    title: '欢迎',
                    text: '你好，回收者。我是你的向导。在这个世界，记忆不再消逝，而是凝结成实体。你的使命是收集这些记忆碎片，还原逝者的故事。',
                    speaker: '向导',
                    speakerImage: 'images/npc/guide.png'
                },
                canSkip: false
            },
            {
                id: 'tutorial_002',
                order: 2,
                type: 'highlight',
                content: {
                    text: '点击这里查看你的第一张记忆卡牌。'
                },
                target: 'ui/card_slot_1',
                requiredAction: 'click_card',
                canSkip: false
            },
            {
                id: 'tutorial_003',
                order: 3,
                type: 'dialog',
                content: {
                    text: '这是【烬羽】，一位守护村庄直到最后的武士。每张卡牌都有独特的技能和背景故事。点击卡牌查看详情。',
                    speaker: '向导'
                },
                canSkip: true
            },
            {
                id: 'tutorial_004',
                order: 4,
                type: 'highlight',
                content: {
                    text: '现在让我们开始第一场战斗。点击"探险"进入关卡选择。'
                },
                target: 'ui/bottom_nav/adventure',
                requiredAction: 'click_adventure',
                canSkip: false
            },
            {
                id: 'tutorial_005',
                order: 5,
                type: 'battle',
                content: {
                    text: '这是战斗界面。上方是敌人，下方是你的队伍。点击技能按钮释放技能。'
                },
                requiredAction: 'win_battle',
                canSkip: false,
                reward: {
                    gold: 1000,
                    cards: ['blacksmith_zhang']
                }
            },
            {
                id: 'tutorial_006',
                order: 6,
                type: 'dialog',
                content: {
                    text: '恭喜！你完成了第一场战斗。这是你的奖励。随着战斗进行，卡牌会获得经验并升级。',
                    speaker: '向导'
                },
                canSkip: true,
                reward: {
                    gold: 2000,
                    items: [{ itemId: 'memory_dust', count: 10 }]
                }
            },
            {
                id: 'tutorial_007',
                order: 7,
                type: 'highlight',
                content: {
                    text: '点击"角色"查看并强化你的卡牌。'
                },
                target: 'ui/bottom_nav/character',
                requiredAction: 'click_character',
                canSkip: false
            },
            {
                id: 'tutorial_008',
                order: 8,
                type: 'dialog',
                content: {
                    text: '在这里你可以升级卡牌、提升技能、装备道具。养成强大的队伍是通关的关键。',
                    speaker: '向导'
                },
                canSkip: true
            }
        ]
    },
    {
        id: 'chapter_1',
        name: '深入探索',
        description: '学习抽卡和装备系统',
        completionReward: { gold: 10000, soulCrystal: 500 },
        unlockCondition: { completeChapter: 'chapter_0' },
        steps: [
            {
                id: 'tutorial_101',
                order: 1,
                type: 'highlight',
                content: {
                    text: '点击主城中的酒馆，进行第一次召唤。'
                },
                target: 'ui/city/tavern',
                requiredAction: 'open_gacha',
                canSkip: false
            },
            {
                id: 'tutorial_102',
                order: 2,
                type: 'dialog',
                content: {
                    text: '召唤可以获得新的记忆卡牌。每天有一次免费召唤机会。累计召唤30次必得史诗级以上卡牌。',
                    speaker: '向导'
                },
                canSkip: true,
                reward: {
                    soulCrystal: 300
                }
            },
            {
                id: 'tutorial_103',
                order: 3,
                type: 'highlight',
                content: {
                    text: '点击铁匠铺，为卡牌装备武器和防具。'
                },
                target: 'ui/city/forge',
                requiredAction: 'open_forge',
                canSkip: false
            },
            {
                id: 'tutorial_104',
                order: 4,
                type: 'dialog',
                content: {
                    text: '装备可以大幅提升卡牌属性。收集同一套装的装备还能激活额外的套装效果。',
                    speaker: '向导'
                },
                canSkip: true,
                reward: {
                    items: [
                        { itemId: 'eq_weapon_common', count: 1 },
                        { itemId: 'eq_armor_common', count: 1 }
                    ]
                }
            }
        ]
    },
    {
        id: 'chapter_2',
        name: '挑战极限',
        description: '了解爬塔和试炼玩法',
        completionReward: { gold: 15000, soulCrystal: 800, specialCard: 'qing_yi' },
        unlockCondition: { playerLevel: 10, completeChapter: 'chapter_1' },
        steps: [
            {
                id: 'tutorial_201',
                order: 1,
                type: 'dialog',
                content: {
                    text: '当你感到实力足够时，可以尝试挑战爬塔。每一层都比上一层更难，但奖励也更丰厚。',
                    speaker: '向导'
                },
                canSkip: true
            },
            {
                id: 'tutorial_202',
                order: 2,
                type: 'highlight',
                content: {
                    text: '点击爬塔按钮，挑战第一层。'
                },
                target: 'ui/bottom_nav/tower',
                requiredAction: 'click_tower',
                canSkip: false
            },
            {
                id: 'tutorial_203',
                order: 3,
                type: 'dialog',
                content: {
                    text: '无尽试炼是更高难度的挑战，有限制条件，但奖励极其丰厚。建议有一定实力后再尝试。',
                    speaker: '向导'
                },
                canSkip: true
            }
        ]
    }
];

export class TutorialSystem {
    private completedSteps: Set<string> = new Set();
    private completedChapters: Set<string> = new Set();
    private currentStep: string | null = null;
    private isInTutorial: boolean = false;
    
    // 检查是否应该显示新手引导
    public shouldShowTutorial(playerLevel: number, isNewPlayer: boolean): boolean {
        if (!isNewPlayer) return false;
        
        // 检查是否有未完成的引导章节
        for (const chapter of TUTORIAL_CHAPTERS) {
            if (this.isChapterUnlocked(chapter, playerLevel) && 
                !this.completedChapters.has(chapter.id)) {
                return true;
            }
        }
        return false;
    }
    
    // 检查章节是否解锁
    private isChapterUnlocked(chapter: TutorialChapter, playerLevel: number): boolean {
        if (!chapter.unlockCondition) return true;
        
        if (chapter.unlockCondition.playerLevel && 
            playerLevel < chapter.unlockCondition.playerLevel) {
            return false;
        }
        
        if (chapter.unlockCondition.completeChapter && 
            !this.completedChapters.has(chapter.unlockCondition.completeChapter)) {
            return false;
        }
        
        return true;
    }
    
    // 开始引导章节
    public startChapter(chapterId: string): TutorialChapter | null {
        const chapter = TUTORIAL_CHAPTERS.find(c => c.id === chapterId);
        if (!chapter) return null;
        
        this.isInTutorial = true;
        this.currentStep = chapter.steps[0]?.id || null;
        
        return chapter;
    }
    
    // 获取当前步骤
    public getCurrentStep(): TutorialStep | null {
        if (!this.currentStep) return null;
        
        for (const chapter of TUTORIAL_CHAPTERS) {
            const step = chapter.steps.find(s => s.id === this.currentStep);
            if (step) return step;
        }
        return null;
    }
    
    // 完成当前步骤
    public completeStep(stepId: string): { 
        success: boolean; 
        nextStep?: TutorialStep; 
        chapterComplete?: boolean;
        reward?: any;
    } {
        const step = this.getCurrentStep();
        if (!step || step.id !== stepId) {
            return { success: false };
        }
        
        this.completedSteps.add(stepId);
        
        // 找到当前章节和下一步
        let currentChapter: TutorialChapter | null = null;
        let nextStep: TutorialStep | null = null;
        
        for (const chapter of TUTORIAL_CHAPTERS) {
            const stepIndex = chapter.steps.findIndex(s => s.id === stepId);
            if (stepIndex !== -1) {
                currentChapter = chapter;
                nextStep = chapter.steps[stepIndex + 1] || null;
                break;
            }
        }
        
        if (!currentChapter) return { success: false };
        
        // 检查章节是否完成
        const chapterComplete = currentChapter.steps.every(s => 
            this.completedSteps.has(s.id)
        );
        
        if (chapterComplete) {
            this.completedChapters.add(currentChapter.id);
            this.isInTutorial = false;
            this.currentStep = null;
            
            return {
                success: true,
                chapterComplete: true,
                reward: currentChapter.completionReward
            };
        } else if (nextStep) {
            this.currentStep = nextStep.id;
            return {
                success: true,
                nextStep
            };
        }
        
        return { success: true };
    }
    
    // 跳过当前引导
    public skipTutorial(): void {
        this.isInTutorial = false;
        this.currentStep = null;
        // 标记当前章节为已完成但不给奖励
        const currentStep = this.getCurrentStep();
        if (currentStep) {
            for (const chapter of TUTORIAL_CHAPTERS) {
                if (chapter.steps.some(s => s.id === currentStep.id)) {
                    this.completedChapters.add(chapter.id);
                    break;
                }
            }
        }
    }
    
    // 检查引导是否进行中
    public isTutorialActive(): boolean {
        return this.isInTutorial;
    }
    
    // 获取已完成的章节
    public getCompletedChapters(): string[] {
        return Array.from(this.completedChapters);
    }
    
    // 重置引导（用于测试）
    public resetTutorial(): void {
        this.completedSteps.clear();
        this.completedChapters.clear();
        this.currentStep = null;
        this.isInTutorial = false;
    }
}

// 单例
export const tutorialSystem = new TutorialSystem();
