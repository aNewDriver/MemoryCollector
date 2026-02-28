/**
 * 场景管理器
 * 处理5个主要场景之间的切换
 */

export enum GameScene {
    CHARACTER = 'character',    // 角色界面
    CITY = 'city',              // 主城
    ADVENTURE = 'adventure',    // 探险（章节关卡）
    TOWER = 'tower',            // 爬塔
    SETTINGS = 'settings'       // 设置
}

export class SceneManager {
    private currentScene: GameScene = GameScene.CITY;
    private sceneStack: GameScene[] = [];
    private listeners: Map<string, Function[]> = new Map();
    
    // 切换场景
    public switchTo(scene: GameScene, pushStack: boolean = false): void {
        if (pushStack) {
            this.sceneStack.push(this.currentScene);
        } else {
            this.sceneStack = [];
        }
        
        const prevScene = this.currentScene;
        this.currentScene = scene;
        
        this.emit('sceneChange', {
            from: prevScene,
            to: scene,
            canGoBack: this.sceneStack.length > 0
        });
    }
    
    // 返回上一场景
    public goBack(): boolean {
        if (this.sceneStack.length === 0) return false;
        
        const prevScene = this.sceneStack.pop()!;
        this.currentScene = prevScene;
        
        this.emit('sceneChange', {
            from: null,
            to: prevScene,
            canGoBack: this.sceneStack.length > 0
        });
        return true;
    }
    
    public getCurrentScene(): GameScene {
        return this.currentScene;
    }
    
    public on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }
    
    private emit(event: string, data: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }
}

// 单例
export const sceneManager = new SceneManager();
