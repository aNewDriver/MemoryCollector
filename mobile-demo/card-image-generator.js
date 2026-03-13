/**
 * 卡牌图片生成器
 * 为每张卡牌生成精美的SVG占位图
 */

const CardImageGenerator = {
    // 元素颜色映射
    elementColors: {
        'gold': { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', icon: '⚡' },
        'wood': { bg: 'linear-gradient(135deg, #228B22 0%, #006400 100%)', icon: '🌿' },
        'water': { bg: 'linear-gradient(135deg, #1E90FF 0%, #00008B 100%)', icon: '💧' },
        'fire': { bg: 'linear-gradient(135deg, #FF4500 0%, #8B0000 100%)', icon: '🔥' },
        'earth': { bg: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)', icon: '🪨' },
        'light': { bg: 'linear-gradient(135deg, #FFFACD 0%, #FFD700 100%)', icon: '✨' },
        'dark': { bg: 'linear-gradient(135deg, #483D8B 0%, #191970 100%)', icon: '🌑' }
    },
    
    // 稀有度样式
    rarityStyles: {
        'N': { border: '#888', glow: 'none', font: '14px' },
        'R': { border: '#4a9eff', glow: '0 0 10px #4a9eff', font: '14px' },
        'SR': { border: '#a855f7', glow: '0 0 15px #a855f7', font: '15px' },
        'SSR': { border: '#ffd700', glow: '0 0 20px #ffd700', font: '16px' },
        'UR': { border: '#ff0000', glow: '0 0 25px #ff0000', font: '18px' }
    },
    
    // 生成卡牌SVG
    generateSVG(card) {
        const element = card.element || 'earth';
        const rarity = card.rarity || 'N';
        const colors = this.elementColors[element] || this.elementColors.earth;
        const rarityStyle = this.rarityStyles[rarity] || this.rarityStyles.N;
        
        return `
            <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
                    </linearGradient>
                    <linearGradient id="elementBg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${this.getElementColor(element, 0)}" />
                        <stop offset="100%" style="stop-color:${this.getElementColor(element, 1)}" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- 卡牌背景 -->
                <rect width="200" height="300" fill="url(#cardBg)" stroke="${rarityStyle.border}" 
                      stroke-width="4" rx="12" filter="${rarity !== 'N' ? 'url(#glow)' : ''}"/>
                
                <!-- 元素背景圆 -->
                <circle cx="100" cy="100" r="60" fill="url(#elementBg)" opacity="0.3"/>
                
                <!-- 元素图标 -->
                <text x="100" y="110" text-anchor="middle" font-size="60">${colors.icon}</text>
                
                <!-- 稀有度标识 -->
                <text x="100" y="30" text-anchor="middle" fill="${rarityStyle.border}" 
                      font-size="16" font-weight="bold" font-family="Arial">${rarity}</text>
                
                <!-- 卡牌名称 -->
                <text x="100" y="200" text-anchor="middle" fill="#fff" 
                      font-size="${rarityStyle.font}" font-weight="bold" font-family="sans-serif">
                    ${card.name || '未知卡牌'}
                </text>
                
                <!-- 等级和星级 -->
                <text x="100" y="240" text-anchor="middle" fill="#888" 
                      font-size="12" font-family="sans-serif">
                    Lv.${card.level || 1} ${'★'.repeat(card.star || 0)}
                </text>
                
                <!-- 装饰边框线 -->
                <rect x="10" y="10" width="180" height="280" fill="none" 
                      stroke="${rarityStyle.border}" stroke-width="1" opacity="0.5" rx="8"/>
            </svg>
        `;
    },
    
    // 获取元素颜色
    getElementColor(element, index) {
        const colors = {
            'gold': ['#FFD700', '#FFA500'],
            'wood': ['#228B22', '#006400'],
            'water': ['#1E90FF', '#00008B'],
            'fire': ['#FF4500', '#8B0000'],
            'earth': ['#8B4513', '#654321'],
            'light': ['#FFFACD', '#FFD700'],
            'dark': ['#483D8B', '#191970']
        };
        return (colors[element] || colors.earth)[index];
    },
    
    // 生成DataURL
    generateDataURL(card) {
        const svg = this.generateSVG(card);
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        return URL.createObjectURL(blob);
    }
};

// 导出
if (typeof module !== 'undefined') {
    module.exports = CardImageGenerator;
}
