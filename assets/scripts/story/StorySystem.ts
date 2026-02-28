/**
 * 剧情/对话系统
 * 主线剧情、角色羁绊剧情
 */

export interface StoryChapter {
    id: string;
    title: string;
    description: string;
    order: number;
    
    // 解锁条件
    unlockCondition: {
        type: 'level' | 'chapter' | 'card' | 'affinity';
        value: number | string;
    };
    
    // 场景列表
    scenes: StoryScene[];
    
    // 奖励
    rewards: {
        gold?: number;
        soulCrystal?: number;
        cardId?: string;
    };
}

export interface StoryScene {
    id: string;
    background: string;
    
    // 对话列表
    dialogues: Dialogue[];
    
    // 选项分支（可选）
    choices?: {
        text: string;
        nextScene: string;
        effects?: any;
    }[];
}

export interface Dialogue {
    id: string;
    speaker: string;
    speakerImage: string;
    text: string;
    
    // 特效
    effects?: {
        screenShake?: boolean;
        sound?: string;
        animation?: string;
    };
}

export class StorySystem {
    private chapters: Map<string, StoryChapter> = new Map();
    private playerProgress: Map<string, {
        completedChapters: string[];
        currentScene: string;
        dialogueHistory: string[];
    }> = new Map();
    
    // 注册剧情章节
    public registerChapter(chapter: StoryChapter): void {
        this.chapters.set(chapter.id, chapter);
    }
    
    // 获取章节
    public getChapter(chapterId: string): StoryChapter | null {
        return this.chapters.get(chapterId) || null;
    }
    
    // 获取所有章节
    public getAllChapters(): StoryChapter[] {
        return Array.from(this.chapters.values())
            .sort((a, b) => a.order - b.order);
    }
    
    // 检查章节是否解锁
    public isChapterUnlocked(
        playerId: string,
        chapterId: string,
        playerLevel: number,
        completedChapters: string[]
    ): boolean {
        const chapter = this.chapters.get(chapterId);
        if (!chapter) return false;
        
        // 检查解锁条件
        switch (chapter.unlockCondition.type) {
            case 'level':
                return playerLevel >= (chapter.unlockCondition.value as number);
            case 'chapter':
                return completedChapters.includes(chapter.unlockCondition.value as string);
            default:
                return false;
        }
    }
    
    // 开始剧情
    public startChapter(playerId: string, chapterId: string): {
        success: boolean;
        scene?: StoryScene;
        error?: string;
    } {
        const chapter = this.chapters.get(chapterId);
        if (!chapter) return { success: false, error: '章节不存在' };
        
        if (!chapter.scenes.length) {
            return { success: false, error: '章节无内容' };
        }
        
        // 初始化玩家进度
        this.playerProgress.set(playerId, {
            completedChapters: [],
            currentScene: chapter.scenes[0].id,
            dialogueHistory: []
        });
        
        return {
            success: true,
            scene: chapter.scenes[0]
        };
    }
    
    // 获取当前场景
    public getCurrentScene(playerId: string): StoryScene | null {
        const progress = this.playerProgress.get(playerId);
        if (!progress) return null;
        
        // 找到当前章节和场景
        for (const chapter of this.chapters.values()) {
            const scene = chapter.scenes.find(s => s.id === progress.currentScene);
            if (scene) return scene;
        }
        
        return null;
    }
    
    // 推进对话
    public advanceDialogue(playerId: string, dialogueId: string): {
        hasMore: boolean;
        nextDialogue?: Dialogue;
        sceneEnd?: boolean;
    } {
        const progress = this.playerProgress.get(playerId);
        if (!progress) return { hasMore: false };
        
        progress.dialogueHistory.push(dialogueId);
        
        // 获取当前场景
        const scene = this.getCurrentScene(playerId);
        if (!scene) return { hasMore: false };
        
        // 查找下一个对话
        const currentIndex = scene.dialogues.findIndex(d => d.id === dialogueId);
        if (currentIndex < 0 || currentIndex >= scene.dialogues.length - 1) {
            return { hasMore: false, sceneEnd: true };
        }
        
        return {
            hasMore: true,
            nextDialogue: scene.dialogues[currentIndex + 1]
        };
    }
    
    // 完成章节
    public completeChapter(playerId: string, chapterId: string): {
        success: boolean;
        rewards?: any;
    } {
        const chapter = this.chapters.get(chapterId);
        if (!chapter) return { success: false };
        
        const progress = this.playerProgress.get(playerId);
        if (!progress) return { success: false };
        
        progress.completedChapters.push(chapterId);
        
        return {
            success: true,
            rewards: chapter.rewards
        };
    }
    
    // 创建示例剧情
    public createSampleStory(): void {
        const prologue: StoryChapter = {
            id: 'chapter_prologue',
            title: '序章：觉醒',
            description: '成为记忆回收者的开始',
            order: 0,
            unlockCondition: { type: 'level', value: 1 },
            scenes: [
                {
                    id: 'scene_1',
                    background: 'bg_ruins.bmp',
                    dialogues: [
                        { id: 'd1', speaker: '???', speakerImage: 'npc_unknown.bmp', text: '醒来吧，回收者。' },
                        { id: 'd2', speaker: '???', speakerImage: 'npc_guide.bmp', text: '世界已经改变，记忆不再消逝...而是凝结成实体。' },
                        { id: 'd3', speaker: '向导', speakerImage: 'npc_guide.bmp', text: '你的使命是收集这些记忆碎片，还原逝者的故事。' },
                        { id: 'd4', speaker: '主角', speakerImage: 'player_avatar.bmp', text: '我...明白了。我会完成这个使命。' }
                    ]
                }
            ],
            rewards: { gold: 1000, soulCrystal: 100 }
        };
        
        this.registerChapter(prologue);
        
        const chapter1: StoryChapter = {
            id: 'chapter_1',
            title: '第一章：遗忘之城',
            description: '探索被遗弃的城市，寻找第一块记忆碎片',
            order: 1,
            unlockCondition: { type: 'chapter', value: 'chapter_prologue' },
            scenes: [
                {
                    id: 'scene_1_1',
                    background: 'bg_city_ruins.bmp',
                    dialogues: [
                        { id: 'd1', speaker: '向导', speakerImage: 'npc_guide.bmp', text: '这里是遗忘之城，曾经是最繁华的都市。' },
                        { id: 'd2', speaker: '向导', speakerImage: 'npc_guide.bmp', text: '小心，废墟中有被记忆侵蚀的怪物。' }
                    ]
                }
            ],
            rewards: { gold: 5000, cardId: 'jin_yu' }
        };
        
        this.registerChapter(chapter1);
    }
}

// 单例
export const storySystem = new StorySystem();
