/**
 * 探险场景 - 章节关卡选择
 */

import { _decorator, Component, Node, Prefab, instantiate, ScrollView, Label } from 'cc';
import { GameScene, sceneManager } from '../core/SceneManager';
import { 
    playerDataManager, 
    ChapterData, 
    LevelData, 
    LevelType 
} from '../data/PlayerData.ts';

const { ccclass, property } = _decorator;

@ccclass('AdventureScene')
export class AdventureScene extends Component {
    
    @property(ScrollView)
    private levelScrollView: ScrollView | null = null;
    
    @property(Prefab)
    private levelNodePrefab: Prefab | null = null;
    
    @property(Node)
    private chapterInfoNode: Node | null = null;
    
    @property(Label)
    private chapterNameLabel: Label | null = null;
    
    @property(Label)
    private chapterDescLabel: Label | null = null;
    
    @property(Label)
    private progressLabel: Label | null = null;
    
    private currentChapter: ChapterData | null = null;
    
    onEnable() {
        this.loadCurrentChapter();
    }
    
    private loadCurrentChapter() {
        const player = playerDataManager.getPlayerData();
        this.currentChapter = playerDataManager.getChapter(player.currentChapter);
        
        if (this.currentChapter) {
            this.updateChapterInfo();
            this.createLevelNodes();
        }
    }
    
    private updateChapterInfo() {
        if (!this.currentChapter) return;
        
        this.chapterNameLabel!.string = this.currentChapter.name;
        this.chapterDescLabel!.string = this.currentChapter.description;
        
        const completed = this.currentChapter.levels.filter(l => l.isCompleted).length;
        this.progressLabel!.string = `进度: ${completed}/${this.currentChapter.totalLevels}`;
    }
    
    private createLevelNodes() {
        if (!this.currentChapter || !this.levelScrollView) return;
        
        const content = this.levelScrollView.content;
        content?.removeAllChildren();
        
        // 创建关卡节点（每行显示5个）
        this.currentChapter.levels.forEach((level, index) => {
            const node = instantiate(this.levelNodePrefab!);
            this.setupLevelNode(node, level);
            content?.addChild(node);
        });
    }
    
    private setupLevelNode(node: Node, level: LevelData) {
        // 设置关卡显示
        const levelNumLabel = node.getChildByName('LevelNum')?.getComponent(Label);
        const nameLabel = node.getChildByName('Name')?.getComponent(Label);
        const lockIcon = node.getChildByName('Lock');
        const starContainer = node.getChildByName('Stars');
        const bossIcon = node.getChildByName('BossIcon');
        
        if (levelNumLabel) levelNumLabel.string = `${level.levelNumber}`;
        if (nameLabel) nameLabel.string = level.type === LevelType.NORMAL ? '' : level.name;
        
        // 显示Boss/精英图标
        if (bossIcon) {
            bossIcon.active = level.type === LevelType.BOSS || level.type === LevelType.CHAPTER_BOSS;
        }
        
        // 锁定状态
        if (lockIcon) {
            lockIcon.active = !level.isUnlocked;
        }
        
        // 星级显示
        if (starContainer) {
            for (let i = 0; i < 3; i++) {
                const star = starContainer.getChildByName(`Star${i}`);
                if (star) {
                    star.active = i < level.stars;
                }
            }
        }
        
        // 点击事件
        node.on(Node.EventType.TOUCH_END, () => {
            this.onLevelClick(level);
        }, this);
    }
    
    private onLevelClick(level: LevelData) {
        if (!level.isUnlocked) {
            // 显示未解锁提示
            // Toast.show('该关卡尚未解锁');
            return;
        }
        
        // 打开战斗准备界面
        this.openBattlePreparation(level);
    }
    
    private openBattlePreparation(level: LevelData) {
        // TODO: 打开战斗准备界面，选择上阵卡牌
        console.log(`准备进入关卡: ${level.name}`);
        
        // 临时：直接进入战斗
        this.enterBattle(level);
    }
    
    private enterBattle(level: LevelData) {
        // TODO: 切换到战斗场景
        // sceneManager.switchTo(GameScene.BATTLE, true);
        
        // 初始化战斗
        // battleManager.startLevel(level);
    }
    
    // 切换章节
    public onSwitchChapterClick() {
        // TODO: 打开章节选择界面
    }
    
    // 快速战斗（已通关关卡）
    public onQuickBattleClick() {
        // TODO: 扫荡功能
    }
}
