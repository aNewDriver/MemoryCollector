/**
 * 记忆回收者 - 完整卡牌数据库（旧版占位文件）
 *
 * 原始内容使用了与当前项目不兼容的类型定义（Element / ClassType / Skill 等），
 * 且在 Cocos Creator 3.8 的模块系统下会产生循环引用与运行时错误。
 *
 * 目前项目实际使用的卡牌数据来源于：
 * - CardDatabase.ts
 * - CardDatabaseExtended.ts
 *
 * 为了避免报错，同时不影响现有逻辑，这个文件保留为一个类型安全的占位实现。
 */

import { CardData, ElementType, Rarity } from './CardData';
import { CARD_DATABASE } from './CardDatabase';
import { EXTENDED_CARD_DATABASE } from './CardDatabaseExtended';

// 合并主数据库与扩展数据库，形成一个只读的大数组
export const ALL_CARDS: CardData[] = [
    ...Object.values(CARD_DATABASE),
    ...Object.values(EXTENDED_CARD_DATABASE),
];

export function getCardsByRarity(rarity: Rarity): CardData[] {
    return ALL_CARDS.filter(card => card.rarity === rarity);
}

export function getCardsByElement(element: ElementType): CardData[] {
    return ALL_CARDS.filter(card => card.element === element);
}

export function getCardById(id: string): CardData | undefined {
    return ALL_CARDS.find(card => card.id === id);
}

export default ALL_CARDS;
