// 排行榜系统 - Memory Collector
// 支持本地排名和云端排名

// 排行榜类型
const LEADERBOARD_TYPE = {
    POWER: 'power',           // 战力榜
    COLLECTION: 'collection', // 收集榜
    BATTLE: 'battle',         // 战斗榜
    STORY: 'story',           // 剧情榜
    ACHIEVEMENT: 'achievement' // 成就榜
};

// 排行榜数据管理
class LeaderboardManager {
    constructor() {
        this.localRankings = {};
        this.playerRankings = {};
        this.loadRankings();
    }

    // 加载排行榜数据
    loadRankings() {
        const saved = localStorage.getItem('leaderboard_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.localRankings = data.rankings || {};
            this.playerRankings = data.player || {};
        } else {
            // 初始化默认排行榜数据
            this.initDefaultRankings();
        }
    }

    // 保存排行榜数据
    saveRankings() {
        localStorage.setItem('leaderboard_data', JSON.stringify({
            rankings: this.localRankings,
            player: this.playerRankings
        }));
    }

    // 初始化默认排行榜数据
    initDefaultRankings() {
        // 战力榜 - 模拟数据
        this.localRankings[LEADERBOARD_TYPE.POWER] = [
            { rank: 1, name: '记忆之王', power: 50000, avatar: '👑' },
            { rank: 2, name: '卡牌大师', power: 45000, avatar: '🎴' },
            { rank: 3, name: '战斗专家', power: 42000, avatar: '⚔️' },
            { rank: 4, name: '收藏家', power: 38000, avatar: '📚' },
            { rank: 5, name: '探险者', power: 35000, avatar: '🗺️' },
            { rank: 6, name: '新手玩家A', power: 30000, avatar: '👤' },
            { rank: 7, name: '新手玩家B', power: 28000, avatar: '👤' },
            { rank: 8, name: '新手玩家C', power: 25000, avatar: '👤' },
            { rank: 9, name: '新手玩家D', power: 22000, avatar: '👤' },
            { rank: 10, name: '新手玩家E', power: 20000, avatar: '👤' }
        ];

        // 收集榜
        this.localRankings[LEADERBOARD_TYPE.COLLECTION] = [
            { rank: 1, name: '全图鉴大佬', count: 587, avatar: '📖' },
            { rank: 2, name: '收藏家', count: 500, avatar: '📚' },
            { rank: 3, name: '卡牌猎人', count: 450, avatar: '🎯' },
            { rank: 4, name: '抽卡狂魔', count: 400, avatar: '🎰' },
            { rank: 5, name: '收集控', count: 350, avatar: '📦' },
            { rank: 6, name: '新手玩家A', count: 300, avatar: '👤' },
            { rank: 7, name: '新手玩家B', count: 250, avatar: '👤' },
            { rank: 8, name: '新手玩家C', count: 200, avatar: '👤' },
            { rank: 9, name: '新手玩家D', count: 150, avatar: '👤' },
            { rank: 10, name: '新手玩家E', count: 100, avatar: '👤' }
        ];

        // 战斗榜
        this.localRankings[LEADERBOARD_TYPE.BATTLE] = [
            { rank: 1, name: '百战百胜', wins: 1000, avatar: '🏆' },
            { rank: 2, name: '常胜将军', wins: 800, avatar: '🎖️' },
            { rank: 3, name: '战斗狂人', wins: 600, avatar: '⚔️' },
            { rank: 4, name: '勇者', wins: 500, avatar: '🛡️' },
            { rank: 5, name: '战士', wins: 400, avatar: '🔰' },
            { rank: 6, name: '新手玩家A', wins: 300, avatar: '👤' },
            { rank: 7, name: '新手玩家B', wins: 250, avatar: '👤' },
            { rank: 8, name: '新手玩家C', wins: 200, avatar: '👤' },
            { rank: 9, name: '新手玩家D', wins: 150, avatar: '👤' },
            { rank: 10, name: '新手玩家E', wins: 100, avatar: '👤' }
        ];

        // 剧情榜
        this.localRankings[LEADERBOARD_TYPE.STORY] = [
            { rank: 1, name: '剧情全通', chapters: 4, avatar: '📖' },
            { rank: 2, name: '故事探索者', chapters: 4, avatar: '📚' },
            { rank: 3, name: '冒险家', chapters: 3, avatar: '🗺️' },
            { rank: 4, name: '章节猎人', chapters: 3, avatar: '🔍' },
            { rank: 5, name: '故事迷', chapters: 2, avatar: '📜' },
            { rank: 6, name: '新手玩家A', chapters: 2, avatar: '👤' },
            { rank: 7, name: '新手玩家B', chapters: 1, avatar: '👤' },
            { rank: 8, name: '新手玩家C', chapters: 1, avatar: '👤' },
            { rank: 9, name: '新手玩家D', chapters: 1, avatar: '👤' },
            { rank: 10, name: '新手玩家E', chapters: 1, avatar: '👤' }
        ];

        // 成就榜
        this.localRankings[LEADERBOARD_TYPE.ACHIEVEMENT] = [
            { rank: 1, name: '成就达人', count: 45, avatar: '🏅' },
            { rank: 2, name: '成就收集者', count: 40, avatar: '🎖️' },
            { rank: 3, name: '挑战者', count: 35, avatar: '🎯' },
            { rank: 4, name: '成就猎人', count: 30, avatar: '🔍' },
            { rank: 5, name: '成就爱好者', count: 25, avatar: '⭐' },
            { rank: 6, name: '新手玩家A', count: 20, avatar: '👤' },
            { rank: 7, name: '新手玩家B', count: 15, avatar: '👤' },
            { rank: 8, name: '新手玩家C', count: 10, avatar: '👤' },
            { rank: 9, name: '新手玩家D', count: 5, avatar: '👤' },
            { rank: 10, name: '新手玩家E', count: 3, avatar: '👤' }
        ];
    }

    // 获取排行榜
    getLeaderboard(type) {
        return this.localRankings[type] || [];
    }

    // 更新玩家排名数据
    updatePlayerStats(stats) {
        // 战力
        if (stats.power) {
            this.playerRankings.power = stats.power;
        }
        // 收集数量
        if (stats.collection) {
            this.playerRankings.collection = stats.collection;
        }
        // 战斗胜利
        if (stats.wins) {
            this.playerRankings.wins = stats.wins;
        }
        // 完成章节
        if (stats.chapters) {
            this.playerRankings.chapters = stats.chapters;
        }
        // 成就数量
        if (stats.achievements) {
            this.playerRankings.achievements = stats.achievements;
        }

        this.saveRankings();
        this.recalculateRankings();
    }

    // 重新计算排名（将玩家插入到合适位置）
    recalculateRankings() {
        // 战力榜
        if (this.playerRankings.power) {
            this.insertPlayerRanking(LEADERBOARD_TYPE.POWER, {
                name: '我',
                power: this.playerRankings.power,
                avatar: '😊',
                isPlayer: true
            }, 'power');
        }

        // 收集榜
        if (this.playerRankings.collection) {
            this.insertPlayerRanking(LEADERBOARD_TYPE.COLLECTION, {
                name: '我',
                count: this.playerRankings.collection,
                avatar: '😊',
                isPlayer: true
            }, 'count');
        }

        // 战斗榜
        if (this.playerRankings.wins) {
            this.insertPlayerRanking(LEADERBOARD_TYPE.BATTLE, {
                name: '我',
                wins: this.playerRankings.wins,
                avatar: '😊',
                isPlayer: true
            }, 'wins');
        }

        // 剧情榜
        if (this.playerRankings.chapters) {
            this.insertPlayerRanking(LEADERBOARD_TYPE.STORY, {
                name: '我',
                chapters: this.playerRankings.chapters,
                avatar: '😊',
                isPlayer: true
            }, 'chapters');
        }

        // 成就榜
        if (this.playerRankings.achievements !== undefined) {
            this.insertPlayerRanking(LEADERBOARD_TYPE.ACHIEVEMENT, {
                name: '我',
                count: this.playerRankings.achievements,
                avatar: '😊',
                isPlayer: true
            }, 'count');
        }
    }

    // 插入玩家到排行榜
    insertPlayerRanking(type, playerData, sortKey) {
        let rankings = this.localRankings[type];
        
        // 移除旧的玩家数据
        rankings = rankings.filter(r => !r.isPlayer);
        
        // 插入新数据
        rankings.push(playerData);
        
        // 排序
        rankings.sort((a, b) => b[sortKey] - a[sortKey]);
        
        // 重新编号
        rankings.forEach((r, i) => {
            r.rank = i + 1;
        });
        
        // 只保留前10
        this.localRankings[type] = rankings.slice(0, 10);
    }

    // 获取玩家排名
    getPlayerRank(type) {
        const rankings = this.localRankings[type];
        const playerEntry = rankings.find(r => r.isPlayer);
        return playerEntry ? playerEntry.rank : '--';
    }

    // 计算玩家战力
    calculatePower(cards) {
        let totalPower = 0;
        for (const card of cards) {
            // 战力 = (攻击力 + 生命值/10 + 防御力) * 等级系数 * 星级系数
            const levelMult = 1 + (card.level - 1) * 0.1;
            const starMult = 1 + (card.star - 1) * 0.3;
            const rarityMult = { N: 1, R: 1.2, SR: 1.5, SSR: 2, UR: 3 }[card.baseCard.rarity] || 1;
            
            const cardPower = (card.atk + card.hp / 10 + card.def) * levelMult * starMult * rarityMult;
            totalPower += Math.floor(cardPower);
        }
        return totalPower;
    }

    // 从当前游戏数据更新排行榜
    updateFromGameData() {
        if (!playerData) return;

        const stats = {
            power: this.calculatePower(playerData.cards),
            collection: playerData.cards.length,
            wins: achievementManager ? achievementManager.progress['battle_win'] || 0 : 0,
            chapters: CHAPTERS ? CHAPTERS.filter(c => c.completed).length : 0,
            achievements: achievementManager ? achievementManager.unlockedAchievements.length : 0
        };

        this.updatePlayerStats(stats);
    }
}

// 全局排行榜管理器实例
let leaderboardManager = null;

// 初始化排行榜系统
function initLeaderboardSystem() {
    leaderboardManager = new LeaderboardManager();
    console.log('排行榜系统已初始化');
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        LEADERBOARD_TYPE, 
        LeaderboardManager, 
        initLeaderboardSystem 
    };
}
