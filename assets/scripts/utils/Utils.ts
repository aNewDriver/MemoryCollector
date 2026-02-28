/**
 * 工具函数集合
 */

/**
 * 格式化数字，添加千位分隔符
 */
export function formatNumber(num: number): string {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '亿';
    }
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
}

/**
 * 格式化时间
 */
export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化日期
 */
export function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * 获取倒计时文本
 */
export function getCountdownText(targetTime: number): string {
    const now = Date.now();
    const diff = targetTime - now;
    
    if (diff <= 0) return '00:00:00';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 随机整数 [min, max]
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机浮点数 [min, max)
 */
export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * 从数组中随机选取一个元素
 */
export function randomChoice<T>(arr: T[]): T | null {
    if (arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 从数组中随机选取指定数量的元素
 */
export function randomSample<T>(arr: T[], count: number): T[] {
    if (count >= arr.length) return [...arr];
    
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * 数组乱序（Fisher-Yates算法）
 */
export function shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T;
    
    const cloned = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * 截断文本，添加省略号
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + '…';
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: any;
    return function (...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;
    return function (...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 生成UUID
 */
export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 生成短ID
 */
export function generateShortId(): string {
    return Math.random().toString(36).substring(2, 10);
}

/**
 * 检查对象是否为空
 */
export function isEmptyObject(obj: object): boolean {
    return Object.keys(obj).length === 0;
}

/**
 * 检查是否为空值
 */
export function isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
}

/**
 * 安全获取嵌套对象属性
 */
export function safeGet(obj: any, path: string, defaultValue: any = undefined): any {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result == null || typeof result !== 'object') {
            return defaultValue;
        }
        result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
}

/**
 * 计算两点间距离
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * 将角度转换为弧度
 */
export function degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * 将弧度转换为角度
 */
export function radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
}

/**
 * 限制数值在范围内
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * 判断点是否在矩形内
 */
export function pointInRect(
    px: number, py: number,
    rx: number, ry: number,
    rw: number, rh: number
): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

/**
 * 缓动函数 - 缓入
 */
export function easeIn(t: number): number {
    return t * t;
}

/**
 * 缓动函数 - 缓出
 */
export function easeOut(t: number): number {
    return 1 - (1 - t) * (1 - t);
}

/**
 * 缓动函数 - 缓入缓出
 */
export function easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * 将数字转换为中文数字
 */
export function numberToChinese(num: number): string {
    const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const chineseUnits = ['', '十', '百', '千'];
    
    if (num === 0) return chineseNums[0];
    if (num < 10) return chineseNums[num];
    
    let result = '';
    let unitIndex = 0;
    
    while (num > 0) {
        const digit = num % 10;
        if (digit !== 0) {
            result = chineseNums[digit] + chineseUnits[unitIndex] + result;
        } else if (result.charAt(0) !== chineseNums[0]) {
            result = chineseNums[0] + result;
        }
        num = Math.floor(num / 10);
        unitIndex++;
    }
    
    return result.replace(/零+/g, '零').replace(/零$/, '');
}

/**
 * 颜色插值
 */
export function lerpColor(color1: number, color2: number, t: number): number {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;
    
    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;
    
    const r = Math.round(lerp(r1, r2, t));
    const g = Math.round(lerp(g1, g2, t));
    const b = Math.round(lerp(b1, b2, t));
    
    return (r << 16) | (g << 8) | b;
}

/**
 * 按权重随机选择
 */
export function weightedRandom<T>(items: { item: T; weight: number }[]): T | null {
    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const { item, weight } of items) {
        random -= weight;
        if (random <= 0) return item;
    }
    
    return items[items.length - 1]?.item || null;
}
