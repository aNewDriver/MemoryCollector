"use strict";
/**
 * 排行榜模块
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = getLeaderboard;
exports.updateScore = updateScore;
exports.getLeaderboardTypes = getLeaderboardTypes;
const db_1 = __importDefault(require("../db"));
// 获取排行榜
async function getLeaderboard(req, res) {
    try {
        const { type } = req.params;
        const limit = parseInt(req.query.limit) || 100;
        const userId = req.query.userId;
        // 获取排行榜数据
        const [rows] = await db_1.default.execute(`SELECT l.user_id, l.score, l.updated_at, u.username 
             FROM leaderboard l 
             JOIN users u ON l.user_id = u.id 
             WHERE l.type = ? 
             ORDER BY l.score DESC 
             LIMIT ?`, [type, limit]);
        const rankings = rows.map((row, index) => ({
            rank: index + 1,
            userId: row.user_id,
            username: row.username,
            score: row.score,
            updateTime: new Date(row.updated_at).getTime()
        }));
        // 获取用户自己的排名
        let myRank = null;
        if (userId) {
            const [myRankRows] = await db_1.default.execute(`SELECT COUNT(*) + 1 as rank, score 
                 FROM leaderboard 
                 WHERE type = ? AND score > (SELECT score FROM leaderboard WHERE type = ? AND user_id = ?)`, [type, type, userId]);
            const rankData = myRankRows[0];
            if (rankData) {
                myRank = {
                    rank: rankData.rank,
                    score: rankData.score
                };
            }
        }
        res.json({
            success: true,
            type,
            rankings,
            myRank,
            updateTime: Date.now()
        });
    }
    catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 更新分数
async function updateScore(req, res) {
    try {
        const { type } = req.params;
        const { userId, score } = req.body;
        if (!userId || score === undefined) {
            return res.status(400).json({ success: false, error: 'UserId and score required' });
        }
        // 检查现有分数
        const [existing] = await db_1.default.execute('SELECT score FROM leaderboard WHERE user_id = ? AND type = ?', [userId, type]);
        const existingScore = existing[0]?.score || 0;
        // 只有新分数更高才更新
        if (score > existingScore) {
            await db_1.default.execute(`INSERT INTO leaderboard (user_id, type, score) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE score = ?`, [userId, type, score, score]);
        }
        res.json({ success: true, newHighScore: score > existingScore });
    }
    catch (error) {
        console.error('Update score error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
// 获取所有排行榜类型
async function getLeaderboardTypes(req, res) {
    try {
        const types = [
            { id: 'power', name: '战力榜', description: '总战力排名' },
            { id: 'tower', name: '爬塔榜', description: '无尽塔层数' },
            { id: 'arena', name: '竞技场', description: 'PVP排名' },
            { id: 'guild', name: '公会榜', description: '公会总战力' },
            { id: 'level', name: '等级榜', description: '玩家等级' },
            { id: 'achievement', name: '成就榜', description: '成就点数' },
            { id: 'collection', name: '收藏榜', description: '卡牌收集度' },
            { id: 'event', name: '活动榜', description: '活动积分' }
        ];
        res.json({ success: true, types });
    }
    catch (error) {
        console.error('Get leaderboard types error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
//# sourceMappingURL=leaderboard.js.map