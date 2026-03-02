# 后端API接口定义文档

**版本**: v1.0  
**协议**: HTTP RESTful + WebSocket  
**数据格式**: JSON  
**认证方式**: JWT Token

---

## 基础信息

### 基础URL
```
开发环境: http://localhost:3000/api/v1
生产环境: https://api.memory-recycle.com/api/v1
```

### 通用响应格式
```typescript
interface ApiResponse<T> {
    code: number;       // 0表示成功，其他为错误码
    message: string;    // 提示信息
    data: T;           // 响应数据
    timestamp: number; // 服务器时间戳
}
```

### 通用错误码
| 错误码 | 含义 | 处理建议 |
|--------|------|----------|
| 0 | 成功 | - |
| 1001 | 参数错误 | 检查请求参数 |
| 1002 | 未授权 | 重新登录获取Token |
| 1003 | 资源不存在 | 检查资源ID |
| 1004 | 服务器内部错误 | 稍后重试 |
| 2001 | 账号不存在 | 检查账号或注册 |
| 2002 | 密码错误 | 重新输入 |
| 2003 | 账号已存在 | 更换账号 |
| 3001 | 余额不足 | 充值或获取资源 |
| 3002 | 操作过于频繁 | 稍后重试 |

---

## 认证模块

### 1. 用户注册
**POST** `/auth/register`

**请求参数**:
```json
{
    "username": "string",    // 用户名，4-20字符
    "password": "string",    // 密码，6-32字符
    "platform": "string"     // 平台：ios/android/wechat/web
}
```

**响应示例**:
```json
{
    "code": 0,
    "message": "注册成功",
    "data": {
        "userId": "user_123456",
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "expiresAt": 1700000000
    }
}
```

### 2. 用户登录
**POST** `/auth/login`

**请求参数**:
```json
{
    "username": "string",
    "password": "string",
    "deviceId": "string"     // 设备标识，用于防作弊
}
```

### 3. 游客登录
**POST** `/auth/guest`

**请求参数**:
```json
{
    "deviceId": "string",
    "platform": "string"
}
```

### 4. Token刷新
**POST** `/auth/refresh`

**Headers**:
```
Authorization: Bearer {refresh_token}
```

---

## 存档模块

### 1. 上传存档
**POST** `/save/upload`

**Headers**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
    "saveData": {
        "playerData": { /* PlayerData对象 */ },
        "inventory": { /* InventoryData对象 */ },
        "settings": { /* Settings对象 */ }
    },
    "checksum": "string",    // 数据校验和，防篡改
    "version": 1             // 存档版本号
}
```

**响应示例**:
```json
{
    "code": 0,
    "message": "存档成功",
    "data": {
        "saveId": "save_789",
        "syncAt": 1700000000
    }
}
```

### 2. 下载存档
**GET** `/save/download`

**Headers**:
```
Authorization: Bearer {token}
```

**响应示例**:
```json
{
    "code": 0,
    "message": "success",
    "data": {
        "saveData": { /* 存档数据 */ },
        "checksum": "string",
        "syncAt": 1700000000
    }
}
```

### 3. 获取存档列表（多设备支持）
**GET** `/save/list`

**响应示例**:
```json
{
    "code": 0,
    "data": {
        "saves": [
            {
                "saveId": "save_001",
                "deviceName": "iPhone 15",
                "level": 25,
                "lastSync": 1700000000
            }
        ]
    }
}
```

---

## 排行榜模块

### 1. 获取排行榜
**GET** `/leaderboard/{type}?page=1&limit=100`

**排行榜类型**:
- `power` - 战力榜
- `arena` - 竞技场榜
- `tower` - 爬塔榜
- `achievement` - 成就榜
- `collection` - 收集榜

**响应示例**:
```json
{
    "code": 0,
    "data": {
        "type": "power",
        "season": 1,
        "total": 10000,
        "list": [
            {
                "rank": 1,
                "userId": "user_123",
                "nickname": "玩家A",
                "avatar": "url",
                "score": 999999,
                "level": 50
            }
        ],
        "myRank": {
            "rank": 100,
            "score": 50000
        }
    }
}
```

### 2. 获取赛季奖励
**GET** `/leaderboard/{type}/reward`

**响应示例**:
```json
{
    "code": 0,
    "data": {
        "currentRank": 100,
        "rewards": [
            {
                "itemId": "diamond",
                "count": 100
            }
        ],
        "canClaim": true
    }
}
```

### 3. 领取赛季奖励
**POST** `/leaderboard/{type}/claim`

---

## 邮件模块

### 1. 获取邮件列表
**GET** `/mail/list?page=1&limit=20`

**响应示例**:
```json
{
    "code": 0,
    "data": {
        "total": 10,
        "unread": 3,
        "mails": [
            {
                "mailId": "mail_123",
                "type": "system",      // system/gift/reward
                "title": "系统维护补偿",
                "content": "...",
                "attachments": [
                    {"itemId": "diamond", "count": 100}
                ],
                "isRead": false,
                "isClaimed": false,
                "sentAt": 1700000000,
                "expireAt": 1701000000
            }
        ]
    }
}
```

### 2. 领取附件
**POST** `/mail/{mailId}/claim`

### 3. 标记已读
**POST** `/mail/{mailId}/read`

### 4. 删除邮件
**DELETE** `/mail/{mailId}`

---

## 公会模块

### 1. 创建公会
**POST** `/guild/create`

**请求参数**:
```json
{
    "name": "string",       // 公会名称，2-20字符
    "notice": "string",     // 公告
    "icon": "string",       // 图标ID
    "requirement": {
        "minLevel": 10,
        "autoJoin": false
    }
}
```

### 2. 搜索公会
**GET** `/guild/search?keyword=xxx&page=1`

### 3. 申请加入
**POST** `/guild/{guildId}/apply`

### 4. 获取公会信息
**GET** `/guild/{guildId}/info`

**响应示例**:
```json
{
    "code": 0,
    "data": {
        "guildId": "guild_123",
        "name": "最强公会",
        "level": 5,
        "exp": 4500,
        "memberCount": 25,
        "maxMembers": 30,
        "notice": "...",
        "leader": { /* 会长信息 */ },
        "members": [ /* 成员列表 */ ]
    }
}
```

### 5. 公会捐献
**POST** `/guild/donate`

**请求参数**:
```json
{
    "type": "gold",      // gold/diamond
    "amount": 1000
}
```

### 6. 公会BOSS
**GET** `/guild/boss/info`      // 获取BOSS状态
**POST** `/guild/boss/fight`    // 挑战BOSS
**POST** `/guild/boss/claim`    // 领取奖励

---

## 社交模块

### 1. 获取好友列表
**GET** `/social/friends`

### 2. 搜索玩家
**GET** `/social/search?nickname=xxx`

### 3. 添加好友
**POST** `/social/friend/request`

**请求参数**:
```json
{
    "targetUserId": "user_456"
}
```

### 4. 处理好友请求
**POST** `/social/friend/handle`

**请求参数**:
```json
{
    "requestId": "req_123",
    "action": "accept"    // accept/reject
}
```

### 5. 赠送体力
**POST** `/social/friend/{friendId}/send-stamina`

### 6. 私聊
**WebSocket** 连接 `/ws/chat`

**消息格式**:
```json
{
    "type": "private",
    "targetId": "user_456",
    "content": "..."
}
```

---

## 分享模块

### 1. 获取分享配置
**GET** `/share/config`

**响应示例**:
```json
{
    "code": 0,
    "data": {
        "dailyLimit": 3,
        "rewards": [
            {"itemId": "diamond", "count": 20}
        ],
        "shareUrl": "https://...",
        "shareImage": "https://..."
    }
}
```

### 2. 分享回调
**POST** `/share/callback`

**请求参数**:
```json
{
    "platform": "wechat",    // wechat/qq/weibo
    "shareType": "invite",   // invite/battle/gacha
    "targetId": "string"     // 可选，被分享的目标ID
}
```

---

## 支付模块

### 1. 获取商品列表
**GET** `/payment/products`

### 2. 创建订单
**POST** `/payment/order`

**请求参数**:
```json
{
    "productId": "diamond_100",
    "platform": "ios",       // ios/android
    "receipt": "string"      // 客户端支付凭证
}
```

### 3. 验证订单
**POST** `/payment/verify`

---

## 数据分析模块

### 1. 上报事件
**POST** `/analytics/event`

**请求参数**:
```json
{
    "event": "level_up",      // 事件类型
    "params": {
        "level": 10,
        "time": 123
    },
    "timestamp": 1700000000
}
```

### 2. 上报错误
**POST** `/analytics/error`

---

## WebSocket实时通信

### 连接地址
```
ws://localhost:3000/ws
```

### 连接参数
```
Headers: Authorization: Bearer {token}
```

### 消息类型

#### 服务器推送
```typescript
// 聊天消息
interface ChatMessage {
    type: 'chat';
    from: string;
    content: string;
    timestamp: number;
}

// 系统通知
interface SystemNotice {
    type: 'notice';
    title: string;
    content: string;
}

// 公会消息
interface GuildMessage {
    type: 'guild';
    subtype: 'join' | 'leave' | 'donate' | 'boss';
    data: any;
}

// 邮件提醒
interface MailReminder {
    type: 'mail';
    unreadCount: number;
}
```

---

## 客户端实现建议

### 网络层封装
```typescript
class NetworkManager {
    private baseUrl: string = 'http://localhost:3000/api/v1';
    private token: string = '';
    
    async request<T>(method: string, path: string, data?: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: data ? JSON.stringify(data) : undefined
        });
        
        const result: ApiResponse<T> = await response.json();
        
        if (result.code !== 0) {
            throw new Error(result.message);
        }
        
        return result.data;
    }
    
    // 便捷方法
    get<T>(path: string) { return this.request<T>('GET', path); }
    post<T>(path: string, data: any) { return this.request<T>('POST', path, data); }
}
```

### 错误处理策略
1. **网络错误**: 自动重试3次
2. **Token过期**: 自动刷新Token并重试
3. **服务器错误**: 提示用户稍后重试
4. **业务错误**: 根据错误码显示对应提示

---

## 待实现清单

- [ ] 接口限流配置
- [ ] 接口签名验证（防篡改）
- [ ] 响应数据压缩
- [ ] 接口缓存策略
- [ ] API版本控制

---

**最后更新**: 2026年3月2日
