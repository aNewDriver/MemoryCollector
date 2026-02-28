const fs = require('fs');
const path = require('path');

/**
 * 占位图生成器
 * 生成简单的彩色占位图用于开发测试
 */

const COLORS = {
    jin_yu: { r: 220, g: 80, b: 40 },      // 火 - 橙红
    qing_yi: { r: 60, g: 150, b: 200 },    // 水 - 蓝
    zhu_feng: { r: 80, g: 180, b: 120 },   // 风 - 绿
    yan_xin: { r: 150, g: 120, b: 80 },    // 土 - 棕
    ming_zhu: { r: 255, g: 220, b: 100 },  // 光 - 金黄
    can_ying: { r: 80, g: 60, b: 120 },    // 暗 - 紫
    blacksmith_zhang: { r: 120, g: 120, b: 120 }, // 灰
};

// 创建简单的 PPM 格式图片（纯文本，可转换为PNG）
function generatePPM(name, width, height, color, outputPath) {
    const header = `P6\n${width} ${height}\n255\n`;
    
    // 创建像素数据
    const pixelData = Buffer.alloc(width * height * 3);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 3;
            // 添加一些渐变效果
            const gradient = 1 - (y / height) * 0.3;
            pixelData[i] = Math.floor(color.r * gradient);     // R
            pixelData[i + 1] = Math.floor(color.g * gradient); // G
            pixelData[i + 2] = Math.floor(color.b * gradient); // B
        }
    }
    
    const output = path.join(outputPath, `${name}.ppm`);
    fs.writeFileSync(output, Buffer.concat([Buffer.from(header), pixelData]));
    console.log(`Generated: ${output}`);
    return output;
}

// 生成角色占位图
function generateCardPlaceholders() {
    const outputDir = './assets/resources/images/cards';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    Object.entries(COLORS).forEach(([charId, color]) => {
        // 头像 512x512
        generatePPM(`${charId}_portrait`, 512, 512, color, outputDir);
        // 全身 1024x1820
        generatePPM(`${charId}_full`, 1024, 1820, color, outputDir);
        // 觉醒版本
        if (charId !== 'blacksmith_zhang' && charId !== 'yan_xin') {
            const awakenColor = { 
                r: Math.min(255, color.r + 40), 
                g: Math.min(255, color.g + 40), 
                b: Math.min(255, color.b + 40) 
            };
            generatePPM(`${charId}_awaken`, 1024, 1820, awakenColor, outputDir);
        }
    });
    
    console.log('\n✅ 角色占位图生成完成');
    console.log('注意: PPM格式需要用工具转换为PNG格式才能在游戏中使用');
    console.log('建议使用: ImageMagick 命令: convert input.ppm output.png');
}

// 生成UI占位图
function generateUIPlaceholders() {
    const outputDir = './assets/resources/images/ui';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 按钮背景
    generatePPM('btn_primary', 200, 80, { r: 200, g: 160, b: 80 }, outputDir);
    generatePPM('btn_secondary', 200, 80, { r: 80, g: 120, b: 160 }, outputDir);
    generatePPM('btn_disabled', 200, 80, { r: 100, g: 100, b: 100 }, outputDir);
    
    // 面板背景
    generatePPM('panel_bg', 600, 800, { r: 40, g: 40, b: 45 }, outputDir);
    
    console.log('\n✅ UI占位图生成完成');
}

// 生成图标占位图
function generateIconPlaceholders() {
    const outputDir = './assets/resources/images/icons';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const icons = [
        { name: 'element_fire', color: { r: 220, g: 80, b: 40 } },
        { name: 'element_water', color: { r: 60, g: 150, b: 200 } },
        { name: 'element_wind', color: { r: 80, g: 180, b: 120 } },
        { name: 'element_earth', color: { r: 150, g: 120, b: 80 } },
        { name: 'element_light', color: { r: 255, g: 220, b: 100 } },
        { name: 'element_dark', color: { r: 80, g: 60, b: 120 } },
        { name: 'icon_gold', color: { r: 255, g: 200, b: 60 } },
        { name: 'icon_crystal', color: { r: 120, g: 200, b: 255 } },
    ];
    
    icons.forEach(icon => {
        generatePPM(icon.name, 128, 128, icon.color, outputDir);
    });
    
    console.log('\n✅ 图标占位图生成完成');
}

// 主函数
function main() {
    console.log('🎨 生成占位图资源...\n');
    
    generateCardPlaceholders();
    generateUIPlaceholders();
    generateIconPlaceholders();
    
    console.log('\n📋 下一步:');
    console.log('1. 安装 ImageMagick: apt-get install imagemagick (Linux) 或官网下载 (Windows/Mac)');
    console.log('2. 转换图片格式: for f in *.ppm; do convert "$f" "${f%.ppm}.png"; done');
    console.log('3. 或用 Python Pillow 脚本批量转换');
}

main();
