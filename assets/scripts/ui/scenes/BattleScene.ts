/**
 * 战斗场景UI
 * 回合制战斗界面
 */

import { _decorator, Component, Node, Label, Sprite, ProgressBar, animation } from 'cc';
import { BattleSystem, BattleUnit, BattleState, BattleEventType } from '../../battle/BattleSystem';
import { CardInstance } from '../../data/CardData';
import { LevelData } from '../../data/PlayerData';

const { ccclass, property } = _decorator;

@ccclass('BattleScene')
export class BattleScene extends Component {
    
    // 战斗系统实例
    private battleSystem: BattleSystem = new BattleSystem();
    
    // 敌人区域（上方）
    @property(Node)
    private enemyArea: Node | null = null;
    
    // 己方区域（下方）
    @property(Node)
    private playerArea: Node | null = null;
    
    // 战斗信息
    @property(Label)
    private turnLabel: Label | null = null;
    @property(Label)
    private roundLabel: Label | null = null;
    
    // 技能按钮
    @property(Node)
    private skillPanel: Node | null = null;
    @property([Node])
    private skillButtons: Node[] = [];
    
    // 能量条
    @property(ProgressBar)
    private energyBar: ProgressBar | null = null;
    @property(Label)
    private energyLabel: Label | null = null;
    
    // 战斗结果界面
    @property(Node)
    private resultPanel: Node | null = null;
    @property(Label)
    private resultLabel: Label | null = null;
    
    // 单位节点映射
    private unitNodes: Map<string, Node> = new Map();
    private currentLevel: LevelData | null = null;
    
    onLoad() {
        this.registerBattleEvents();
    }
    
    // 开始关卡战斗
    public startLevel(level: LevelData, playerTeam: CardInstance[]) {
        this.currentLevel = level;
        
        // 创建敌方队伍
        const enemyTeam = this.createEnemyTeam(level.enemies);
        
        // 初始化战斗
        this.battleSystem.initBattle(playerTeam, enemyTeam);
        
        // 创建战斗单位UI
        this.createUnitNodes();
        
        this.updateUI();
    }
    
    private createEnemyTeam(enemyConfigs: any[]): CardInstance[] {
        // 根据配置创建敌人卡牌实例
        return enemyConfigs.map(config => {
            // TODO: 根据enemyId获取敌人模板，生成CardInstance
            return {
                instanceId: `enemy_${config.position}`,
                cardId: config.enemyId,
                level: config.level,
                exp: 0,
                ascension: 0,
                skillLevels: { normal: 1, special: 1, passive: 1 },
                affinity: 0,
                affinityLevel: 1,
                awakened: false,
                equipments: [],
                currentStats: {
                    hp: 2000 + config.level * 100,
                    atk: 100 + config.level * 10,
                    def: 50 + config.level * 5,
                    spd: 100,
                    crt: 10,
                    cdmg: 150,
                    acc: 0,
                    res: 10
                }
            } as CardInstance;
        });
    }
    
    private createUnitNodes() {
        this.unitNodes.clear();
        
        const units = this.battleSystem.getAllUnits();
        units.forEach((unit, index) => {
            const node = this.createUnitNode(unit);
            this.unitNodes.set(unit.instanceId, node);
            
            // 根据队伍添加到对应区域
            if (unit.team === 'player') {
                this.playerArea?.addChild(node);
            } else {
                this.enemyArea?.addChild(node);
            }
            
            // 设置位置
            this.setUnitPosition(node, unit.position, unit.team);
        });
    }
    
    private createUnitNode(unit: BattleUnit): Node {
        // TODO: 创建单位节点，包含头像、血条、能量条等
        const node = new Node(`unit_${unit.instanceId}`);
        // ... 初始化节点组件
        return node;
    }
    
    private setUnitPosition(node: Node, position: number, team: string) {
        // 设置单位在战斗区域中的位置
        // 5个位置，0-4分别对应前排到后排
        // TODO: 根据竖屏布局计算具体坐标
    }
    
    private registerBattleEvents() {
        // 回合开始
        this.battleSystem.on(BattleEventType.TURN_START, (data: { turn: number; unit: string }) => {
            this.onTurnStart(data);
        });
        
        // 技能释放
        this.battleSystem.on(BattleEventType.SKILL_CAST, (data: any) => {
            this.onSkillCast(data);
        });
        
        // 伤害
        this.battleSystem.on(BattleEventType.DAMAGE, (data: any) => {
            this.onDamage(data);
        });
        
        // 治疗
        this.battleSystem.on(BattleEventType.HEAL, (data: any) => {
            this.onHeal(data);
        });
        
        // 单位死亡
        this.battleSystem.on(BattleEventType.UNIT_DIE, (data: { unit: string }) => {
            this.onUnitDie(data.unit);
        });
        
        // 战斗结束
        this.battleSystem.on(BattleEventType.BATTLE_END, (data: { result: BattleState }) => {
            this.onBattleEnd(data.result);
        });
    }
    
    private onTurnStart(data: { turn: number; unit: string }) {
        this.updateUI();
        
        const currentUnit = this.battleSystem.getCurrentUnit();
        if (!currentUnit) return;
        
        // 如果是玩家单位，显示技能按钮
        if (currentUnit.team === 'player') {
            this.showSkillPanel(currentUnit);
        } else {
            // 敌人自动行动
            this.scheduleOnce(() => {
                this.battleSystem.executeAutoAction(currentUnit.instanceId);
            }, 1);
        }
    }
    
    private showSkillPanel(unit: BattleUnit) {
        // 显示技能面板
        this.skillPanel?.active = true;
        
        // 更新能量显示
        this.energyBar!.progress = unit.currentEnergy / unit.maxEnergy;
        this.energyLabel!.string = `${unit.currentEnergy}/${unit.maxEnergy}`;
        
        // TODO: 更新技能按钮状态（根据能量判断是否可用）
    }
    
    // 玩家选择技能
    public onSkillClick(skillIndex: number) {
        const currentUnit = this.battleSystem.getCurrentUnit();
        if (!currentUnit || currentUnit.team !== 'player') return;
        
        // TODO: 获取技能ID
        const skillId = 'normal';  // 根据index获取
        
        // 进入目标选择模式
        this.enterTargetSelectMode(skillId);
    }
    
    private enterTargetSelectMode(skillId: string) {
        // 高亮可选目标
        // 等待玩家点击目标
        // 执行技能
    }
    
    private onSkillCast(data: any) {
        // 播放技能动画
        const casterNode = this.unitNodes.get(data.caster);
        if (casterNode) {
            // TODO: 播放技能释放动画
        }
        
        // 显示技能名称
        // TODO: 飘字显示技能名
    }
    
    private onDamage(data: any) {
        const targetNode = this.unitNodes.get(data.target);
        if (!targetNode) return;
        
        // 显示伤害数字
        this.showDamageNumber(targetNode, data.damage);
        
        // 更新血条
        this.updateUnitHp(data.target, data.currentHp);
        
        // 播放受击动画
        // TODO: 播放受击动画
    }
    
    private onHeal(data: any) {
        const targetNode = this.unitNodes.get(data.target);
        if (!targetNode) return;
        
        // 显示治疗数字
        this.showHealNumber(targetNode, data.heal);
        
        // 更新血条
        this.updateUnitHp(data.target, data.currentHp);
    }
    
    private onUnitDie(unitId: string) {
        const node = this.unitNodes.get(unitId);
        if (!node) return;
        
        // 播放死亡动画
        // TODO: 播放死亡动画，然后隐藏或移除节点
    }
    
    private onBattleEnd(result: BattleState) {
        this.resultPanel!.active = true;
        
        switch (result) {
            case BattleState.PLAYER_WIN:
                this.resultLabel!.string = '胜利！';
                this.showRewards();
                break;
            case BattleState.ENEMY_WIN:
                this.resultLabel!.string = '失败...';
                break;
            case BattleState.DRAW:
                this.resultLabel!.string = '平局';
                break;
        }
    }
    
    private showRewards() {
        if (!this.currentLevel) return;
        
        // 显示通关奖励
        const rewards = this.currentLevel.rewards;
        // TODO: 显示奖励面板
    }
    
    private showDamageNumber(node: Node, damage: number) {
        // TODO: 创建飘字动画显示伤害
    }
    
    private showHealNumber(node: Node, heal: number) {
        // TODO: 创建飘字动画显示治疗
    }
    
    private updateUnitHp(unitId: string, currentHp: number) {
        const node = this.unitNodes.get(unitId);
        if (!node) return;
        
        // TODO: 更新血条显示
        const hpBar = node.getChildByName('HpBar')?.getComponent(ProgressBar);
        if (hpBar) {
            // hpBar.progress = currentHp / maxHp;
        }
    }
    
    private updateUI() {
        this.turnLabel!.string = `回合 ${this.battleSystem.getTurnCount()}`;
        
        // 更新所有单位状态
        this.battleSystem.getAllUnits().forEach(unit => {
            const node = this.unitNodes.get(unit.instanceId);
            if (node) {
                // 更新血条、能量条
                this.updateUnitHp(unit.instanceId, unit.currentHp);
            }
        });
    }
    
    // 退出战斗
    public onExitClick() {
        // TODO: 返回上一场景
    }
    
    // 继续下一关
    public onNextLevelClick() {
        // TODO: 进入下一关
    }
    
    // 重新开始
    public onRetryClick() {
        if (this.currentLevel) {
            // 重新加载当前关卡
        }
    }
}
