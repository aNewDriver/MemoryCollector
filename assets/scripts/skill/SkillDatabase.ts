/**
 * SkillDatabase
 * 技能数据库
 * 管理所有技能的加载和查询
 */

import { SkillData, EffectType, TargetType } from '../data/CardData';

// 技能数据库（运行时加载）
let skillDatabase: Map<string, SkillData> = new Map();

// 内置技能数据（作为后备）
const builtinSkills: SkillData[] = [
    // ========== 基础攻击技能 ==========
    {
        id: 'skill_normal_atk',
        name: '普通攻击',
        description: '对单个敌人造成100%攻击力的伤害',
        icon: 'textures/skills/normal_atk',
        cost: 0,
        cooldown: 0,
        effects: [
            {
                type: EffectType.DAMAGE,
                target: TargetType.SINGLE_ENEMY,
                value: 100,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'attack'
    },
    {
        id: 'skill_heavy_strike',
        name: '重击',
        description: '对单个敌人造成150%攻击力的伤害',
        icon: 'textures/skills/heavy_strike',
        cost: 20,
        cooldown: 2,
        effects: [
            {
                type: EffectType.DAMAGE,
                target: TargetType.SINGLE_ENEMY,
                value: 150,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'skill_cast'
    },
    
    // ========== 治疗技能 ==========
    {
        id: 'skill_heal',
        name: '治愈之光',
        description: '恢复单体友方150%攻击力的生命值',
        icon: 'textures/skills/heal',
        cost: 30,
        cooldown: 2,
        effects: [
            {
                type: EffectType.HEAL,
                target: TargetType.SINGLE_ALLY,
                value: 150,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'heal'
    },
    {
        id: 'skill_group_heal',
        name: '群体治疗',
        description: '恢复全体友方80%攻击力的生命值',
        icon: 'textures/skills/group_heal',
        cost: 50,
        cooldown: 3,
        effects: [
            {
                type: EffectType.HEAL,
                target: TargetType.ALL_ALLIES,
                value: 80,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'heal'
    },
    
    // ========== 群体攻击技能 ==========
    {
        id: 'skill_fireball',
        name: '火球术',
        description: '对全体敌人造成80%攻击力的火属性伤害',
        icon: 'textures/skills/fireball',
        cost: 40,
        cooldown: 3,
        effects: [
            {
                type: EffectType.DAMAGE,
                target: TargetType.ALL_ENEMIES,
                value: 80,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'fireball'
    },
    {
        id: 'skill_blizzard',
        name: '暴风雪',
        description: '对全体敌人造成100%攻击力的水属性伤害',
        icon: 'textures/skills/blizzard',
        cost: 50,
        cooldown: 3,
        effects: [
            {
                type: EffectType.DAMAGE,
                target: TargetType.ALL_ENEMIES,
                value: 100,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'blizzard'
    },
    
    // ========== 增益技能 ==========
    {
        id: 'skill_atk_buff',
        name: '战意沸腾',
        description: '提升单体友方30%攻击力，持续2回合',
        icon: 'textures/skills/atk_buff',
        cost: 25,
        cooldown: 3,
        effects: [
            {
                type: EffectType.BUFF_ATK,
                target: TargetType.SINGLE_ALLY,
                value: 30,
                duration: 2,
                chance: 100
            }
        ],
        animation: 'buff'
    },
    {
        id: 'skill_def_buff',
        name: '钢铁意志',
        description: '提升全体友方20%防御力，持续2回合',
        icon: 'textures/skills/def_buff',
        cost: 30,
        cooldown: 3,
        effects: [
            {
                type: EffectType.BUFF_DEF,
                target: TargetType.ALL_ALLIES,
                value: 20,
                duration: 2,
                chance: 100
            }
        ],
        animation: 'buff'
    },
    {
        id: 'skill_shield',
        name: '护盾术',
        description: '为目标添加相当于施法者200%攻击力的护盾',
        icon: 'textures/skills/shield',
        cost: 35,
        cooldown: 3,
        effects: [
            {
                type: EffectType.SHIELD,
                target: TargetType.SINGLE_ALLY,
                value: 200,
                duration: 2,
                chance: 100
            }
        ],
        animation: 'shield'
    },
    
    // ========== 减益技能 ==========
    {
        id: 'skill_def_debuff',
        name: '破甲',
        description: '降低目标50%防御力，持续2回合',
        icon: 'textures/skills/def_debuff',
        cost: 25,
        cooldown: 3,
        effects: [
            {
                type: EffectType.DEBUFF_DEF,
                target: TargetType.SINGLE_ENEMY,
                value: 50,
                duration: 2,
                chance: 100
            }
        ],
        animation: 'debuff'
    },
    {
        id: 'skill_atk_debuff',
        name: '虚弱',
        description: '降低全体敌人20%攻击力，持续2回合',
        icon: 'textures/skills/atk_debuff',
        cost: 35,
        cooldown: 3,
        effects: [
            {
                type: EffectType.DEBUFF_ATK,
                target: TargetType.ALL_ENEMIES,
                value: 20,
                duration: 2,
                chance: 100
            }
        ],
        animation: 'debuff'
    },
    
    // ========== 持续伤害技能 ==========
    {
        id: 'skill_burn',
        name: '燃烧',
        description: '使目标燃烧，每回合受到施法者50%攻击力的伤害，持续3回合',
        icon: 'textures/skills/burn',
        cost: 30,
        cooldown: 2,
        effects: [
            {
                type: EffectType.BURN,
                target: TargetType.SINGLE_ENEMY,
                value: 50,
                duration: 3,
                chance: 100
            }
        ],
        animation: 'burn'
    },
    {
        id: 'skill_poison',
        name: '剧毒',
        description: '使目标中毒，每回合受到施法者30%攻击力的伤害，持续5回合',
        icon: 'textures/skills/poison',
        cost: 25,
        cooldown: 2,
        effects: [
            {
                type: EffectType.POISON,
                target: TargetType.SINGLE_ENEMY,
                value: 30,
                duration: 5,
                chance: 100
            }
        ],
        animation: 'poison'
    },
    
    // ========== 控制技能 ==========
    {
        id: 'skill_stun',
        name: '眩晕打击',
        description: '对单个敌人造成120%伤害，50%概率眩晕1回合',
        icon: 'textures/skills/stun',
        cost: 40,
        cooldown: 4,
        effects: [
            {
                type: EffectType.DAMAGE,
                target: TargetType.SINGLE_ENEMY,
                value: 120,
                duration: 0,
                chance: 100
            },
            {
                type: EffectType.STUN,
                target: TargetType.SINGLE_ENEMY,
                value: 0,
                duration: 1,
                chance: 50
            }
        ],
        animation: 'skill_cast'
    },
    
    // ========== 特殊技能 ==========
    {
        id: 'skill_cleanse',
        name: '净化',
        description: '移除目标所有减益效果，并恢复20%生命值',
        icon: 'textures/skills/cleanse',
        cost: 30,
        cooldown: 3,
        effects: [
            {
                type: EffectType.CLEANSE,
                target: TargetType.SINGLE_ALLY,
                value: 0,
                duration: 0,
                chance: 100
            },
            {
                type: EffectType.HEAL,
                target: TargetType.SINGLE_ALLY,
                value: 20,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'heal'
    },
    {
        id: 'skill_dispel',
        name: '驱散',
        description: '驱散目标所有增益效果',
        icon: 'textures/skills/dispel',
        cost: 25,
        cooldown: 3,
        effects: [
            {
                type: EffectType.DISPEL,
                target: TargetType.SINGLE_ENEMY,
                value: 0,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'debuff'
    },
    
    // ========== 高级技能 ==========
    {
        id: 'skill_execute',
        name: '处决',
        description: '对生命值低于30%的敌人造成300%伤害，否则造成100%伤害',
        icon: 'textures/skills/execute',
        cost: 60,
        cooldown: 5,
        effects: [
            {
                type: EffectType.DAMAGE,
                target: TargetType.SINGLE_ENEMY,
                value: 300, // 实际伤害由战斗系统根据目标血量判断
                duration: 0,
                chance: 100
            }
        ],
        animation: 'skill_cast'
    },
    {
        id: 'skill_revive',
        name: '复活术',
        description: '复活一名阵亡友方，恢复30%生命值',
        icon: 'textures/skills/revive',
        cost: 80,
        cooldown: 6,
        effects: [
            {
                type: EffectType.REVIVE,
                target: TargetType.SINGLE_ALLY,
                value: 30,
                duration: 0,
                chance: 100
            }
        ],
        animation: 'heal'
    },
    {
        id: 'skill_counter',
        name: '反击姿态',
        description: '进入反击姿态，持续2回合，受到攻击时反击造成80%伤害',
        icon: 'textures/skills/counter',
        cost: 30,
        cooldown: 3,
        effects: [
            {
                type: EffectType.BUFF_DEF, // 使用buff来标记反击状态
                target: TargetType.SELF,
                value: 0,
                duration: 2,
                chance: 100
            }
        ],
        animation: 'buff'
    },
    {
        id: 'skill_life_steal',
        name: '生命偷取',
        description: '对单个敌人造成120%伤害，并恢复造成伤害50%的生命值',
        icon: 'textures/skills/life_steal',
        cost: 35,
        cooldown: 2,
        effects: [
            {
                type: EffectType.DAMAGE,
                target: TargetType.SINGLE_ENEMY,
                value: 120,
                duration: 0,
                chance: 100
            }
            // 治疗效果在战斗系统中根据伤害计算
        ],
        animation: 'skill_cast'
    },
    {
        id: 'skill_combo',
        name: '连击',
        description: '对单个敌人连续攻击3次，每次造成60%伤害',
        icon: 'textures/skills/combo',
        cost: 45,
        cooldown: 3,
        effects: [
            {
                type: EffectType.DAMAGE,
                target: TargetType.SINGLE_ENEMY,
                value: 180, // 60% * 3
                duration: 0,
                chance: 100
            }
        ],
        animation: 'skill_cast'
    },
    {
        id: 'skill_rage',
        name: '狂暴',
        description: '攻击力提升50%，防御力降低30%，持续3回合',
        icon: 'textures/skills/rage',
        cost: 30,
        cooldown: 4,
        effects: [
            {
                type: EffectType.BUFF_ATK,
                target: TargetType.SELF,
                value: 50,
                duration: 3,
                chance: 100
            },
            {
                type: EffectType.DEBUFF_DEF,
                target: TargetType.SELF,
                value: 30,
                duration: 3,
                chance: 100
            }
        ],
        animation: 'buff'
    }
];

/**
 * 初始化技能数据库
 */
export function initSkillDatabase(): void {
    skillDatabase.clear();
    
    // 加载内置技能
    for (const skill of builtinSkills) {
        skillDatabase.set(skill.id, skill);
    }
    
    console.log(`[SkillDatabase] 已加载 ${skillDatabase.size} 个技能`);
}

/**
 * 获取技能数据
 */
export function getSkill(skillId: string): SkillData | undefined {
    return skillDatabase.get(skillId);
}

/**
 * 获取所有技能
 */
export function getAllSkills(): SkillData[] {
    return Array.from(skillDatabase.values());
}

/**
 * 按类型获取技能
 */
export function getSkillsByType(effectType: EffectType): SkillData[] {
    return getAllSkills().filter(skill => 
        skill.effects.some(e => e.type === effectType)
    );
}

/**
 * 注册新技能
 */
export function registerSkill(skill: SkillData): void {
    skillDatabase.set(skill.id, skill);
}

/**
 * 批量注册技能
 */
export function registerSkills(skills: SkillData[]): void {
    for (const skill of skills) {
        skillDatabase.set(skill.id, skill);
    }
}

/**
 * 从JSON加载技能数据
 */
export function loadSkillsFromJSON(jsonData: string): void {
    try {
        const skills: SkillData[] = JSON.parse(jsonData);
        registerSkills(skills);
        console.log(`[SkillDatabase] 从JSON加载了 ${skills.length} 个技能`);
    } catch (e) {
        console.error('[SkillDatabase] 加载技能JSON失败:', e);
    }
}

/**
 * 导出技能数据到JSON
 */
export function exportSkillsToJSON(): string {
    const skills = getAllSkills();
    return JSON.stringify(skills, null, 2);
}

/**
 * 获取技能数量
 */
export function getSkillCount(): number {
    return skillDatabase.size;
}

/**
 * 检查技能是否存在
 */
export function hasSkill(skillId: string): boolean {
    return skillDatabase.has(skillId);
}

/**
 * 删除技能
 */
export function removeSkill(skillId: string): boolean {
    return skillDatabase.delete(skillId);
}

// 自动初始化
initSkillDatabase();
