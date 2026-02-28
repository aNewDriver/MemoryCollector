/**
 * 本地化/多语言系统
 * 支持多种语言的文本管理
 */

export enum Language {
    ZH_CN = 'zh_CN',   // 简体中文
    ZH_TW = 'zh_TW',   // 繁体中文
    EN = 'en',         // 英文
    JA = 'ja',         // 日文
    KO = 'ko',         // 韩文
    FR = 'fr',         // 法文
    DE = 'de',         // 德文
    ES = 'es',         // 西班牙文
    PT = 'pt',         // 葡萄牙文
    RU = 'ru'          // 俄文
}

export interface LocalizationData {
    key: string;
    translations: { [lang in Language]?: string };
    context?: string;  // 上下文说明（给翻译者）
}

export class LocalizationSystem {
    private currentLanguage: Language = Language.ZH_CN;
    private translations: Map<string, LocalizationData> = new Map();
    private fallbackLanguage: Language = Language.ZH_CN;
    
    // 货币/数字格式化
    private numberFormats: { [lang in Language]?: Intl.NumberFormat } = {};
    private dateFormats: { [lang in Language]?: Intl.DateTimeFormat } = {};
    
    constructor() {
        this.initializeFormats();
        this.loadDefaultTranslations();
    }
    
    private initializeFormats(): void {
        Object.values(Language).forEach(lang => {
            this.numberFormats[lang] = new Intl.NumberFormat(lang.replace('_', '-'));
            this.dateFormats[lang] = new Intl.DateTimeFormat(lang.replace('_', '-'), {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        });
    }
    
    private loadDefaultTranslations(): void {
        // 基础UI文本
        const defaults: LocalizationData[] = [
            {
                key: 'ui.common.ok',
                translations: {
                    [Language.ZH_CN]: '确定',
                    [Language.ZH_TW]: '確定',
                    [Language.EN]: 'OK',
                    [Language.JA]: 'OK',
                    [Language.KO]: '확인'
                }
            },
            {
                key: 'ui.common.cancel',
                translations: {
                    [Language.ZH_CN]: '取消',
                    [Language.ZH_TW]: '取消',
                    [Language.EN]: 'Cancel',
                    [Language.JA]: 'キャンセル',
                    [Language.KO]: '취소'
                }
            },
            {
                key: 'ui.common.confirm',
                translations: {
                    [Language.ZH_CN]: '确认',
                    [Language.ZH_TW]: '確認',
                    [Language.EN]: 'Confirm',
                    [Language.JA]: '確認',
                    [Language.KO]: '확인'
                }
            },
            {
                key: 'ui.battle.attack',
                translations: {
                    [Language.ZH_CN]: '攻击',
                    [Language.ZH_TW]: '攻擊',
                    [Language.EN]: 'Attack',
                    [Language.JA]: '攻撃',
                    [Language.KO]: '공격'
                }
            },
            {
                key: 'ui.battle.defense',
                translations: {
                    [Language.ZH_CN]: '防御',
                    [Language.ZH_TW]: '防禦',
                    [Language.EN]: 'Defense',
                    [Language.JA]: '防御',
                    [Language.KO]: '방어'
                }
            },
            {
                key: 'ui.battle.hp',
                translations: {
                    [Language.ZH_CN]: '生命值',
                    [Language.ZH_TW]: '生命值',
                    [Language.EN]: 'HP',
                    [Language.JA]: 'HP',
                    [Language.KO]: 'HP'
                }
            },
            {
                key: 'ui.card.level',
                translations: {
                    [Language.ZH_CN]: '等级',
                    [Language.ZH_TW]: '等級',
                    [Language.EN]: 'Level',
                    [Language.JA]: 'レベル',
                    [Language.KO]: '레벨'
                }
            },
            {
                key: 'ui.card.rarity.common',
                translations: {
                    [Language.ZH_CN]: '普通',
                    [Language.ZH_TW]: '普通',
                    [Language.EN]: 'Common',
                    [Language.JA]: 'コモン',
                    [Language.KO]: '일반'
                }
            },
            {
                key: 'ui.card.rarity.rare',
                translations: {
                    [Language.ZH_CN]: '稀有',
                    [Language.ZH_TW]: '稀有',
                    [Language.EN]: 'Rare',
                    [Language.JA]: 'レア',
                    [Language.KO]: '레어'
                }
            },
            {
                key: 'ui.card.rarity.epic',
                translations: {
                    [Language.ZH_CN]: '史诗',
                    [Language.ZH_TW]: '史詩',
                    [Language.EN]: 'Epic',
                    [Language.JA]: 'エピック',
                    [Language.KO]: '에픽'
                }
            },
            {
                key: 'ui.card.rarity.legendary',
                translations: {
                    [Language.ZH_CN]: '传说',
                    [Language.ZH_TW]: '傳說',
                    [Language.EN]: 'Legendary',
                    [Language.JA]: 'レジェンド',
                    [Language.KO]: '전설'
                }
            },
            {
                key: 'ui.gacha.summon',
                translations: {
                    [Language.ZH_CN]: '召唤',
                    [Language.ZH_TW]: '召喚',
                    [Language.EN]: 'Summon',
                    [Language.JA]: '召喚',
                    [Language.KO]: '소환'
                }
            },
            {
                key: 'ui.gacha.ten_summon',
                translations: {
                    [Language.ZH_CN]: '十连召唤',
                    [Language.ZH_TW]: '十連召喚',
                    [Language.EN]: '10x Summon',
                    [Language.JA]: '10連召喚',
                    [Language.KO]: '10연속 소환'
                }
            }
        ];
        
        defaults.forEach(d => this.translations.set(d.key, d));
    }
    
    // 设置当前语言
    public setLanguage(lang: Language): void {
        this.currentLanguage = lang;
        console.log(`[Localization] Language set to ${lang}`);
    }
    
    // 获取当前语言
    public getLanguage(): Language {
        return this.currentLanguage;
    }
    
    // 获取文本
    public get(key: string, params?: Record<string, string>): string {
        const data = this.translations.get(key);
        if (!data) {
            console.warn(`[Localization] Missing translation key: ${key}`);
            return key;
        }
        
        let text = data.translations[this.currentLanguage] || 
                   data.translations[this.fallbackLanguage] || 
                   key;
        
        // 替换参数
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, v);
            });
        }
        
        return text;
    }
    
    // 批量获取
    public getMany(keys: string[]): Record<string, string> {
        const result: Record<string, string> = {};
        keys.forEach(key => {
            result[key] = this.get(key);
        });
        return result;
    }
    
    // 添加/更新翻译
    public addTranslation(data: LocalizationData): void {
        this.translations.set(data.key, data);
    }
    
    // 批量添加
    public addTranslations(dataList: LocalizationData[]): void {
        dataList.forEach(d => this.addTranslation(d));
    }
    
    // 从JSON加载
    public loadFromJSON(json: string): void {
        try {
            const data: LocalizationData[] = JSON.parse(json);
            this.addTranslations(data);
        } catch (e) {
            console.error('[Localization] Failed to load JSON:', e);
        }
    }
    
    // 导出为JSON
    public exportToJSON(): string {
        const data = Array.from(this.translations.values());
        return JSON.stringify(data, null, 2);
    }
    
    // 格式化数字
    public formatNumber(num: number): string {
        const formatter = this.numberFormats[this.currentLanguage];
        return formatter ? formatter.format(num) : num.toString();
    }
    
    // 格式化日期
    public formatDate(timestamp: number): string {
        const formatter = this.dateFormats[this.currentLanguage];
        return formatter ? formatter.format(new Date(timestamp)) : new Date(timestamp).toLocaleDateString();
    }
    
    // 获取支持的语言列表
    public getSupportedLanguages(): { code: Language; name: string; nativeName: string }[] {
        return [
            { code: Language.ZH_CN, name: 'Simplified Chinese', nativeName: '简体中文' },
            { code: Language.ZH_TW, name: 'Traditional Chinese', nativeName: '繁體中文' },
            { code: Language.EN, name: 'English', nativeName: 'English' },
            { code: Language.JA, name: 'Japanese', nativeName: '日本語' },
            { code: Language.KO, name: 'Korean', nativeName: '한국어' },
            { code: Language.FR, name: 'French', nativeName: 'Français' },
            { code: Language.DE, name: 'German', nativeName: 'Deutsch' },
            { code: Language.ES, name: 'Spanish', nativeName: 'Español' },
            { code: Language.PT, name: 'Portuguese', nativeName: 'Português' },
            { code: Language.RU, name: 'Russian', nativeName: 'Русский' }
        ];
    }
    
    // 检查是否支持该语言
    public isLanguageSupported(lang: string): boolean {
        return Object.values(Language).includes(lang as Language);
    }
}

// 单例
export const localizationSystem = new LocalizationSystem();
