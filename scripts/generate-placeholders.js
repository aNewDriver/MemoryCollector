const fs = require('fs');
const path = require('path');

// 确保目录存在
const dirs = [
    'assets/resources/images/cards',
    'assets/resources/images/ui',
    'assets/resources/images/skills',
    'assets/resources/images/backgrounds',
    'assets/resources/images/equipment',
    'assets/resources/images/icons'
];

dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created: ${fullPath}`);
    }
});

// 角色配置
const characters = [
    { id: 'jin_yu', name: '烬羽', element: 'fire', color: '#FF6B35' },
    { id: 'qing_yi', name: '青漪', element: 'water', color: '#4ECDC4' },
    { id: 'zhu_feng', name: '逐风', element: 'wind', color: '#95E1D3' },
    { id: 'yan_xin', name: '岩心', element: 'earth', color: '#C9B99A' },
    { id: 'ming_zhu', name: '明烛', element: 'light', color: '#FFD93D' },
    { id: 'can_ying', name: '残影', element: 'dark', color: '#6C5CE7' }
];

// 生成角色占位图（SVG格式）
function generateCharacterPlaceholder(character, type) {
    const width = type === 'portrait' ? 512 : 1024;
    const height = type === 'portrait' ? 512 : 1820;
    
    const typeLabel = type === 'portrait' ? '头像' : type === 'full' ? '全身' : '觉醒';
    
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#2D3436"/>
            <stop offset="100%" style="stop-color:${character.color}"/>
        </linearGradient>
        <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    
    <!-- 背景 -->
    <rect width="100%" height="100%" fill="url(#bg)"/>
    
    <!-- 装饰性元素 -->
    <circle cx="${width/2}" cy="${height/3}" r="${width/4}" 
            fill="none" stroke="${character.color}" stroke-width="3" opacity="0.3"/>
    
    <!-- 角色占位符 - 剪影 -->
    <ellipse cx="${width/2}" cy="${height/2}" rx="${width/3}" ry="${height/3}"
             fill="${character.color}" opacity="0.4" filter="url(#glow)"/>
    
    <!-- 文字 -->
    <text x="${width/2}" y="${height/2}" 
          font-family="Arial, sans-serif" font-size="${width/8}" 
          fill="white" text-anchor="middle" dominant-baseline="middle">
        ${character.name}
    </text>
    <text x="${width/2}" y="${height/2 + width/6}" 
          font-family="Arial, sans-serif" font-size="${width/16}" 
          fill="${character.color}" text-anchor="middle" opacity="0.8">
        ${typeLabel}占位图
    </text>
    <text x="${width/2}" y="${height - 50}" 
          font-family="Arial, sans-serif" font-size="24" 
          fill="white" text-anchor="middle" opacity="0.5">
        ${character.element.toUpperCase()} | ${character.id}
    </text>
    
    <!-- 边框 -->
    <rect x="10" y="10" width="${width-20}" height="${height-20}"
          fill="none" stroke="${character.color}" stroke-width="5" opacity="0.5"/>
</svg>`;
    
    return svg;
}

// 生成技能图标占位图
function generateSkillIcon(skillName, color) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <radialGradient id="skillBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#2D3436"/>
            <stop offset="100%" style="stop-color:${color}"/>
        </radialGradient>
        <filter id="iconGlow">
            <feGaussianBlur stdDeviation="3"/>
        </filter>
    </defs>
    
    <!-- 背景圆 -->
    <circle cx="128" cy="128" r="120" fill="url(#skillBg)"/>
    
    <!-- 发光圆环 -->
    <circle cx="128" cy="128" r="110" fill="none" stroke="${color}" stroke-width="4" opacity="0.6"/>
    <circle cx="128" cy="128" r="100" fill="none" stroke="${color}" stroke-width="2" opacity="0.3"/>
    
    <!-- 技能符号 -->
    <text x="128" y="138" font-family="Arial, sans-serif" font-size="60" 
          fill="white" text-anchor="middle" font-weight="bold">
        ${skillName.charAt(0)}
    </text>
    
    <!-- 装饰点 -->
    <circle cx="128" cy="60" r="8" fill="${color}"/>
    <circle cx="128" cy="196" r="8" fill="${color}"/>
    <circle cx="60" cy="128" r="8" fill="${color}"/>
    <circle cx="196" cy="128" r="8" fill="${color}"/>
</svg>`;
    return svg;
}

// 生成UI按钮占位图
function generateUIButton(name, color, isPrimary = true) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="btnBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${isPrimary ? color : '#636E72'}"/>
            <stop offset="100%" style="stop-color:${isPrimary ? adjustColor(color, -30) : '#2D3436'}"/>
        </linearGradient>
        <filter id="btnShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
    </defs>
    
    <!-- 按钮背景 -->
    <rect x="10" y="10" width="380" height="100" rx="20" ry="20"
          fill="url(#btnBg)" filter="url(#btnShadow)"/>
    
    <!-- 高光 -->
    <rect x="10" y="10" width="380" height="50" rx="20" ry="20"
          fill="white" opacity="0.1"/>
    
    <!-- 边框 -->
    <rect x="10" y="10" width="380" height="100" rx="20" ry="20"
          fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
    
    <!-- 文字 -->
    <text x="200" y="72" font-family="Arial, sans-serif" font-size="32" 
          fill="white" text-anchor="middle" font-weight="bold">
        ${name}
    </text>
</svg>`;
    return svg;
}

// 辅助函数：调整颜色亮度
function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// 生成背景占位图
function generateBackground(name, color1, color2) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="750" height="1334" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${color1}"/>
            <stop offset="100%" style="stop-color:${color2}"/>
        </linearGradient>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" stroke-width="0.5" opacity="0.05"/>
        </pattern>
    </defs>
    
    <!-- 背景 -->
    <rect width="750" height="1334" fill="url(#bgGrad)"/>
    <rect width="750" height="1334" fill="url(#grid)"/>
    
    <!-- 装饰元素 -->
    <circle cx="375" cy="200" r="150" fill="white" opacity="0.05"/>
    <circle cx="100" cy="800" r="200" fill="white" opacity="0.03"/>
    <circle cx="650" cy="1000" r="180" fill="white" opacity="0.04"/>
    
    <!-- 场景名称 -->
    <text x="375" y="667" font-family="Arial, sans-serif" font-size="48" 
          fill="white" text-anchor="middle" opacity="0.6">
        ${name}
    </text>
    <text x="375" y="720" font-family="Arial, sans-serif" font-size="24" 
          fill="white" text-anchor="middle" opacity="0.4">
        背景占位图
    </text>
</svg>`;
    return svg;
}

// 生成图标占位图
function generateIcon(name, color) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color}"/>
            <stop offset="100%" style="stop-color:${adjustColor(color, -40)}"/>
        </linearGradient>
    </defs>
    
    <!-- 背景圆 -->
    <circle cx="64" cy="64" r="60" fill="url(#iconBg)"/>
    
    <!-- 高光 -->
    <ellipse cx="64" cy="40" rx="40" ry="20" fill="white" opacity="0.2"/>
    
    <!-- 图标文字 -->
    <text x="64" y="75" font-family="Arial, sans-serif" font-size="40" 
          fill="white" text-anchor="middle" font-weight="bold">
        ${name.charAt(0)}
    </text>
</svg>`;
    return svg;
}

// 生成装备图标占位图
function generateEquipmentIcon(type, rarity, color) {
    const rarityLabels = { common: '普通', rare: '稀有', epic: '史诗', legend: '传说' };
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="eqBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color}"/>
            <stop offset="100%" style="stop-color:${adjustColor(color, -50)}"/>
        </linearGradient>
    </defs>
    
    <!-- 背景 -->
    <rect x="14" y="14" width="100" height="100" rx="15" fill="url(#eqBg)"/>
    
    <!-- 边框 -->
    <rect x="14" y="14" width="100" height="100" rx="15" fill="none" 
          stroke="white" stroke-width="2" opacity="0.4"/>
    
    <!-- 类型标签 -->
    <text x="64" y="55" font-family="Arial, sans-serif" font-size="20" 
          fill="white" text-anchor="middle" font-weight="bold">
        ${type}
    </text>
    
    <!-- 品质标签 -->
    <text x="64" y="85" font-family="Arial, sans-serif" font-size="14" 
          fill="white" text-anchor="middle" opacity="0.8">
        ${rarityLabels[rarity] || rarity}
    </text>
</svg>`;
    return svg;
}

// 主生成逻辑
console.log('🎨 Starting placeholder art generation...\n');

// 1. 生成角色占位图
console.log('Generating character placeholders...');
characters.forEach(char => {
    ['portrait', 'full', 'awaken'].forEach(type => {
        const svg = generateCharacterPlaceholder(char, type);
        const filename = path.join(__dirname, '..', 'assets/resources/images/cards', 
            `${char.id}_${type}.svg`);
        fs.writeFileSync(filename, svg);
        console.log(`  ✓ ${char.id}_${type}.svg`);
    });
});

// 2. 生成技能图标
console.log('\nGenerating skill icons...');
const skills = [
    { name: '炎斩', color: '#E74C3C' },
    { name: '红莲', color: '#C0392B' },
    { name: '清音', color: '#3498DB' },
    { name: '回春', color: '#1ABC9C' },
    { name: '风刃', color: '#2ECC71' },
    { name: '盾击', color: '#F39C12' },
    { name: '烛照', color: '#F1C40F' },
    { name: '暗影', color: '#8E44AD' },
    { name: '治疗', color: '#1ABC9C' },
    { name: '护盾', color: '#3498DB' },
    { name: '暴击', color: '#E74C3C' },
    { name: '闪避', color: '#2ECC71' }
];
skills.forEach((skill, i) => {
    const svg = generateSkillIcon(skill.name, skill.color);
    const filename = path.join(__dirname, '..', 'assets/resources/images/skills', 
        `skill_${i + 1}.svg`);
    fs.writeFileSync(filename, svg);
    console.log(`  ✓ skill_${i + 1}.svg (${skill.name})`);
});

// 3. 生成UI按钮
console.log('\nGenerating UI buttons...');
const buttons = [
    { name: '开始游戏', color: '#E74C3C', primary: true },
    { name: '确认', color: '#27AE60', primary: true },
    { name: '取消', color: '#636E72', primary: false },
    { name: '返回', color: '#636E72', primary: false },
    { name: '召唤', color: '#9B59B6', primary: true },
    { name: '升级', color: '#F39C12', primary: true }
];
buttons.forEach((btn, i) => {
    const svg = generateUIButton(btn.name, btn.color, btn.primary);
    const filename = path.join(__dirname, '..', 'assets/resources/images/ui', 
        `btn_${i + 1}.svg`);
    fs.writeFileSync(filename, svg);
    console.log(`  ✓ btn_${i + 1}.svg (${btn.name})`);
});

// 4. 生成背景图
console.log('\nGenerating backgrounds...');
const backgrounds = [
    { name: '主城', c1: '#2C3E50', c2: '#34495E' },
    { name: '探险', c1: '#27AE60', c2: '#2C3E50' },
    { name: '爬塔', c1: '#8E44AD', c2: '#2C3E50' },
    { name: '战斗', c1: '#C0392B', c2: '#2C3E50' },
    { name: '抽卡', c1: '#F39C12', c2: '#8E44AD' }
];
backgrounds.forEach((bg, i) => {
    const svg = generateBackground(bg.name, bg.c1, bg.c2);
    const filename = path.join(__dirname, '..', 'assets/resources/images/backgrounds', 
        `bg_${i + 1}.svg`);
    fs.writeFileSync(filename, svg);
    console.log(`  ✓ bg_${i + 1}.svg (${bg.name})`);
});

// 5. 生成图标
console.log('\nGenerating icons...');
const icons = [
    { name: '金币', color: '#F1C40F' },
    { name: '魂晶', color: '#3498DB' },
    { name: '经验', color: '#9B59B6' },
    { name: '能量', color: '#E74C3C' },
    { name: '生命', color: '#E74C3C' },
    { name: '攻击', color: '#E67E22' },
    { name: '防御', color: '#3498DB' },
    { name: '速度', color: '#2ECC71' },
    { name: '火', color: '#E74C3C' },
    { name: '水', color: '#3498DB' },
    { name: '风', color: '#2ECC71' },
    { name: '土', color: '#F39C12' },
    { name: '光', color: '#F1C40F' },
    { name: '暗', color: '#8E44AD' }
];
icons.forEach((icon, i) => {
    const svg = generateIcon(icon.name, icon.color);
    const filename = path.join(__dirname, '..', 'assets/resources/images/icons', 
        `icon_${i + 1}.svg`);
    fs.writeFileSync(filename, svg);
    console.log(`  ✓ icon_${i + 1}.svg (${icon.name})`);
});

// 6. 生成装备图标
console.log('\nGenerating equipment icons...');
const equipmentTypes = ['武器', '头盔', '护甲', '护腿', '饰品', '戒指'];
const rarities = [
    { name: 'common', color: '#95A5A6' },
    { name: 'rare', color: '#3498DB' },
    { name: 'epic', color: '#9B59B6' },
    { name: 'legend', color: '#F1C40F' }
];
equipmentTypes.forEach((type, ti) => {
    rarities.forEach((rarity, ri) => {
        const svg = generateEquipmentIcon(type, rarity.name, rarity.color);
        const filename = path.join(__dirname, '..', 'assets/resources/images/equipment', 
            `eq_${ti + 1}_${rarity.name}.svg`);
        fs.writeFileSync(filename, svg);
        console.log(`  ✓ eq_${ti + 1}_${rarity.name}.svg (${type}-${rarity.name})`);
    });
});

// 生成资源清单文件
const resourceList = {
    characters: characters.length * 3,
    skills: skills.length,
    buttons: buttons.length,
    backgrounds: backgrounds.length,
    icons: icons.length,
    equipment: equipmentTypes.length * rarities.length,
    total: 0
};
resourceList.total = Object.values(resourceList).reduce((a, b) => a + b, 0) - resourceList.total;

fs.writeFileSync(
    path.join(__dirname, '..', 'assets/resources/images/_resource_list.json'),
    JSON.stringify(resourceList, null, 2)
);

console.log('\n✅ Placeholder art generation complete!');
console.log(`📊 Total: ${resourceList.total} SVG files generated`);
console.log('\nNext steps:');
console.log('  1. Convert SVG to PNG using tools like "svgexport" or "sharp"');
console.log('  2. Or use SVG directly in Cocos Creator with SVG support');
console.log('  3. Replace with real AI-generated art when ready');
