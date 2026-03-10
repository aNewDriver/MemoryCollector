/**
 * 场景配置系统
 * 背景场景对应的美术资源和代码
 */

export interface SceneConfig {
    id: string;
    name: string;
    backgroundImage: string;
    bgm: string;
    ambientEffect?: string;
    lighting: 'normal' | 'dark' | 'bright' | 'mysterious';
}

/**
 * 第一章场景（记忆迷宫）
 */
export const CHAPTER_1_SCENES: SceneConfig[] = [
    { id: 'library_entrance', name: '图书馆入口', backgroundImage: 'scenes/ch1/library_entrance.png', bgm: 'bgm_ch1_calm', lighting: 'normal' },
    { id: 'dim_corridor', name: '昏暗走廊', backgroundImage: 'scenes/ch1/dim_corridor.png', bgm: 'bgm_ch1_mysterious', lighting: 'dark' },
    { id: 'bookshelf_maze', name: '书架迷宫', backgroundImage: 'scenes/ch1/bookshelf_maze.png', bgm: 'bgm_ch1_exploration', lighting: 'normal' },
    { id: 'dusty_corner', name: '遗忘角落', backgroundImage: 'scenes/ch1/dusty_corner.png', bgm: 'bgm_ch1_melancholy', lighting: 'dark' },
    { id: 'ink_pool', name: '墨水池', backgroundImage: 'scenes/ch1/ink_pool.png', bgm: 'bgm_ch1_tension', ambientEffect: 'ink_ripple', lighting: 'mysterious' },
    { id: 'echo_hallway', name: '回声长廊', backgroundImage: 'scenes/ch1/echo_hallway.png', bgm: 'bgm_ch1_echo', ambientEffect: 'sound_wave', lighting: 'dark' },
    { id: 'mirror_chamber', name: '镜片室', backgroundImage: 'scenes/ch1/mirror_chamber.png', bgm: 'bgm_ch1_mystery', ambientEffect: 'mirror_shine', lighting: 'mysterious' },
    { id: 'whisper_room', name: '低语室', backgroundImage: 'scenes/ch1/whisper_room.png', bgm: 'bgm_ch1_whisper', ambientEffect: 'whisper_particle', lighting: 'dark' },
    { id: 'floating_pages', name: '漂浮书页', backgroundImage: 'scenes/ch1/floating_pages.png', bgm: 'bgm_ch1_magical', ambientEffect: 'floating_paper', lighting: 'bright' },
    { id: 'guardian_gate', name: '守门人关卡', backgroundImage: 'scenes/ch1/guardian_gate.png', bgm: 'bgm_ch1_boss', lighting: 'mysterious' },
    // 更多场景...
    { id: 'labyrinth_master_throne', name: '迷宫之主王座', backgroundImage: 'scenes/ch1/boss_throne.png', bgm: 'bgm_ch1_final_boss', ambientEffect: 'boss_aura', lighting: 'mysterious' }
];

/**
 * 第2-10章场景配置
 */
export const ALL_SCENES: { [chapter: number]: SceneConfig[] } = {
    1: CHAPTER_1_SCENES,
    2: [ // 遗忘之境
        { id: 'foggy_wilderness', name: '迷雾荒野', backgroundImage: 'scenes/ch2/foggy_wilderness.png', bgm: 'bgm_ch2_fog', lighting: 'dark' },
        { id: 'forgotten_village', name: '遗忘村庄', backgroundImage: 'scenes/ch2/forgotten_village.png', bgm: 'bgm_ch2_sad', lighting: 'dark' },
        { id: 'memory_graveyard', name: '记忆墓地', backgroundImage: 'scenes/ch2/memory_graveyard.png', bgm: 'bgm_ch2_ghost', lighting: 'dark' },
        // ... 更多场景
    ],
    3: [ // 深海回忆
        { id: 'underwater_ruins', name: '水下遗迹', backgroundImage: 'scenes/ch3/underwater_ruins.png', bgm: 'bgm_ch3_underwater', ambientEffect: 'bubble', lighting: 'mysterious' },
        { id: 'coral_maze', name: '珊瑚迷宫', backgroundImage: 'scenes/ch3/coral_maze.png', bgm: 'bgm_ch3_calm', ambientEffect: 'bubble', lighting: 'normal' },
        // ... 更多场景
    ],
    // ... 第4-10章场景
};

/**
 * 场景管理器
 */
export class SceneManager {
    private currentScene: SceneConfig | null = null;

    /**
     * 加载场景
     */
    loadScene(sceneId: string, chapter: number): SceneConfig | null {
        const scenes = ALL_SCENES[chapter] || [];
        const scene = scenes.find(s => s.id === sceneId);
        
        if (scene) {
            this.currentScene = scene;
            // 实际项目中这里会加载图片和音乐
            console.log(`加载场景: ${scene.name}`);
            return scene;
        }
        
        return null;
    }

    /**
     * 获取当前场景
     */
    getCurrentScene(): SceneConfig | null {
        return this.currentScene;
    }

    /**
     * 预加载章节所有场景
     */
    preloadChapterScenes(chapter: number): void {
        const scenes = ALL_SCENES[chapter] || [];
        for (const scene of scenes) {
            console.log(`预加载场景资源: ${scene.backgroundImage}`);
        }
    }
}

export const sceneManager = new SceneManager();
