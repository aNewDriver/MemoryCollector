# GM运营后台配置

**项目**: 记忆回收者  
**日期**: 2026-03-03  
**用途**: 游戏运营管理

---

## 一、GM后台功能

### 1.1 功能模块

| 模块 | 功能 | 权限 |
|------|------|------|
| 用户管理 | 查询/封禁/解封 | 客服、运营、管理员 |
| 订单管理 | 查看/退款/补单 | 运营、财务、管理员 |
| 邮件系统 | 发送/撤回/查看 | 运营、管理员 |
| 活动配置 | 创建/修改/关闭 | 运营、管理员 |
| 公告管理 | 发布/编辑/删除 | 运营、管理员 |
| 数据统计 | 实时/报表导出 | 运营、数据分析、管理员 |
| 服务器管理 | 状态/热更/重启 | 技术、管理员 |

---

## 二、API接口

### 2.1 用户管理

```typescript
// GM用户管理接口

// 查询用户
GET /api/admin/users?keyword=&page=&limit=
Response: {
  users: [{
    id: string,
    username: string,
    level: number,
    vip: number,
    status: 'active' | 'banned',
    createdAt: string,
    lastLogin: string
  }],
  total: number
}

// 封禁用户
POST /api/admin/users/:id/ban
Body: {
  reason: string,
  duration: number, // 天数，0为永久
  banType: 'chat' | 'login' | 'full'
}

// 解封用户
POST /api/admin/users/:id/unban

// 修改用户数据
POST /api/admin/users/:id/modify
Body: {
  resourceType: 'gold' | 'gem' | 'energy',
  amount: number,
  reason: string
}
```

### 2.2 订单管理

```typescript
// 查询订单
GET /api/admin/orders?status=&dateFrom=&dateTo=&page=
Response: {
  orders: [{
    orderId: string,
    userId: string,
    username: string,
    productId: string,
    amount: number,
    currency: string,
    status: 'pending' | 'completed' | 'refunded',
    createdAt: string,
    paidAt: string
  }],
  total: number,
  totalAmount: number
}

// 退款
POST /api/admin/orders/:orderId/refund
Body: {
  reason: string,
  refundAmount: number
}

// 补单
POST /api/admin/orders/:orderId/compensate
Body: {
  reason: string,
  compensateItems: [{
    itemId: string,
    quantity: number
  }]
}
```

### 2.3 邮件系统

```typescript
// 发送系统邮件
POST /api/admin/mails/send
Body: {
  targetType: 'all' | 'specific' | 'condition',
  targets: string[], // 用户ID列表
  title: string,
  content: string,
  attachments: [{
    itemId: string,
    quantity: number
  }],
  expireDays: number,
  scheduleTime: string // 定时发送
}

// 查询邮件
GET /api/admin/mails?page=&limit=
Response: {
  mails: [{
    id: string,
    title: string,
    recipientCount: number,
    readCount: number,
    claimedCount: number,
    sentAt: string,
    status: 'draft' | 'sent' | 'cancelled'
  }]
}

// 撤回邮件
POST /api/admin/mails/:id/recall
```

### 2.4 活动配置

```typescript
// 创建活动
POST /api/admin/events
Body: {
  name: string,
  type: 'login_reward' | 'consumption' | 'gacha_boost',
  startTime: string,
  endTime: string,
  config: object, // 活动具体配置
  bannerUrl: string,
  description: string
}

// 查询活动
GET /api/admin/events
Response: {
  events: [{
    id: string,
    name: string,
    type: string,
    status: 'draft' | 'active' | 'ended',
    startTime: string,
    endTime: string,
    participantCount: number
  }]
}

// 修改活动
PUT /api/admin/events/:id

// 关闭活动
POST /api/admin/events/:id/close
```

### 2.5 数据统计

```typescript
// 实时数据
GET /api/admin/stats/realtime
Response: {
  onlineUsers: number,
  todayNewUsers: number,
  todayActiveUsers: number,
  todayRevenue: number,
  todayOrders: number,
  serverLoad: number
}

// 留存数据
GET /api/admin/stats/retention?dateFrom=&dateTo=
Response: {
  dates: string[],
  newUsers: number[],
  retention: {
    d1: number[],
    d3: number[],
    d7: number[],
    d30: number[]
  }
}

// 收入报表
GET /api/admin/stats/revenue?dateFrom=&dateTo=&groupBy=
Response: {
  data: [{
    date: string,
    revenue: number,
    orderCount: number,
    arpu: number,
    arppu: number
  }]
}

// 导出报表
POST /api/admin/stats/export
Body: {
  reportType: 'user' | 'revenue' | 'activity',
  dateFrom: string,
  dateTo: string,
  format: 'csv' | 'xlsx'
}
```

---

## 三、前端界面

### 3.1 技术栈

- **框架**: React 18 + TypeScript
- **UI库**: Ant Design 5.x
- **图表**: ECharts 5.x
- **状态管理**: Zustand
- **HTTP客户端**: Axios

### 3.2 页面结构

```
src/
├── components/       # 公共组件
│   ├── Layout/      # 布局组件
│   ├── Charts/      # 图表组件
│   └── Forms/       # 表单组件
├── pages/           # 页面
│   ├── Login/
│   ├── Dashboard/   # 数据大盘
│   ├── Users/       # 用户管理
│   ├── Orders/      # 订单管理
│   ├── Mails/       # 邮件系统
│   ├── Events/      # 活动管理
│   ├── Notices/     # 公告管理
│   ├── Stats/       # 数据统计
│   └── System/      # 系统设置
├── hooks/           # 自定义Hooks
├── stores/          # 状态管理
├── utils/           # 工具函数
└── api/             # API接口
```

### 3.3 路由配置

```typescript
// router.tsx
const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'orders', component: Orders },
      { path: 'mails', component: Mails },
      { path: 'events', component: Events },
      { path: 'notices', component: Notices },
      { path: 'stats', component: Stats },
      { path: 'system', component: System }
    ]
  }
];
```

---

## 四、权限系统

### 4.1 角色定义

| 角色 | 权限 |
|------|------|
| 超级管理员 | 全部权限 |
| 运营主管 | 用户管理、活动配置、公告管理、数据统计 |
| 运营专员 | 查看数据、发送邮件、活动配置（查看） |
| 客服 | 用户查询、封禁/解禁、邮件查询 |
| 财务 | 订单管理、退款处理、财务报表 |
| 技术 | 服务器管理、日志查看 |

### 4.2 权限控制

```typescript
// 权限守卫组件
const PermissionGuard: React.FC<{
  required: string[];
  children: React.ReactNode;
}> = ({ required, children }) => {
  const user = useUserStore();
  
  const hasPermission = required.some(p => 
    user.permissions.includes(p)
  );
  
  if (!hasPermission) {
    return <NoPermission />;
  }
  
  return <>{children}</>;
};

// 使用
<PermissionGuard required={['user:ban']}>
  <BanButton />
</PermissionGuard>
```

---

## 五、安全措施

### 5.1 认证授权

```typescript
// JWT认证
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // 检查是否是GM账号
    if (!decoded.isGM) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 操作日志
const auditLog = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // 记录操作日志
      logAudit({
        userId: req.user.id,
        action,
        params: req.body,
        result: res.statusCode,
        ip: req.ip,
        timestamp: new Date()
      });
      
      originalSend.call(this, data);
    };
    
    next();
  };
};
```

### 5.2 敏感操作二次确认

```typescript
// 危险操作需要二次确认
POST /api/admin/users/:id/ban
Headers: {
  'X-Confirmation-Code': '123456' // 短信/邮箱验证码
}
```

---

## 六、部署配置

### 6.1 独立部署

```yaml
# docker-compose.gm.yml
version: '3.8'

services:
  gm-web:
    build:
      context: ./gm-web
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    environment:
      - API_BASE_URL=http://gm-api:3001

  gm-api:
    build:
      context: ./gm-api
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - JWT_SECRET=${GM_JWT_SECRET}
    depends_on:
      - mysql
```

### 6.2 Nginx配置

```nginx
server {
    listen 80;
    server_name gm.memory-collector.com;
    
    location / {
        root /var/www/gm-web;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 七、运营工具脚本

### 7.1 批量操作脚本

```bash
#!/bin/bash
# batch_send_mail.sh

# 批量发送邮件给特定用户群体
node scripts/batchSendMail.js \
  --target vip \
  --min-level 30 \
  --title "VIP专属福利" \
  --content "恭喜您获得..." \
  --attach item_001:10
```

### 7.2 数据导出脚本

```bash
#!/bin/bash
# export_daily_stats.sh

DATE=$(date +%Y%m%d)

# 导出每日数据
mysql -u root -p game_db << EOF > stats_${DATE}.csv
SELECT DATE(created_at), 
       COUNT(*) as new_users,
       SUM(amount) as revenue
FROM users
WHERE DATE(created_at) = CURDATE() - 1
GROUP BY DATE(created_at);
EOF
```

---

## 八、监控告警

### 8.1 关键指标监控

| 指标 | 阈值 | 告警方式 |
|------|------|---------|
| 在线用户突降 | -50%/5min | 企业微信 |
| 充值失败率 | >5% | 短信+电话 |
| 服务器CPU | >80% | 企业微信 |
| 数据库慢查询 | >1s | 企业微信 |

### 8.2 告警配置

```yaml
# alertmanager.yml
groups:
  - name: gm-alerts
    rules:
      - alert: RevenueDrop
        expr: rate(orders_total[5m]) < 0.5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "收入异常下降"
          
      - alert: GMLoginFailure
        expr: rate(gm_login_failures[5m]) > 10
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "GM登录失败次数过多"
```

---

## 九、使用规范

### 9.1 操作规范

1. **用户封禁**: 必须填写详细原因，保留证据截图
2. **发放道具**: 必须填写申请单，经主管审批
3. **数据修改**: 必须双人确认，记录修改前后值
4. **活动配置**: 必须测试环境验证后再上线上

### 9.2 安全规范

1. GM账号不得共享
2. 定期更换密码（90天）
3. 敏感操作需二次验证
4. 离职立即注销账号
5. 操作日志保留1年

---

*文档完成 - 等待实施*
