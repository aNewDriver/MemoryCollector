# 记忆回收者后端服务器

Node.js + Express + TypeScript 后端API服务

## 功能模块

- ✅ 用户认证（登录/注册/JWT）
- ✅ 云存档（上传/下载/版本控制）
- ✅ 排行榜（战力/竞技场/爬塔等8种）
- ✅ 公会系统（创建/加入/管理）
- ✅ 邮件系统（收发/附件/领取）
- ✅ 聊天系统（世界/公会/私聊）
- ✅ 支付系统（订单/验证/回调）

## 快速开始

```bash
# 进入服务器目录
cd server

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置数据库等信息

# 开发模式运行
npm run dev

# 生产构建
npm run build
npm start
```

## API 文档

### 认证模块

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/register` | POST | 用户注册 |

### 存档模块

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/save/:userId` | GET | 获取存档 |
| `/api/save/:userId` | POST | 保存存档 |

### 排行榜模块

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/leaderboard/:type` | GET | 获取排行榜 |
| `/api/leaderboard/:type/score` | POST | 提交分数 |

### 公会模块

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/guild/:guildId` | GET | 获取公会信息 |
| `/api/guild/create` | POST | 创建公会 |

### 邮件模块

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/mail/:userId` | GET | 获取邮件列表 |
| `/api/mail/:userId/read` | POST | 标记已读 |
| `/api/mail/:userId/claim` | POST | 领取附件 |

## 数据库设计

### 用户表 (users)
```sql
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 存档表 (saves)
```sql
CREATE TABLE saves (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL,
    version INT NOT NULL,
    data JSON NOT NULL,
    checksum VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 排行榜表 (leaderboards)
```sql
CREATE TABLE leaderboards (
    id VARCHAR(32) PRIMARY KEY,
    type VARCHAR(32) NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    score INT NOT NULL,
    rank INT,
    season VARCHAR(32),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 部署

### Docker部署

```bash
# 构建镜像
docker build -t memory-collector-server .

# 运行容器
docker run -d -p 3000:3000 --env-file .env memory-collector-server
```

### PM2部署

```bash
# 安装PM2
npm install -g pm2

# 启动服务
pm2 start dist/app.js --name memory-collector-server

# 保存配置
pm2 save
pm2 startup
```

## 开发计划

- [x] 基础API框架
- [x] 用户认证模块
- [x] 云存档模块
- [x] 排行榜模块
- [ ] WebSocket实时通信
- [ ] 支付回调处理
- [ ] 反作弊数据上报
- [ ] 日志分析系统