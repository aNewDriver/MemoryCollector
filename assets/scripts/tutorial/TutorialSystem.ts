/**
 * 新手教程系统
 * 引导玩家学习游戏
 */

export enum TutorialType {
    BATTLE = 'battle',           // 战斗教程
    CARD = 'card',               // 卡牌系统
    GACHA = 'gacha',             // 抽卡
    EQUIPMENT = 'equipment',     // 装备
    GUILD = 'guild',             // 公会
    TOWER = 'tower',             // 爬塔
    SHOP = 'shop'                // 商店
}

export interface TutorialStep {
    id: string;
    order: number;
    
    // 显示内容
    title: string;
    description: string;
    highlightTarget?: string;  // 高亮UI元素ID
    
    // 触发条件
    trigger: {
        type: 'auto' | 'click' | 'action';
        target?: string;
    };
    
    // 奖励
    reward?: {
        gold?: number;
        soulCrystal?: number;
        items?: { itemId: string; count: number }[];
    };
}

export interface Tutorial {
    id: string;
    type: TutorialType;
    name: string;
    description: string;
    steps: TutorialStep[];
    
    // 解锁条件
    unlockCondition?: {
        level?: number;
        completedTutorial?: string;
    };
    
    // 是否强制
    isMandatory: boolean;
    
    // 完成后是否显示
    showAfterComplete: boolean;
}

export class TutorialSystem {
    private tutorials: Map<string, Tutorial> = new Map();
    private playerProgress: Map<string, {
        completedTutorials: string[];
        currentTutorial: string | null;
        currentStep: number;
        skippedTutorials: string[];
    }> = new Map();
    
    constructor() {
        this.initializeTutorials();
    }
    
    private initializeTutorials(): void {
        // 战斗基础教程
        const battleTutorial: Tutorial = {
            id: 'tutorial_battle_basic',
            type: TutorialType.BATTLE,
            name: '战斗基础',
            description: '学习战斗的基本操作',
            isMandatory: true,
            showAfterComplete: false,
            steps: [
                {
                    id: 'step_1',
                    order: 1,
                    title: '回合制战斗',
                    description: '战斗采用回合制，双方轮流行动。',
                    trigger: { type: 'auto' }
                },
                {
                    id: 'step_2',
                    order: 2,
                    title: '选择技能',
                    description: '点击技能图标选择要使用的技能。',
                    highlightTarget: 'skill_panel',
                    trigger: { type: 'click', target: 'skill_button' }
                },
                {
                    id: 'step_3',
                    order: 3,
                    title: '选择目标',
                    description: '选择技能后，点击敌方目标进行攻击。',
                    highlightTarget: 'enemy_area',
                    trigger: { type: 'click', target: 'enemy_card' }
                },
                {
                    id: 'step_4',
                    order: 4,
                    title: '元素克制',
                    description: '注意元素克制关系，克制可以造成额外30%伤害！',
                    highlightTarget: 'element_indicator',
                    trigger: { type: 'auto' },
                    reward: { gold: 1000, soulCrystal: 100 }
                }
            ]
        };
        
        // 卡牌养成教程
        const cardTutorial: Tutorial = {
            id: 'tutorial_card_upgrade',
            type: TutorialType.CARD,
            name: '卡牌养成',
            description: '学习如何强化你的卡牌',
            isMandatory: false,
            showAfterComplete: true,
            unlockCondition: { completedTutorial: 'tutorial_battle_basic' },
            steps: [
                {
                    id: 'step_1',
                    order: 1,
                    title: '升级卡牌',
                    description: '消耗记忆尘埃可以提升卡牌等级。',
                    highlightTarget: 'upgrade_button',
                    trigger: { type: 'click' }
                },
                {
                    id: 'step_2',
                    order: 2,
                    title: '突破极限',
                    description: '等级达到上限后，需要突破才能继续成长。',
                    highlightTarget: 'ascension_button',
                    trigger: { type: 'click' },
                    reward: { gold: 2000 }
                }
            ]
        };
        
        // 抽卡教程
        const gachaTutorial: Tutorial = {
            id: 'tutorial_gacha',
            type: TutorialType.GACHA,
            name: '记忆召唤',
            description: '学习如何召唤新卡牌',
            isMandatory: false,
            showAfterComplete: true,
            unlockCondition: { level: 3 },
            steps: [
                {
                    id: 'step_1',
                    order: 1,
                    title: '前往召唤',
                    description: '在主城点击召唤建筑进入召唤界面。',
                    highlightTarget: 'gacha_building',
                    trigger: { type: 'click' }
                },
                {
                    id: 'step_2',
                    order: 2,
                    title: '单次召唤',
                    description: '消耗1张召唤券或280魂晶进行单次召唤。',
                    highlightTarget: 'summon_single',
                    trigger: { type: 'click' }
                },
                {
                    id: 'step_3',
                    order: 3,
                    title: '十连召唤',
                    description: '十连召唤必出SR以上卡牌！',
                    highlightTarget: 'summon_ten',
                    trigger: { type: 'click' },
                    reward: { items: [{ itemId: 'gacha_ticket', count: 3 }] }
                }
            ]
        };
        
        this.tutorials.set(battleTutorial.id, battleTutorial);
        this.tutorials.set(cardTutorial.id, cardTutorial);
        this.tutorials.set(gachaTutorial.id, gachaTutorial);
    }
    
    // 获取教程
    public getTutorial(tutorialId: string): Tutorial | null {
        return this.tutorials.get(tutorialId) || null;
    }
    
    // 获取所有教程
    public getAllTutorials(): Tutorial[] {
        return Array.from(this.tutorials.values());
    }
    
    // 检查教程是否解锁
    public isTutorialUnlocked(
        playerId: string,
        tutorialId: string,
        playerLevel: number
    ): boolean {
        const tutorial = this.tutorials.get(tutorialId);
        if (!tutorial) return false;
        if (!tutorial.unlockCondition) return true;
        
        const progress = this.getPlayerProgress(playerId);
        
        if (tutorial.unlockCondition.level && playerLevel < tutorial.unlockCondition.level) {
            return false;
        }
        
        if (tutorial.unlockCondition.completedTutorial &&
            !progress.completedTutorials.includes(tutorial.unlockCondition.completedTutorial)) {
            return false;
        }
        
        return true;
    }
    
    // 开始教程
    public startTutorial(playerId: string, tutorialId: string): {
        success: boolean;
        step?: TutorialStep;
        error?: string;
    } {
        const tutorial = this.tutorials.get(tutorialId);
        if (!tutorial) return { success: false, error: '教程不存在' };
        
        const progress = this.getPlayerProgress(playerId);
        
        if (progress.completedTutorials.includes(tutorialId)) {
            return { success: false, error: '教程已完成' };
        }
        
        progress.currentTutorial = tutorialId;
        progress.currentStep = 0;
        
        return {
            success: true,
            step: tutorial.steps[0]
        };
    }
    
    // 推进到下一步
    public nextStep(playerId: string): {
        hasMore: boolean;
        step?: TutorialStep;
        reward?: any;
    } {
        const progress = this.getPlayerProgress(playerId);
        if (!progress.currentTutorial) return { hasMore: false };
        
        const tutorial = this.tutorials.get(progress.currentTutorial)!;
        
        progress.currentStep++;
        
        if (progress.currentStep >= tutorial.steps.length) {
            // 教程完成
            this.completeTutorial(playerId, progress.currentTutorial);
            return { hasMore: false };
        }
        
        return {
            hasMore: true,
            step: tutorial.steps[progress.currentStep]
        };
    }
    
    // 完成教程
    private completeTutorial(playerId: string, tutorialId: string): void {
        const progress = this.getPlayerProgress(playerId);
        progress.completedTutorials.push(tutorialId);
        progress.currentTutorial = null;
        progress.currentStep = 0;
        
        const tutorial = this.tutorials.get(tutorialId);
        if (tutorial) {
            console.log(`教程完成: ${tutorial.name}`);
        }
    }
    
    // 跳过教程
    public skipTutorial(playerId: string, tutorialId: string): void {
        const progress = this.getPlayerProgress(playerId);
        progress.skippedTutorials.push(tutorialId);
        
        if (progress.currentTutorial === tutorialId) {
            progress.currentTutorial = null;
            progress.currentStep = 0;
        }
    }
    
    // 获取玩家进度
    private getPlayerProgress(playerId: string) {
        if (!this.playerProgress.has(playerId)) {
            this.playerProgress.set(playerId, {
                completedTutorials: [],
                currentTutorial: null,
                currentStep: 0,
                skippedTutorials: []
            });
        }
        return this.playerProgress.get(playerId)!;
    }
    
    // 获取玩家已完成的教程
    public getCompletedTutorials(playerId: string): Tutorial[] {
        const progress = this.getPlayerProgress(playerId);
        return progress.completedTutorials
            .map(id => this.tutorials.get(id))
            .filter((t): t is Tutorial => t !== undefined);
    }
}

// 单例
export const tutorialSystem = new TutorialSystem();
