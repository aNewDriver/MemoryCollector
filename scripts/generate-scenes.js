const fs = require('fs');
const path = require('path');

/**
 * Cocos Creator 场景文件生成器
 * 生成 .scene 文件供 Cocos Creator 3.8+ 使用
 */

// 场景基础结构
function createSceneNode(name, uuid) {
    return {
        __type__: 'cc.Scene',
        _name: name,
        _objFlags: 0,
        _parent: null,
        _children: [],
        _active: true,
        _components: [],
        _prefab: null,
        _lpos: { x: 0, y: 0, z: 0 },
        _lrot: { x: 0, y: 0, z: 0, w: 1 },
        _lscale: { x: 1, y: 1, z: 1 },
        _mobility: 0,
        _layer: 33554432,
        _id: uuid
    };
}

// 创建Canvas节点
function createCanvasNode(uuid) {
    return {
        __type__: 'cc.Node',
        _name: 'Canvas',
        _objFlags: 0,
        _parent: { __id__: 1 },
        _children: [],
        _active: true,
        _components: [
            {
                __type__: 'cc.UITransform',
                _name: '',
                _objFlags: 0,
                node: { __id__: 2 },
                _enabled: true,
                __prefab: null,
                _contentSize: { width: 750, height: 1334 },
                _anchorPoint: { x: 0.5, y: 0.5 }
            },
            {
                __type__: 'cc.Canvas',
                _name: '',
                _objFlags: 0,
                node: { __id__: 2 },
                _enabled: true,
                __prefab: null,
                _cameraComponent: { __id__: 4 },
                _alignCanvasWithScreen: true
            },
            {
                __type__: 'cc.Widget',
                _name: '',
                _objFlags: 0,
                node: { __id__: 2 },
                _enabled: true,
                __prefab: null,
                _alignFlags: 45,
                _target: null,
                _left: 0,
                _right: 0,
                _top: 0,
                _bottom: 0,
                _horizontalCenter: 0,
                _verticalCenter: 0,
                _isAbsLeft: true,
                _isAbsRight: true,
                _isAbsTop: true,
                _isAbsBottom: true,
                _isAbsHorizontalCenter: true,
                _isAbsVerticalCenter: true,
                _originalWidth: 0,
                _originalHeight: 0
            }
        ],
        _prefab: null,
        _lpos: { x: 375, y: 667, z: 0 },
        _lrot: { x: 0, y: 0, z: 0, w: 1 },
        _lscale: { x: 1, y: 1, z: 1 },
        _mobility: 0,
        _layer: 33554432,
        _id: uuid
    };
}

// 创建相机节点
function createCameraNode(uuid) {
    return {
        __type__: 'cc.Node',
        _name: 'MainCamera',
        _objFlags: 0,
        _parent: { __id__: 1 },
        _children: [],
        _active: true,
        _components: [
            {
                __type__: 'cc.Camera',
                _name: '',
                _objFlags: 0,
                node: { __id__: 3 },
                _enabled: true,
                __prefab: null,
                _projection: 0,
                _priority: 0,
                _fov: 45,
                _fovAxis: 0,
                _orthoHeight: 667,
                _near: 0,
                _far: 2000,
                _color: { r: 0, g: 0, b: 0, a: 255 },
                _depth: 1,
                _stencil: 0,
                _clearFlags: 7,
                _rect: { x: 0, y: 0, width: 1, height: 1 },
                _aperture: 19,
                _shutter: 7,
                _iso: 0,
                _screenScale: 1,
                _visibility: 33554432,
                _targetTexture: null
            }
        ],
        _prefab: null,
        _lpos: { x: 375, y: 667, z: 1000 },
        _lrot: { x: 0, y: 0, z: 0, w: 1 },
        _lscale: { x: 1, y: 1, z: 1 },
        _mobility: 0,
        _layer: 33554432,
        _id: uuid
    };
}

// 生成场景文件内容
function generateSceneContent(sceneName) {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    const uuid3 = generateUUID();
    
    const scene = createSceneNode(sceneName, uuid1);
    const canvas = createCanvasNode(uuid2);
    const camera = createCameraNode(uuid3);
    
    scene._children = [
        { __id__: 2 },
        { __id__: 3 }
    ];
    
    const content = {
        __type__: '__Declaration__',
        __editorExtras__: {},
        __metas__: {},
        __any__:[
            scene,
            canvas,
            camera
        ]
    };
    
    return JSON.stringify(content, null, 2);
}

// 简单UUID生成
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 生成场景文件
const scenesDir = path.join(__dirname, '..', 'assets/scenes');

const scenes = [
    { name: 'MainScene', description: '主场景 - 包含顶部栏、角色展示、底部导航' },
    { name: 'BattleScene', description: '战斗场景 - 5v5回合制战斗界面' },
    { name: 'CardDetailScene', description: '卡牌详情 - 角色信息、属性、技能展示' },
    { name: 'GachaScene', description: '抽卡场景 - 召唤界面' },
    { name: 'ShopScene', description: '商店场景 - 道具购买' },
    { name: 'GuildScene', description: '公会场景 - 公会信息、建设' },
    { name: 'InventoryScene', description: '背包场景 - 道具管理' },
    { name: 'TowerScene', description: '爬塔场景 - 无限之塔挑战' }
];

console.log('🎬 Generating Cocos Creator scene files...\n');

scenes.forEach(scene => {
    const content = generateSceneContent(scene.name);
    const filePath = path.join(scenesDir, `${scene.name}.scene`);
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ ${scene.name}.scene - ${scene.description}`);
});

// 生成场景索引文档
const indexContent = `# 场景文件索引

生成时间: ${new Date().toLocaleString()}

## 场景列表

${scenes.map(s => `- **${s.name}** - ${s.description}`).join('\n')}

## 使用说明

1. 在 Cocos Creator 中打开项目
2. 双击场景文件即可加载
3. 场景已配置基础 Canvas (750x1334) 和 Camera
4. 根据 UIPrefabConfig.ts 添加UI节点

## 下一步

- 添加UI预制体到 Canvas 节点下
- 绑定对应的 TypeScript 组件
- 配置场景切换逻辑
`;

fs.writeFileSync(path.join(scenesDir, '_SCENE_INDEX.md'), indexContent);

console.log(`\n✅ Generated ${scenes.length} scene files!`);
console.log('📁 Location: assets/scenes/');
console.log('\nNext steps:');
console.log('  1. Open project in Cocos Creator 3.8+');
console.log('  2. Double-click scene files to edit');
console.log('  3. Add UI nodes according to UIPrefabConfig.ts');
