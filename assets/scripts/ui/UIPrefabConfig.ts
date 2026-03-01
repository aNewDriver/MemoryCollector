/**
 * Cocos Creator UI 预制体配置
 * 定义所有UI组件的结构和属性
 */

export interface UIComponentConfig {
    name: string;
    width: number;
    height: number;
    anchorX: number;
    anchorY: number;
    position: { x: number; y: number };
    components: string[];
    children?: UIComponentConfig[];
}

export interface SceneConfig {
    name: string;
    bgm?: string;
    background: string;
    uiComponents: UIComponentConfig[];
}

// 主场景UI配置
export const MAIN_SCENE_CONFIG: SceneConfig = {
    name: 'MainScene',
    background: 'images/backgrounds/bg_1.bmp',
    bgm: 'audio/bgm_main.mp3',
    uiComponents: [
        // 顶部信息栏
        {
            name: 'TopBar',
            width: 750,
            height: 120,
            anchorX: 0.5,
            anchorY: 1,
            position: { x: 375, y: 1334 },
            components: ['Widget'],
            children: [
                {
                    name: 'PlayerAvatar',
                    width: 80,
                    height: 80,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 20, y: 0 },
                    components: ['Sprite', 'Button']
                },
                {
                    name: 'PlayerName',
                    width: 200,
                    height: 40,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 110, y: 15 },
                    components: ['Label']
                },
                {
                    name: 'PlayerLevel',
                    width: 60,
                    height: 30,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 110, y: -15 },
                    components: ['Label', 'Sprite']
                },
                // 货币显示
                {
                    name: 'CurrencyBar',
                    width: 400,
                    height: 60,
                    anchorX: 1,
                    anchorY: 0.5,
                    position: { x: -20, y: 0 },
                    components: [],
                    children: [
                        {
                            name: 'GoldIcon',
                            width: 40,
                            height: 40,
                            anchorX: 0,
                            anchorY: 0.5,
                            position: { x: -350, y: 0 },
                            components: ['Sprite']
                        },
                        {
                            name: 'GoldLabel',
                            width: 100,
                            height: 40,
                            anchorX: 0,
                            anchorY: 0.5,
                            position: { x: -300, y: 0 },
                            components: ['Label']
                        },
                        {
                            name: 'CrystalIcon',
                            width: 40,
                            height: 40,
                            anchorX: 0,
                            anchorY: 0.5,
                            position: { x: -180, y: 0 },
                            components: ['Sprite']
                        },
                        {
                            name: 'CrystalLabel',
                            width: 100,
                            height: 40,
                            anchorX: 0,
                            anchorY: 0.5,
                            position: { x: -130, y: 0 },
                            components: ['Label']
                        }
                    ]
                }
            ]
        },
        // 主内容区
        {
            name: 'MainContent',
            width: 750,
            height: 900,
            anchorX: 0.5,
            anchorY: 0.5,
            position: { x: 375, y: 667 },
            components: [],
            children: [
                // 角色展示
                {
                    name: 'CharacterDisplay',
                    width: 400,
                    height: 600,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    position: { x: 0, y: 100 },
                    components: ['Sprite', 'Animation']
                },
                // 快捷功能按钮
                {
                    name: 'QuickActions',
                    width: 700,
                    height: 200,
                    anchorX: 0.5,
                    anchorY: 0,
                    position: { x: 0, y: -350 },
                    components: [],
                    children: [
                        {
                            name: 'BtnAdventure',
                            width: 150,
                            height: 150,
                            anchorX: 0,
                            anchorY: 0.5,
                            position: { x: -300, y: 0 },
                            components: ['Sprite', 'Button', 'Animation']
                        },
                        {
                            name: 'BtnGacha',
                            width: 150,
                            height: 150,
                            anchorX: 0.5,
                            anchorY: 0.5,
                            position: { x: 0, y: 20 },
                            components: ['Sprite', 'Button', 'Animation']
                        },
                        {
                            name: 'BtnArena',
                            width: 150,
                            height: 150,
                            anchorX: 1,
                            anchorY: 0.5,
                            position: { x: 300, y: 0 },
                            components: ['Sprite', 'Button', 'Animation']
                        }
                    ]
                }
            ]
        },
        // 底部导航栏
        {
            name: 'BottomNav',
            width: 750,
            height: 150,
            anchorX: 0.5,
            anchorY: 0,
            position: { x: 375, y: 0 },
            components: ['Widget', 'Sprite'],
            children: [
                {
                    name: 'NavHome',
                    width: 100,
                    height: 100,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 50, y: 0 },
                    components: ['Sprite', 'Button']
                },
                {
                    name: 'NavCards',
                    width: 100,
                    height: 100,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 170, y: 0 },
                    components: ['Sprite', 'Button']
                },
                {
                    name: 'NavGuild',
                    width: 100,
                    height: 100,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 290, y: 0 },
                    components: ['Sprite', 'Button']
                },
                {
                    name: 'NavShop',
                    width: 100,
                    height: 100,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 410, y: 0 },
                    components: ['Sprite', 'Button']
                },
                {
                    name: 'NavSettings',
                    width: 100,
                    height: 100,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 530, y: 0 },
                    components: ['Sprite', 'Button']
                }
            ]
        }
    ]
};

// 战斗场景UI配置
export const BATTLE_SCENE_CONFIG: SceneConfig = {
    name: 'BattleScene',
    background: 'images/backgrounds/bg_4.bmp',
    bgm: 'audio/bgm_battle.mp3',
    uiComponents: [
        // 战斗信息显示
        {
            name: 'BattleInfo',
            width: 750,
            height: 100,
            anchorX: 0.5,
            anchorY: 1,
            position: { x: 375, y: 1334 },
            components: [],
            children: [
                {
                    name: 'RoundCounter',
                    width: 150,
                    height: 50,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    position: { x: 0, y: -30 },
                    components: ['Label', 'Sprite']
                },
                {
                    name: 'BattleTimer',
                    width: 100,
                    height: 40,
                    anchorX: 1,
                    anchorY: 0.5,
                    position: { x: -30, y: -30 },
                    components: ['Label']
                }
            ]
        },
        // 敌方区域
        {
            name: 'EnemyArea',
            width: 700,
            height: 400,
            anchorX: 0.5,
            anchorY: 0.5,
            position: { x: 375, y: 1000 },
            components: [],
            children: [
                // 5个敌方卡位
                ...Array.from({ length: 5 }, (_, i) => ({
                    name: `EnemySlot_${i}`,
                    width: 120,
                    height: 180,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    position: { x: -240 + i * 120, y: 0 },
                    components: ['Sprite', 'Button', 'Animation']
                }))
            ]
        },
        // 我方区域
        {
            name: 'PlayerArea',
            width: 700,
            height: 400,
            anchorX: 0.5,
            anchorY: 0.5,
            position: { x: 375, y: 550 },
            components: [],
            children: [
                // 5个己方卡位
                ...Array.from({ length: 5 }, (_, i) => ({
                    name: `PlayerSlot_${i}`,
                    width: 120,
                    height: 180,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    position: { x: -240 + i * 120, y: 0 },
                    components: ['Sprite', 'Button', 'Animation', 'HPBar']
                }))
            ]
        },
        // 技能/行动按钮
        {
            name: 'ActionPanel',
            width: 750,
            height: 200,
            anchorX: 0.5,
            anchorY: 0,
            position: { x: 375, y: 150 },
            components: [],
            children: [
                {
                    name: 'SkillContainer',
                    width: 500,
                    height: 150,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 30, y: 0 },
                    components: [],
                    children: [
                        // 4个技能按钮
                        ...Array.from({ length: 4 }, (_, i) => ({
                            name: `SkillBtn_${i}`,
                            width: 100,
                            height: 100,
                            anchorX: 0,
                            anchorY: 0.5,
                            position: { x: i * 120, y: 0 },
                            components: ['Sprite', 'Button', 'Cooldown']
                        }))
                    ]
                },
                {
                    name: 'BtnAuto',
                    width: 80,
                    height: 80,
                    anchorX: 1,
                    anchorY: 0.5,
                    position: { x: -120, y: 20 },
                    components: ['Sprite', 'Button', 'Toggle']
                },
                {
                    name: 'BtnSpeed',
                    width: 80,
                    height: 80,
                    anchorX: 1,
                    anchorY: 0.5,
                    position: { x: -30, y: 20 },
                    components: ['Sprite', 'Button', 'Toggle']
                }
            ]
        }
    ]
};

// 卡牌详情界面
export const CARD_DETAIL_CONFIG: SceneConfig = {
    name: 'CardDetail',
    background: 'images/backgrounds/bg_1.bmp',
    uiComponents: [
        {
            name: 'CardDisplay',
            width: 500,
            height: 800,
            anchorX: 0.5,
            anchorY: 0.5,
            position: { x: 375, y: 700 },
            components: ['Sprite', 'Animation'],
            children: [
                {
                    name: 'CardImage',
                    width: 450,
                    height: 700,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    position: { x: 0, y: 0 },
                    components: ['Sprite']
                },
                {
                    name: 'RarityFrame',
                    width: 450,
                    height: 700,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    position: { x: 0, y: 0 },
                    components: ['Sprite']
                }
            ]
        },
        // 属性面板
        {
            name: 'StatsPanel',
            width: 700,
            height: 300,
            anchorX: 0.5,
            anchorY: 0,
            position: { x: 375, y: 100 },
            components: ['Sprite'],
            children: [
                {
                    name: 'HPBar',
                    width: 300,
                    height: 30,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: -320, y: 80 },
                    components: ['ProgressBar', 'Label']
                },
                {
                    name: 'ATKLabel',
                    width: 150,
                    height: 40,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: -320, y: 30 },
                    components: ['Label']
                },
                {
                    name: 'DEFLabel',
                    width: 150,
                    height: 40,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: -150, y: 30 },
                    components: ['Label']
                },
                {
                    name: 'SPDLabel',
                    width: 150,
                    height: 40,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: 20, y: 30 },
                    components: ['Label']
                }
            ]
        },
        // 操作按钮
        {
            name: 'ActionButtons',
            width: 700,
            height: 120,
            anchorX: 0.5,
            anchorY: 0,
            position: { x: 375, y: 20 },
            components: [],
            children: [
                {
                    name: 'BtnUpgrade',
                    width: 200,
                    height: 80,
                    anchorX: 0,
                    anchorY: 0.5,
                    position: { x: -300, y: 0 },
                    components: ['Sprite', 'Button']
                },
                {
                    name: 'BtnEquip',
                    width: 200,
                    height: 80,
                    anchorX: 0.5,
                    anchorY: 0.5,
                    position: { x: 0, y: 0 },
                    components: ['Sprite', 'Button']
                },
                {
                    name: 'BtnBack',
                    width: 200,
                    height: 80,
                    anchorX: 1,
                    anchorY: 0.5,
                    position: { x: 300, y: 0 },
                    components: ['Sprite', 'Button']
                }
            ]
        }
    ]
};

// 导出所有场景配置
export const ALL_SCENE_CONFIGS = {
    main: MAIN_SCENE_CONFIG,
    battle: BATTLE_SCENE_CONFIG,
    cardDetail: CARD_DETAIL_CONFIG
};
