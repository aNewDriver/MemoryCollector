/**
 * 敌人数据库与AI系统
 * 多种敌人类型、智能行为模式
 */

// 敌人类型
const ENEMY_TYPE = {
    NORMAL: 'normal',       // 普通怪
    ELITE: 'elite',         // 精英怪
    BOSS: 'boss'           // Boss
};

// AI行为模式
const AI_BEHAVIOR = {
    AGGRESSIVE: 'aggressive',   // 激进：优先攻击
    DEFENSIVE: 'defensive',     // 防御：优先治疗/护盾
    BALANCED: 'balanced',       // 平衡：随机选择
    CLEVER: 'clever'            // 聪明：根据局势判断
};

// 敌人数据库
const ENEMY_DATABASE = {
    // 第一章 - 梦境入口
    dream_entrance: [
        {
            id: 'memory_slime',
            name: '记忆史莱姆',
            icon: '💧',
            element: 'water',
            type: ENEMY_TYPE.NORMAL,
            hp: 300,
            atk: 40,
            def: 20,
            spd: 50,
            behavior: AI_BEHAVIOR.BALANCED,
            skills: [
                { name: '撞击', damage: 1.0, cd: 0 }
            ],
            description: '由零散记忆凝聚而成的低级怪物'
        },
        {
            id: 'lost_wisp',
            name: '迷失光点',
            icon: '✨',
            element: 'light',
            type: ENEMY_TYPE.NORMAL,
            hp: 200,
            atk: 50,
            def: 10,
            spd: 80,
            behavior: AI_BEHAVIOR.AGGRESSIVE,
            skills: [
                { name: '闪光', damage: 1.2, cd: 2 }
            ],
            description: '失去归属的记忆碎片'
        }
    ],
    
    // 第一章 - 精英怪
    dream_elite: [
        {
            id: 'memory_guardian',
            name: '记忆守卫',
            icon: '🛡️',
            element: 'earth',
            type: ENEMY_TYPE.ELITE,
            hp: 800,
            atk: 70,
            def: 60,
            spd: 40,
            behavior: AI_BEHAVIOR.DEFENSIVE,
            skills: [
                { name: '盾击', damage: 1.0, cd: 0 },
                { name: '守护', effect: 'shield', value: 200, cd: 3 }
            ],
            description: '守护重要记忆的精英怪物'
        },
        {
            id: 'nightmare_wisp',
            name: '噩梦光点',
            icon: '👻',
            element: 'dark',
            type: ENEMY_TYPE.ELITE,
            hp: 600,
            atk: 90,
            def: 30,
            spd: 70,
            behavior: AI_BEHAVIOR.AGGRESSIVE,
            skills: [
                { name: '恐惧', damage: 1.3, cd: 2 },
                { name: '吞噬', effect: 'heal', value: 0.2, cd: 4 }
            ],
            description: '被负面情绪污染的记忆'
        }
    ],
    
    // 第一章 - Boss
    dream_boss: [
        {
            id: 'forgetting_guardian',
            name: '遗忘守护者',
            icon: '👹',
            element: 'dark',
            type: ENEMY_TYPE.BOSS,
            hp: 2000,
            atk: 100,
            def: 80,
            spd: 50,
            behavior: AI_BEHAVIOR.CLEVER,
            skills: [
                { name: '记忆抹除', damage: 1.5, target: 'all', cd: 3, effect: 'clear_buffs' },
                { name: '遗忘之触', damage: 1.2, cd: 1 },
                { name: '吞噬记忆', effect: 'heal', value: 0.3, cd: 4 }
            ],
            description: '由被遗忘的痛苦记忆凝聚而成的强大存在',
            introDialogue: [
                { speaker: 'boss', text: '又是回收者...你们这些窃取记忆的小偷！' },
                { speaker: 'player', text: '不，我是来拯救这些记忆的。' },
                { speaker: 'boss', text: '可笑！记忆一旦破碎，就永远无法复原！' }
            ],
            defeatDialogue: [
                { speaker: 'boss', text: '不可能...你竟然...' },
                { speaker: 'player', text: '记忆的力量，来源于想要记住的意志。' }
            ]
        }
    ],
    
    // 第二章 - 悲伤沼泽
    sorrow_swamp: [
        {
            id: 'sorrow_slime',
            name: '悲伤泥怪',
            icon: '💦',
            element: 'water',
            type: ENEMY_TYPE.NORMAL,
            hp: 400,
            atk: 50,
            def: 40,
            spd: 30,
            behavior: AI_BEHAVIOR.DEFENSIVE,
            skills: [
                { name: '哭泣', damage: 0.8, cd: 0, effect: 'debuff_atk' }
            ],
            description: '被悲伤情绪具现化的怪物'
        },
        {
            id: 'lost_soul',
            name: '迷失灵魂',
            icon: '👤',
            element: 'dark',
            type: ENEMY_TYPE.NORMAL,
            hp: 350,
            atk: 60,
            def: 25,
            spd: 60,
            behavior: AI_BEHAVIOR.AGGRESSIVE,
            skills: [
                { name: '抓挠', damage: 1.1, cd: 0 }
            ],
            description: '徘徊不去的失落灵魂'
        }
    ],
    
    // 第二章 - 精英
    sorrow_elite: [
        {
            id: 'grief_knight',
            name: '哀伤骑士',
            icon: '⚔️',
            element: 'metal',
            type: ENEMY_TYPE.ELITE,
            hp: 1000,
            atk: 85,
            def: 70,
            spd: 45,
            behavior: AI_BEHAVIOR.BALANCED,
            skills: [
                { name: '重击', damage: 1.4, cd: 2 },
                { name: '哀伤光环', effect: 'debuff_def', value: 0.2, cd: 3 }
            ],
            description: '被悲伤吞噬的骑士灵魂'
        }
    ],

    // 第二章 - Boss
    sorrow_boss: [
        {
            id: 'sorrow_queen',
            name: '悲伤女王',
            icon: '👑',
            element: 'water',
            type: ENEMY_TYPE.BOSS,
            hp: 3500,
            atk: 130,
            def: 100,
            spd: 55,
            behavior: AI_BEHAVIOR.CLEVER,
            skills: [
                { name: '悲伤之歌', damage: 1.2, target: 'all', cd: 2, effect: 'debuff_atk_all' },
                { name: '泪之刃', damage: 1.5, cd: 1 },
                { name: '哀伤治愈', effect: 'heal', value: 0.25, target: 'self', cd: 3 },
                { name: '绝望深渊', damage: 1.8, target: 'single', cd: 4, effect: 'silence' }
            ],
            description: '悲伤沼泽的主宰，由千年泪水凝聚而成',
            introDialogue: [
                { speaker: 'boss', text: '哭泣吧...让悲伤吞噬一切...' },
                { speaker: 'player', text: '你的悲伤...源于什么？' },
                { speaker: 'boss', text: '失去...永远无法挽回的失去！' }
            ],
            defeatDialogue: [
                { speaker: 'boss', text: '眼泪...终于流干了...' },
                { speaker: 'player', text: '悲伤不是终点，是新的开始。' }
            ]
        }
    ]
};

// AI控制器
class EnemyAI {
    private enemy: any;
    private behavior: string;
    private turnCount: number = 0;

    constructor(enemyData: any) {
        this.enemy = enemyData;
        this.behavior = enemyData.behavior || AI_BEHAVIOR.BALANCED;
    }

    // 选择行动
    public chooseAction(battleState: any): { skill: any; target: any } {
        this.turnCount++;
        
        const skills = this.enemy.skills || [];
        const availableSkills = skills.filter((s: any) => {
            // 检查冷却
            const cd = s.cd || 0;
            return this.turnCount % (cd + 1) === 0;
        });

        switch (this.behavior) {
            case AI_BEHAVIOR.AGGRESSIVE:
                return this.aggressiveAI(availableSkills, battleState);
            case AI_BEHAVIOR.DEFENSIVE:
                return this.defensiveAI(availableSkills, battleState);
            case AI_BEHAVIOR.CLEVER:
                return this.cleverAI(availableSkills, battleState);
            default:
                return this.balancedAI(availableSkills, battleState);
        }
    }

    // 激进AI - 优先攻击
    private aggressiveAI(skills: any[], battleState: any): { skill: any; target: any } {
        // 优先选择伤害技能
        const attackSkills = skills.filter(s => s.damage);
        if (attackSkills.length > 0) {
            const skill = attackSkills[Math.floor(Math.random() * attackSkills.length)];
            const target = this.selectWeakestTarget(battleState.playerUnits);
            return { skill, target };
        }
        
        // 没有攻击技能就用普攻
        return this.normalAttack(battleState);
    }

    // 防御AI - 优先治疗/护盾
    private defensiveAI(skills: any[], battleState: any): { skill: any; target: any } {
        const enemyUnits = battleState.enemyUnits;
        const lowestHpUnit = this.selectWeakestTarget(enemyUnits);
        
        // 如果血量低于50%，优先治疗
        if (lowestHpUnit && lowestHpUnit.currentHp / lowestHpUnit.maxHp < 0.5) {
            const healSkills = skills.filter(s => s.effect === 'heal');
            if (healSkills.length > 0) {
                return { skill: healSkills[0], target: lowestHpUnit };
            }
        }
        
        // 使用护盾
        const shieldSkills = skills.filter(s => s.effect === 'shield');
        if (shieldSkills.length > 0) {
            return { skill: shieldSkills[0], target: lowestHpUnit };
        }
        
        // 否则攻击
        return this.aggressiveAI(skills, battleState);
    }

    // 聪明AI - 根据局势判断
    private cleverAI(skills: any[], battleState: any): { skill: any; target: any } {
        const playerUnits = battleState.playerUnits;
        const enemyUnits = battleState.enemyUnits;
        
        // 如果敌人有Buff，尝试清除
        const hasBuffs = playerUnits.some((u: any) => u.buffs && u.buffs.length > 0);
        if (hasBuffs) {
            const clearSkills = skills.filter(s => s.effect === 'clear_buffs');
            if (clearSkills.length > 0) {
                return { skill: clearSkills[0], target: playerUnits[0] };
            }
        }
        
        // 如果己方血量危险，治疗
        const dangerUnits = enemyUnits.filter((u: any) => u.currentHp / u.maxHp < 0.3);
        if (dangerUnits.length > 0) {
            const healSkills = skills.filter(s => s.effect === 'heal');
            if (healSkills.length > 0) {
                return { skill: healSkills[0], target: dangerUnits[0] };
            }
        }
        
        // 如果玩家血量低，集火
        const weakPlayer = this.selectWeakestTarget(playerUnits);
        if (weakPlayer && weakPlayer.currentHp / weakPlayer.maxHp < 0.3) {
            const attackSkills = skills.filter(s => s.damage);
            if (attackSkills.length > 0) {
                const strongestSkill = attackSkills.sort((a, b) => (b.damage || 0) - (a.damage || 0))[0];
                return { skill: strongestSkill, target: weakPlayer };
            }
        }
        
        // 默认平衡策略
        return this.balancedAI(skills, battleState);
    }

    // 平衡AI - 随机选择
    private balancedAI(skills: any[], battleState: any): { skill: any; target: any } {
        if (skills.length === 0) {
            return this.normalAttack(battleState);
        }
        
        const skill = skills[Math.floor(Math.random() * skills.length)];
        
        let target;
        if (skill.effect === 'heal' || skill.effect === 'shield') {
            target = this.selectWeakestTarget(battleState.enemyUnits);
        } else {
            target = this.selectRandomTarget(battleState.playerUnits);
        }
        
        return { skill, target };
    }

    // 普攻
    private normalAttack(battleState: any): { skill: any; target: any } {
        return {
            skill: { name: '普攻', damage: 1.0, cd: 0 },
            target: this.selectRandomTarget(battleState.playerUnits)
        };
    }

    // 选择最弱的目标（血量最低）
    private selectWeakestTarget(units: any[]): any {
        if (!units || units.length === 0) return null;
        return units.sort((a, b) => (a.currentHp / a.maxHp) - (b.currentHp / b.maxHp))[0];
    }

    // 随机选择目标
    private selectRandomTarget(units: any[]): any {
        if (!units || units.length === 0) return null;
        return units[Math.floor(Math.random() * units.length)];
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ENEMY_DATABASE, ENEMY_TYPE, AI_BEHAVIOR, EnemyAI };
}
