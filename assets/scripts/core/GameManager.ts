/**
 * 游戏主控制器
 * 初始化所有系统，处理游戏生命周期
 */

import { _decorator, Component, Node, director, game } from 'cc';
import { playerDataManager } from '../data/PlayerData.ts';
import { saveManager, GameSaveData } from '../save/SaveManager';
import { audioManager, BGMType } from '../audio/AudioManager';
import { sceneManager, GameScene } from './SceneManager';
import { gachaSystem } from '../gacha/GachaSystem';
import { shopSystem } from '../shop/ShopSystem';
import { inventorySystem } from '../inventory/InventorySystem';
import { taskSystem } from '../task/TaskSystem';

const { ccclass, property } = _decorator;

@ccclass('cc.GameManager')
export class GameManager extends Component {
    
    // 场景根节点
    @property(Node)
    private sceneRoot: Node | null = null;
    
    @property(Node)
    private characterSceneNode: Node | null = null;
    
    @property(Node)
    private citySceneNode: Node | null = null;
    
    @property(Node)
    private adventureSceneNode: Node | null = null;
    
    @property(Node)
    private towerSceneNode: Node | null = null;
    
    @property(Node)
    private settingsSceneNode: Node | null = null;
    
    @property(Node)
    private battleSceneNode: Node | null = null;
    
    // 底部导航栏
    @property(Node)
    private bottomNav: Node | null = null;
    
    // 加载界面
    @property(Node)
    private loadingScreen: Node | null = null;
    
    // 单例
    private static _instance: GameManager | null = null;
    public static get instance(): GameManager {
        return GameManager._instance!;
    }
    
    onLoad() {
        // 确保单例
        if (GameManager._instance) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
        
        // 设置为常驻节点
        director.addPersistRootNode(this.node);
        
        // 初始化游戏
        this.initialize();
    }
    
    private async initialize() {
        this.showLoading(true);
        
        try {
            // 1. 预加载资源
            await this.preloadResources();
            
            // 2. 加载存档
            await this.loadGameData();
            
            // 3. 初始化音频
            this.initializeAudio();
            
            // 4. 注册场景切换事件
            this.registerSceneEvents();
            
            // 5. 检查每日/每周重置
            this.checkDailyReset();
            
            // 6. 启动自动保存
            this.startAutoSave();
            
            // 7. 进入主城
            this.switchToScene(GameScene.CITY);
            
            console.log('Game initialized successfully');
            
        } catch (error) {
            console.error('Game initialization failed:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    private async preloadResources(): Promise<void> {
        return new Promise((resolve) => {
            // 预加载音频
            audioManager.preloadAudio(() => {
                console.log('Resources preloaded');
                resolve();
            });
        });
    }
    
    private async loadGameData(): Promise<void> {
        const saveData = saveManager.load();
        
        if (saveData) {
            // 恢复玩家数据
            Object.assign(playerDataManager.getPlayerData(), saveData.playerData);
            
            // 恢复其他数据...
            console.log('Game data loaded from save');
        } else {
            // 新游戏，初始化默认数据
            this.initializeNewGame();
            console.log('New game initialized');
        }
    }
    
    private initializeNewGame() {
        const player = playerDataManager.getPlayerData();
        
        // 给予新手资源
        player.gold = 100000;
        player.soulCrystal = 3000;
        
        // TODO: 给予初始卡牌
        // playerDataManager.addCard('jin_yu');
        // playerDataManager.addCard('blacksmith_zhang');
        
        // 标记新手引导
        // player.isNewPlayer = true;
    }
    
    private initializeAudio() {
        const settings = playerDataManager.getPlayerData().settings;
        audioManager.setBGMVolume(settings.bgmVolume);
        audioManager.setSFXVolume(settings.sfxVolume);
    }
    
    private registerSceneEvents() {
        // 注册场景切换监听
        sceneManager.on('sceneChange', (data: { from: GameScene; to: GameScene }) => {
            this.onSceneChange(data.to);
        });
    }
    
    private onSceneChange(scene: GameScene) {
        // 隐藏所有场景
        this.characterSceneNode!.active = false;
        this.citySceneNode!.active = false;
        this.adventureSceneNode!.active = false;
        this.towerSceneNode!.active = false;
        this.settingsSceneNode!.active = false;
        this.battleSceneNode!.active = false;
        
        // 显示目标场景
        switch (scene) {
            case GameScene.CHARACTER:
                this.characterSceneNode!.active = true;
                break;
            case GameScene.CITY:
                this.citySceneNode!.active = true;
                audioManager.playBGM(BGMType.CITY);
                break;
            case GameScene.ADVENTURE:
                this.adventureSceneNode!.active = true;
                break;
            case GameScene.TOWER:
                this.towerSceneNode!.active = true;
                audioManager.playBGM(BGMType.TOWER);
                break;
            case GameScene.SETTINGS:
                this.settingsSceneNode!.active = true;
                break;
        }
        
        // 更新底部导航
        this.bottomNav!.active = scene !== GameScene.CHARACTER; // 角色界面不需要底部导航
    }
    
    public switchToScene(scene: GameScene) {
        sceneManager.switchTo(scene);
    }
    
    private checkDailyReset() {
        const now = Date.now();
        const dailyResetTime = taskSystem.getNextResetTime('daily');
        const weeklyResetTime = taskSystem.getNextResetTime('weekly');
        
        if (now >= dailyResetTime) {
            taskSystem.resetDailyTasks();
            shopSystem.resetLimit('daily');
            console.log('Daily reset performed');
        }
        
        if (now >= weeklyResetTime) {
            taskSystem.resetWeeklyTasks();
            shopSystem.resetLimit('weekly');
            console.log('Weekly reset performed');
        }
    }
    
    private startAutoSave() {
        saveManager.startAutoSave(() => {
            this.saveGame();
        });
    }
    
    public saveGame(): boolean {
        const player = playerDataManager.getPlayerData();
        const inventory = inventorySystem.getItemsByType('material' as any);
        
        return saveManager.save(player, player.ownedCards, inventory);
    }
    
    private showLoading(show: boolean) {
        if (this.loadingScreen) {
            this.loadingScreen.active = show;
        }
    }
    
    // ============ 公共接口 ============
    
    // 进入战斗
    public enterBattle(levelData: any, playerTeam: any[]) {
        // 切换到战斗场景
        this.battleSceneNode!.active = true;
        
        // 调用战斗场景初始化
        // const battleScene = this.battleSceneNode!.getComponent(BattleScene);
        // battleScene.startLevel(levelData, playerTeam);
        
        audioManager.playBGM(BGMType.BATTLE);
    }
    
    // 退出战斗
    public exitBattle() {
        this.battleSceneNode!.active = false;
        this.onSceneChange(sceneManager.getCurrentScene());
    }
    
    // 获取当前游戏状态
    public getGameState() {
        return {
            player: playerDataManager.getPlayerData(),
            currentScene: sceneManager.getCurrentScene()
        };
    }
    
    // 游戏暂停/恢复
    public pauseGame() {
        director.pause();
        audioManager.stopBGM(true);
    }
    
    public resumeGame() {
        director.resume();
        // 恢复BGM
        const currentScene = sceneManager.getCurrentScene();
        if (currentScene === GameScene.CITY) {
            audioManager.playBGM(BGMType.CITY);
        } else if (currentScene === GameScene.TOWER) {
            audioManager.playBGM(BGMType.TOWER);
        }
    }
    
    // 退出游戏
    public quitGame() {
        this.saveGame();
        saveManager.stopAutoSave();
        game.end();
    }
    
    onDestroy() {
        if (GameManager._instance === this) {
            this.saveGame();
            saveManager.stopAutoSave();
            GameManager._instance = null;
        }
    }
}
