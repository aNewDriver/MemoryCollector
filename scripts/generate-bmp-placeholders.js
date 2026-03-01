const fs = require('fs');
const path = require('path');

/**
 * 生成简单的BMP占位图
 */

// BMP文件头
function createBMPHeader(width, height, bitsPerPixel = 24) {
    const rowSize = Math.floor((bitsPerPixel * width + 31) / 32) * 4;
    const imageSize = rowSize * height;
    const fileSize = 54 + imageSize;
    
    const buffer = Buffer.alloc(54);
    
    // BMP文件头 (14字节)
    buffer.write('BM', 0);  // 签名
    buffer.writeUInt32LE(fileSize, 2);  // 文件大小
    buffer.writeUInt32LE(0, 6);  // 保留
    buffer.writeUInt32LE(54, 10);  // 数据偏移
    
    // DIB头 (40字节 - BITMAPINFOHEADER)
    buffer.writeUInt32LE(40, 14);  // DIB头大小
    buffer.writeInt32LE(width, 18);  // 宽度
    buffer.writeInt32LE(height, 22);  // 高度 (正数表示从下往上)
    buffer.writeUInt16LE(1, 26);  // 平面数
    buffer.writeUInt16LE(bitsPerPixel, 28);  // 位深度
    buffer.writeUInt32LE(0, 30);  // 压缩方式 (0 = 无压缩)
    buffer.writeUInt32LE(imageSize, 34);  // 图像大小
    buffer.writeInt32LE(2835, 38);  // 水平分辨率 (72 DPI)
    buffer.writeInt32LE(2835, 42);  // 垂直分辨率
    buffer.writeUInt32LE(0, 46);  // 调色板颜色数
    buffer.writeUInt32LE(0, 50);  // 重要颜色数
    
    return buffer;
}

// 生成纯色BMP
function generateSolidBMP(width, height, r, g, b) {
    const header = createBMPHeader(width, height);
    const rowSize = Math.floor((24 * width + 31) / 32) * 4;
    const imageSize = rowSize * height;
    const pixelData = Buffer.alloc(imageSize);
    
    // BMP数据是从下往上存储的
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = (height - 1 - y) * rowSize + x * 3;
            pixelData[offset] = b;     // B
            pixelData[offset + 1] = g; // G
            pixelData[offset + 2] = r; // R
        }
    }
    
    return Buffer.concat([header, pixelData]);
}

// 生成带边框的BMP
function generateBorderedBMP(width, height, bgColor, borderColor, borderWidth = 10) {
    const header = createBMPHeader(width, height);
    const rowSize = Math.floor((24 * width + 31) / 32) * 4;
    const imageSize = rowSize * height;
    const pixelData = Buffer.alloc(imageSize);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offset = (height - 1 - y) * rowSize + x * 3;
            
            // 判断是否在边框上
            const isBorder = x < borderWidth || x >= width - borderWidth || 
                            y < borderWidth || y >= height - borderWidth;
            
            const color = isBorder ? borderColor : bgColor;
            pixelData[offset] = color[2];     // B
            pixelData[offset + 1] = color[1]; // G
            pixelData[offset + 2] = color[0]; // R
        }
    }
    
    return Buffer.concat([header, pixelData]);
}

// 颜色定义
const colors = {
    jin_yu: { primary: [255, 107, 53], secondary: [200, 70, 30] },      // 橙红
    qing_yi: { primary: [78, 205, 196], secondary: [50, 160, 150] },    // 青色
    zhu_feng: { primary: [149, 225, 211], secondary: [100, 180, 160] }, // 薄荷绿
    yan_xin: { primary: [201, 185, 154], secondary: [160, 140, 110] },  // 土黄
    ming_zhu: { primary: [255, 217, 61], secondary: [220, 180, 40] },   // 金色
    can_ying: { primary: [108, 92, 231], secondary: [80, 60, 180] },    // 紫色
    fire: [231, 76, 60],
    water: [52, 152, 219],
    wind: [46, 204, 113],
    earth: [243, 156, 18],
    light: [241, 196, 15],
    dark: [142, 68, 173],
    gold: [241, 196, 15],
    crystal: [52, 152, 219],
    exp: [155, 89, 182],
    energy: [231, 76, 60],
    heart: [231, 76, 60],
    attack: [230, 126, 34],
    defense: [52, 152, 219],
    speed: [46, 204, 113],
    common: [149, 165, 166],
    rare: [52, 152, 219],
    epic: [155, 89, 182],
    legend: [241, 196, 15]
};

// 生成所有占位图
function generateAllPlaceholders() {
    const baseDir = path.join(__dirname, '..', 'assets/resources/images');
    
    // 1. 角色立绘 (1024x1820 for full/awaken, 512x512 for portrait)
    const characters = [
        { id: 'jin_yu', colors: colors.jin_yu },
        { id: 'qing_yi', colors: colors.qing_yi },
        { id: 'zhu_feng', colors: colors.zhu_feng },
        { id: 'yan_xin', colors: colors.yan_xin },
        { id: 'ming_zhu', colors: colors.ming_zhu },
        { id: 'can_ying', colors: colors.can_ying }
    ];
    
    const cardsDir = path.join(baseDir, 'cards');
    characters.forEach(char => {
        // 全身图 1024x1820
        const fullBMP = generateBorderedBMP(1024, 1820, char.colors.primary, char.colors.secondary, 20);
        fs.writeFileSync(path.join(cardsDir, `${char.id}_full.bmp`), fullBMP);
        
        // 觉醒图 (稍暗)
        const darken = char.colors.primary.map(c => Math.max(0, c - 40));
        const awakenBMP = generateBorderedBMP(1024, 1820, darken, char.colors.secondary, 30);
        fs.writeFileSync(path.join(cardsDir, `${char.id}_awaken.bmp`), awakenBMP);
        
        // 头像 512x512
        const portraitBMP = generateBorderedBMP(512, 512, char.colors.primary, char.colors.secondary, 15);
        fs.writeFileSync(path.join(cardsDir, `${char.id}_portrait.bmp`), portraitBMP);
        
        console.log(`✓ Generated ${char.id} cards (3 files)`);
    });
    
    // 2. 技能图标 256x256
    const skillColors = [colors.fire, colors.fire, colors.water, colors.water, 
                        colors.wind, colors.earth, colors.light, colors.dark,
                        colors.water, colors.defense, colors.fire, colors.speed];
    const skillsDir = path.join(baseDir, 'skills');
    skillColors.forEach((color, i) => {
        const bmp = generateBorderedBMP(256, 256, color, [255, 255, 255], 8);
        fs.writeFileSync(path.join(skillsDir, `skill_${i + 1}.bmp`), bmp);
    });
    console.log(`✓ Generated 12 skill icons`);
    
    // 3. UI按钮 400x120
    const buttonColors = [colors.fire, colors.speed, colors.common, colors.common, 
                         colors.dark, colors.earth];
    const uiDir = path.join(baseDir, 'ui');
    buttonColors.forEach((color, i) => {
        const bmp = generateBorderedBMP(400, 120, color, [255, 255, 255], 5);
        fs.writeFileSync(path.join(uiDir, `btn_${i + 1}.bmp`), bmp);
    });
    console.log(`✓ Generated 6 UI buttons`);
    
    // 4. 背景图 750x1334
    const bgColors = [
        { bg: [44, 62, 80], border: [52, 73, 94] },      // 主城
        { bg: [39, 174, 96], border: [44, 62, 80] },     // 探险
        { bg: [142, 68, 173], border: [44, 62, 80] },    // 爬塔
        { bg: [192, 57, 43], border: [44, 62, 80] },     // 战斗
        { bg: [243, 156, 18], border: [142, 68, 173] }   // 抽卡
    ];
    const bgDir = path.join(baseDir, 'backgrounds');
    bgColors.forEach((colors, i) => {
        const bmp = generateBorderedBMP(750, 1334, colors.bg, colors.border, 30);
        fs.writeFileSync(path.join(bgDir, `bg_${i + 1}.bmp`), bmp);
    });
    console.log(`✓ Generated 5 backgrounds`);
    
    // 5. 图标 128x128
    const iconColors = [
        colors.gold, colors.crystal, colors.exp, colors.energy,
        colors.heart, colors.attack, colors.defense, colors.speed,
        colors.fire, colors.water, colors.wind, colors.earth,
        colors.light, colors.dark
    ];
    const iconsDir = path.join(baseDir, 'icons');
    iconColors.forEach((color, i) => {
        const bmp = generateBorderedBMP(128, 128, color, [255, 255, 255], 4);
        fs.writeFileSync(path.join(iconsDir, `icon_${i + 1}.bmp`), bmp);
    });
    console.log(`✓ Generated 14 icons`);
    
    // 6. 装备图标 128x128
    const rarityColors = [colors.common, colors.rare, colors.epic, colors.legend];
    const eqTypes = ['weapon', 'helmet', 'armor', 'pants', 'accessory', 'ring'];
    const eqDir = path.join(baseDir, 'equipment');
    eqTypes.forEach((type, ti) => {
        rarityColors.forEach((color, ri) => {
            const rarity = ['common', 'rare', 'epic', 'legend'][ri];
            const bmp = generateBorderedBMP(128, 128, color, [255, 255, 255], 6);
            fs.writeFileSync(path.join(eqDir, `eq_${ti + 1}_${rarity}.bmp`), bmp);
        });
    });
    console.log(`✓ Generated 24 equipment icons`);
    
    // 统计
    const totalFiles = 
        characters.length * 3 +  // 角色
        12 +  // 技能
        6 +   // 按钮
        5 +   // 背景
        14 +  // 图标
        24;   // 装备
    
    console.log(`\n✅ BMP Placeholder generation complete!`);
    console.log(`📊 Total: ${totalFiles} BMP files generated`);
    
    // 生成资源清单
    const manifest = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        resources: {
            characters: characters.map(c => ({
                id: c.id,
                files: [`${c.id}_portrait.bmp`, `${c.id}_full.bmp`, `${c.id}_awaken.bmp`]
            })),
            skills: 12,
            buttons: 6,
            backgrounds: 5,
            icons: 14,
            equipment: 24
        },
        total: totalFiles
    };
    
    fs.writeFileSync(
        path.join(baseDir, '_resource_manifest.json'),
        JSON.stringify(manifest, null, 2)
    );
    
    console.log('\n📝 Resource manifest saved to _resource_manifest.json');
}

// 执行生成
generateAllPlaceholders();
