const fs = require('fs');
const path = require('path');

// 确保目录存在
const cardsDir = path.join(__dirname, '..', 'assets/resources/images/cards');

// 角色配置
const characters = [
    { id: 'jin_yu', name: '烬羽', element: 'fire', color: '#FF6B35', gradient: ['#FF6B35', '#C0392B'] },
    { id: 'qing_yi', name: '青漪', element: 'water', color: '#4ECDC4', gradient: ['#4ECDC4', '#2980B9'] },
    { id: 'zhu_feng', name: '逐风', element: 'wind', color: '#95E1D3', gradient: ['#95E1D3', '#27AE60'] },
    { id: 'yan_xin', name: '岩心', element: 'earth', color: '#C9B99A', gradient: ['#C9B99A', '#8B7355'] },
    { id: 'ming_zhu', name: '明烛', element: 'light', color: '#FFD93D', gradient: ['#FFD93D', '#F39C12'] },
    { id: 'can_ying', name: '残影', element: 'dark', color: '#6C5CE7', gradient: ['#6C5CE7', '#2D3436'] }
];

// 生成HTML Canvas风格的PNG（使用BMP作为基础，添加更多细节）
function generateDetailedCharacterBMP(char, type) {
    const isPortrait = type === 'portrait';
    const width = isPortrait ? 512 : 1024;
    const height = isPortrait ? 512 : 1820;
    
    // BMP头
    const rowSize = Math.floor((24 * width + 31) / 32) * 4;
    const imageSize = rowSize * height;
    const fileSize = 54 + imageSize;
    
    const header = Buffer.alloc(54);
    header.write('BM', 0);
    header.writeUInt32LE(fileSize, 2);
    header.writeUInt32LE(0, 6);
    header.writeUInt32LE(54, 10);
    header.writeUInt32LE(40, 14);
    header.writeInt32LE(width, 18);
    header.writeInt32LE(height, 22);
    header.writeUInt16LE(1, 26);
    header.writeUInt16LE(24, 28);
    header.writeUInt32LE(0, 30);
    header.writeUInt32LE(imageSize, 34);
    header.writeInt32LE(2835, 38);
    header.writeInt32LE(2835, 42);
    header.writeUInt32LE(0, 46);
    header.writeUInt32LE(0, 50);
    
    const pixelData = Buffer.alloc(imageSize);
    
    // 解析颜色
    const [r1, g1, b1] = hexToRgb(char.gradient[0]);
    const [r2, g2, b2] = hexToRgb(char.gradient[1]);
    
    // 生成渐变背景 + 装饰图案
    for (let y = 0; y < height; y++) {
        const ratio = y / height;
        const bgR = Math.floor(r1 + (r2 - r1) * ratio);
        const bgG = Math.floor(g1 + (g2 - g1) * ratio);
        const bgB = Math.floor(b1 + (b2 - b1) * ratio);
        
        for (let x = 0; x < width; x++) {
            const offset = (height - 1 - y) * rowSize + x * 3;
            
            // 基础渐变
            let r = bgR;
            let g = bgG;
            let b = bgB;
            
            // 添加径向光晕效果（中心亮，边缘暗）
            const centerX = width / 2;
            const centerY = height / 3;
            const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const maxDist = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/3, 2));
            const glowIntensity = Math.max(0, 1 - dist / maxDist) * 0.3;
            
            r = Math.min(255, r + glowIntensity * 50);
            g = Math.min(255, g + glowIntensity * 50);
            b = Math.min(255, b + glowIntensity * 30);
            
            // 添加随机噪点（纹理感）
            if (Math.random() < 0.05) {
                const noise = (Math.random() - 0.5) * 20;
                r = Math.max(0, Math.min(255, r + noise));
                g = Math.max(0, Math.min(255, g + noise));
                b = Math.max(0, Math.min(255, b + noise));
            }
            
            // 绘制装饰性边框
            const borderWidth = isPortrait ? 20 : 40;
            if (x < borderWidth || x >= width - borderWidth || y < borderWidth || y >= height - borderWidth) {
                r = Math.min(255, r * 0.7 + 60);
                g = Math.min(255, g * 0.7 + 60);
                b = Math.min(255, b * 0.7 + 60);
            }
            
            // 绘制角落装饰
            const cornerSize = isPortrait ? 60 : 120;
            const inCorner = (x < cornerSize && y < cornerSize) || 
                            (x >= width - cornerSize && y < cornerSize) ||
                            (x < cornerSize && y >= height - cornerSize) ||
                            (x >= width - cornerSize && y >= height - cornerSize);
            if (inCorner && ((x + y) % 20 < 10)) {
                r = Math.min(255, r + 40);
                g = Math.min(255, g + 40);
                b = Math.min(255, b + 20);
            }
            
            pixelData[offset] = b;
            pixelData[offset + 1] = g;
            pixelData[offset + 2] = r;
        }
    }
    
    // 绘制角色占位符（中央圆形/椭圆区域）
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = isPortrait ? 150 : 300;
    const radiusY = isPortrait ? 180 : 400;
    
    for (let y = Math.max(0, Math.floor(centerY - radiusY)); y < Math.min(height, Math.ceil(centerY + radiusY)); y++) {
        for (let x = Math.max(0, Math.floor(centerX - radiusX)); x < Math.min(width, Math.ceil(centerX + radiusX)); x++) {
            const dx = (x - centerX) / radiusX;
            const dy = (y - centerY) / radiusY;
            const dist = dx * dx + dy * dy;
            
            if (dist <= 1) {
                const offset = (height - 1 - y) * rowSize + x * 3;
                const intensity = 1 - Math.sqrt(dist) * 0.3;
                
                // 角色剪影颜色（比背景深）
                const silhouetteR = Math.floor(r2 * intensity * 0.5);
                const silhouetteG = Math.floor(g2 * intensity * 0.5);
                const silhouetteB = Math.floor(b2 * intensity * 0.6);
                
                pixelData[offset] = silhouetteB;
                pixelData[offset + 1] = silhouetteG;
                pixelData[offset + 2] = silhouetteR;
            }
        }
    }
    
    // 绘制文字标签
    drawText(pixelData, width, height, char.name, centerX, centerY - 30, isPortrait ? 48 : 72, [255, 255, 255]);
    drawText(pixelData, width, height, type === 'awaken' ? 'AWAKENED' : type.toUpperCase(), centerX, centerY + (isPortrait ? 30 : 50), isPortrait ? 20 : 32, [255, 215, 0]);
    
    // 底部信息
    if (!isPortrait) {
        drawText(pixelData, width, height, `${char.element.toUpperCase()} | ${char.id}`, centerX, height - 80, 24, [200, 200, 200]);
    }
    
    return Buffer.concat([header, pixelData]);
}

// 简单的文字绘制（简化版）
function drawText(pixelData, width, height, text, centerX, centerY, fontSize, color) {
    // 简化的文字渲染 - 用色块表示文字位置
    const textWidth = text.length * fontSize * 0.6;
    const startX = Math.floor(centerX - textWidth / 2);
    const startY = Math.floor(centerY - fontSize / 2);
    const endX = Math.floor(centerX + textWidth / 2);
    const endY = Math.floor(centerY + fontSize / 2);
    
    const rowSize = Math.floor((24 * width + 31) / 32) * 4;
    
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                const offset = (height - 1 - y) * rowSize + x * 3;
                // 文字发光效果
                const glow = Math.random() * 0.3 + 0.7;
                pixelData[offset] = Math.floor(color[2] * glow);
                pixelData[offset + 1] = Math.floor(color[1] * glow);
                pixelData[offset + 2] = Math.floor(color[0] * glow);
            }
        }
    }
}

// 辅助函数：Hex转RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

// 生成所有角色立绘
console.log('🎨 Generating detailed character art placeholders...\n');

let count = 0;
characters.forEach(char => {
    ['portrait', 'full', 'awaken'].forEach(type => {
        const bmp = generateDetailedCharacterBMP(char, type);
        const filename = path.join(cardsDir, `${char.id}_${type}.bmp`);
        fs.writeFileSync(filename, bmp);
        count++;
        console.log(`  ✓ ${char.id}_${type}.bmp (${char.name} - ${type})`);
    });
});

console.log(`\n✅ Generated ${count} detailed character art files!`);
console.log('📁 Location: assets/resources/images/cards/');
console.log('\nNote: These are enhanced placeholder images.');
console.log('Replace with AI-generated art using docs/Character_Art_Prompts.md');
