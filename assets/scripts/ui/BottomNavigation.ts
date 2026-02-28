/**
 * 底部导航栏组件
 * 5个主要入口按钮
 */

import { _decorator, Component, Node, EventTouch } from 'cc';
import { GameScene, sceneManager } from '../core/SceneManager';

const { ccclass, property } = _decorator;

@ccclass('BottomNavigation')
export class BottomNavigation extends Component {
    
    @property(Node)
    private characterBtn: Node | null = null;
    
    @property(Node)
    private cityBtn: Node | null = null;
    
    @property(Node)
    private adventureBtn: Node | null = null;
    
    @property(Node)
    private towerBtn: Node | null = null;
    
    @property(Node)
    private settingsBtn: Node | null = null;
    
    private buttons: Map<GameScene, Node> = new Map();
    private currentScene: GameScene = GameScene.CITY;
    
    onLoad() {
        this.setupButtons();
        this.registerEvents();
        
        sceneManager.on('sceneChange', (data: { to: GameScene }) => {
            this.updateActiveState(data.to);
        });
    }
    
    private setupButtons() {
        this.buttons.set(GameScene.CHARACTER, this.characterBtn!);
        this.buttons.set(GameScene.CITY, this.cityBtn!);
        this.buttons.set(GameScene.ADVENTURE, this.adventureBtn!);
        this.buttons.set(GameScene.TOWER, this.towerBtn!);
        this.buttons.set(GameScene.SETTINGS, this.settingsBtn!);
    }
    
    private registerEvents() {
        this.buttons.forEach((node, scene) => {
            node?.on(Node.EventType.TOUCH_END, () => {
                this.onSceneButtonClick(scene);
            }, this);
        });
    }
    
    private onSceneButtonClick(scene: GameScene) {
        if (scene === this.currentScene) return;
        
        // 播放点击音效
        // audioManager.playSFX('button_click');
        
        sceneManager.switchTo(scene);
    }
    
    private updateActiveState(scene: GameScene) {
        this.currentScene = scene;
        
        this.buttons.forEach((node, btnScene) => {
            if (node) {
                const isActive = btnScene === scene;
                // 高亮当前选中按钮
                // 可以通过改变颜色、缩放或显示选中状态来实现
                node.setScale(isActive ? 1.1 : 1.0);
            }
        });
    }
}
