# 数据分析与埋点系统

**项目**: 记忆回收者  
**日期**: 2026-03-03  
**用途**: 用户行为分析、运营数据监控

---

## 一、埋点规范

### 1.1 埋点类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 页面浏览(PV) | 页面打开/关闭 | main_scene_enter, battle_scene_exit |
| 点击事件 | 按钮点击 | btn_click_gacha, btn_click_adventure |
| 功能使用 | 功能触发 | function_use_skill_upgrade |
| 状态变化 | 数值变化 | level_up, item_obtain, card_draw |
| 错误事件 | 异常捕获 | error_save_failed, error_network |
| 性能事件 | 性能指标 | fps_drop, load_time |

### 1.2 埋点格式

```typescript
// 埋点数据结构
interface TrackEvent {
  // 基础信息
  eventId: string;           // 事件ID
  eventName: string;         // 事件名称
  timestamp: number;         // 时间戳
  
  // 用户信息
  userId: string;
  deviceId: string;
  platform: 'ios' | 'android' | 'web' | 'wechat';
  version: string;
  
  // 场景信息
  scene: string;
  level: number;
  
  // 事件参数
  params: {
    [key: string]: string | number | boolean;
  };
  
  // 系统信息
  deviceInfo: {
    model: string;
    os: string;
    screen: string;
  };
}
```

### 1.3 埋点代码示例

```typescript
// 埋点管理器
class AnalyticsManager {
  private static instance: AnalyticsManager;
  private eventQueue: TrackEvent[] = [];
  private flushInterval: number = 30000; // 30秒上报一次
  
  static getInstance(): AnalyticsManager {
    if (!this.instance) {
      this.instance = new AnalyticsManager();
    }
    return this.instance;
  }
  
  // 记录事件
  track(eventName: string, params: Record<string, any> = {}): void {
    const event: TrackEvent = {
      eventId: this.generateEventId(),
      eventName,
      timestamp: Date.now(),
      userId: PlayerManager.getInstance().userId,
      deviceId: DeviceInfo.deviceId,
      platform: DeviceInfo.platform,
      version: GameConfig.VERSION,
      scene: director.getScene()?.name || 'unknown',
      level: PlayerManager.getInstance().level,
      params,
      deviceInfo: {
        model: DeviceInfo.model,
        os: DeviceInfo.osVersion,
        screen: `${screen.width}x${screen.height}`
      }
    };
    
    this.eventQueue.push(event);
    
    // 队列满或关键事件立即上报
    if (this.eventQueue.length >= 50 || this.isCriticalEvent(eventName)) {
      this.flush();
    }
  }
  
  // 关键事件判断
  private isCriticalEvent(eventName: string): boolean {
    const criticalEvents = [
      'payment_success',
      'payment_fail',
      'account_login',
      'account_register',
      'error_crash'
    ];
    return criticalEvents.includes(eventName);
  }
  
  // 上报事件
  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      await NetworkManager.getInstance().post('/api/analytics/events', {
        events,
        sessionId: this.sessionId
      });
    } catch (err) {
      // 上报失败，重新入队
      this.eventQueue.unshift(...events);
    }
  }
}

// 使用示例
AnalyticsManager.getInstance().track('btn_click_gacha', {
  pool_type: 'normal',
  draw_count: 10,
  has_guarantee: true
});

AnalyticsManager.getInstance().track('card_obtain', {
  card_id: 'card_001',
  rarity: 'SSR',
  source: 'gacha',
  is_new: true
});
```

---

## 二、核心埋点事件

### 2.1 用户生命周期

```typescript
// 新用户注册
track('user_register', {
  register_type: 'guest' | 'email' | 'wechat',
  referral_code: string
});

// 用户登录
track('user_login', {
  login_type: string,
  days_since_last_login: number
});

// 用户流失（7天未登录）
track('user_churn', {
  last_login_time: number,
  total_play_time: number,
  level: number
});

// 用户回流
track('user_return', {
  away_days: number,
  return_reward_claimed: boolean
});
```

### 2.2 新手引导

```typescript
// 引导步骤完成
track('tutorial_step_complete', {
  step_id: string,
  step_name: string,
  duration: number
});

// 引导退出
track('tutorial_skip', {
  step_id: string,
  reason: 'manual' | 'crash' | 'timeout'
});
```

### 2.3 付费相关

```typescript
// 点击购买
track('payment_click', {
  product_id: string,
  product_name: string,
  price: number,
  currency: string
});

// 支付成功
track('payment_success', {
  order_id: string,
  product_id: string,
  price: number,
  currency: string,
  payment_method: string
});

// 支付失败
track('payment_fail', {
  order_id: string,
  product_id: string,
  error_code: string,
  error_msg: string
});
```

### 2.4 游戏玩法

```typescript
// 关卡开始
track('level_start', {
  level_id: string,
  level_type: 'main' | 'tower' | 'dungeon',
  team_power: number
});

// 关卡完成
track('level_complete', {
  level_id: string,
  result: 'win' | 'lose' | 'escape',
  stars: number,
  duration: number,
  retry_count: number
});

// 抽卡
track('gacha_draw', {
  pool_id: string,
  draw_type: 'single' | 'ten',
  results: string[],
  has_ssr: boolean
});

// 卡牌升级
track('card_upgrade', {
  card_id: string,
  from_level: number,
  to_level: number,
  resource_cost: object
});
```

### 2.5 社交功能

```typescript
// 加入公会
track('guild_join', {
  guild_id: string,
  guild_level: number,
  member_count: number
});

// 发送消息
track('chat_send', {
  channel: 'world' | 'guild' | 'private',
  message_length: number,
  has_emoji: boolean
});

// 添加好友
track('friend_add', {
  source: 'recommend' | 'search' | 'battle'
});
```

---

## 三、数据报表

### 3.1 实时数据看板

```sql
-- 实时在线用户
SELECT COUNT(DISTINCT user_id) as online_users
FROM user_sessions
WHERE last_active > DATE_SUB(NOW(), INTERVAL 5 MINUTE);

-- 今日新增用户
SELECT COUNT(*) as new_users
FROM users
WHERE DATE(created_at) = CURDATE();

-- 今日收入
SELECT SUM(amount) as revenue, COUNT(*) as orders
FROM payments
WHERE DATE(paid_at) = CURDATE() AND status = 'success';
```

### 3.2 留存分析

```sql
-- 留存率计算
WITH new_users AS (
  SELECT user_id, DATE(created_at) as install_date
  FROM users
  WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
),
retention AS (
  SELECT 
    n.install_date,
    DATEDIFF(DATE(e.timestamp), n.install_date) as day,
    COUNT(DISTINCT e.user_id) as retained_users
  FROM new_users n
  LEFT JOIN events e ON n.user_id = e.user_id
    AND e.event_name = 'user_login'
    AND DATEDIFF(DATE(e.timestamp), n.install_date) BETWEEN 1 AND 30
  GROUP BY n.install_date, day
)
SELECT 
  install_date,
  COUNT(*) as total_users,
  MAX(CASE WHEN day = 1 THEN retained_users END) / COUNT(*) as d1_retention,
  MAX(CASE WHEN day = 7 THEN retained_users END) / COUNT(*) as d7_retention,
  MAX(CASE WHEN day = 30 THEN retained_users END) / COUNT(*) as d30_retention
FROM retention
GROUP BY install_date;
```

### 3.3 付费分析

```sql
-- LTV计算
SELECT 
  DATE(created_at) as install_date,
  COUNT(*) as new_users,
  SUM(lifetime_value) as total_ltv,
  AVG(lifetime_value) as avg_ltv
FROM users
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
GROUP BY DATE(created_at);

-- 付费转化漏斗
SELECT 
  'Install' as step,
  COUNT(*) as users
FROM users
UNION ALL
SELECT 
  'Login' as step,
  COUNT(DISTINCT user_id)
FROM events
WHERE event_name = 'user_login'
UNION ALL
SELECT 
  'Payment Click' as step,
  COUNT(DISTINCT user_id)
FROM events
WHERE event_name = 'payment_click'
UNION ALL
SELECT 
  'Payment Success' as step,
  COUNT(DISTINCT user_id)
FROM events
WHERE event_name = 'payment_success';
```

### 3.4 流失预警

```sql
-- 高风险流失用户
SELECT 
  u.user_id,
  u.level,
  u.vip_level,
  MAX(e.timestamp) as last_active,
  DATEDIFF(CURDATE(), DATE(MAX(e.timestamp))) as inactive_days,
  COUNT(DISTINCT DATE(e.timestamp)) as active_days_7d
FROM users u
LEFT JOIN events e ON u.user_id = e.user_id
  AND e.timestamp > DATE_SUB(CURDATE(), INTERVAL 7 DAY)
WHERE u.last_login < DATE_SUB(CURDATE(), INTERVAL 3 DAY)
  AND u.level >= 10
GROUP BY u.user_id
HAVING active_days_7d <= 1
ORDER BY inactive_days DESC
LIMIT 100;
```

---

## 四、数据分析平台

### 4.1 技术架构

```
客户端埋点 → 消息队列(Kafka) → 实时计算(Flink) → 存储(ClickHouse)
                                    ↓
                              离线计算(Hive/Spark) → 数据仓库
                                    ↓
                              可视化平台(Grafana/Tableau)
```

### 4.2 数据表结构

```sql
-- 事件表
CREATE TABLE events (
  event_id String,
  event_name String,
  timestamp DateTime64(3),
  user_id String,
  device_id String,
  platform Enum('ios', 'android', 'web', 'wechat'),
  version String,
  scene String,
  level UInt16,
  params String, -- JSON
  device_model String,
  os_version String,
  screen_resolution String
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(timestamp)
ORDER BY (event_name, timestamp);

-- 用户属性表
CREATE TABLE user_properties (
  user_id String,
  property_key String,
  property_value String,
  updated_at DateTime
) ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (user_id, property_key);

-- 用户会话表
CREATE TABLE user_sessions (
  session_id String,
  user_id String,
  start_time DateTime,
  end_time DateTime,
  duration UInt32,
  event_count UInt16,
  platform String
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(start_time)
ORDER BY (user_id, start_time);
```

### 4.3 实时计算

```java
// Flink实时计算示例
public class RealTimeAnalytics {
    public static void main(String[] args) {
        StreamExecutionEnvironment env = 
            StreamExecutionEnvironment.getExecutionEnvironment();
        
        // 读取Kafka
        FlinkKafkaConsumer<Event> kafkaSource = new FlinkKafkaConsumer<>(
            "game-events",
            new EventSchema(),
            kafkaProps
        );
        
        DataStream<Event> events = env.addSource(kafkaSource);
        
        // 实时计算在线人数
        events
            .filter(e -> e.getEventName().equals("user_login"))
            .keyBy(Event::getPlatform)
            .window(TumblingProcessingTimeWindows.of(Time.minutes(1)))
            .aggregate(new OnlineUserCounter())
            .addSink(new RedisSink());
        
        // 实时计算收入
        events
            .filter(e -> e.getEventName().equals("payment_success"))
            .map(e -> new Revenue(e.getTimestamp(), e.getParams().getAmount()))
            .keyBy(Revenue::getCurrency)
            .window(TumblingProcessingTimeWindows.of(Time.minutes(5)))
            .sum("amount")
            .addSink(new ClickHouseSink());
        
        env.execute("Game Analytics");
    }
}
```

---

## 五、AB测试系统

### 5.1 测试配置

```typescript
// AB测试配置
interface ABTestConfig {
  testId: string;
  testName: string;
  startTime: number;
  endTime: number;
  traffic: number; // 流量占比 0-1
  groups: {
    control: ABGroup;
    variants: ABGroup[];
  };
  metrics: string[]; // 关注的指标
}

// 分组逻辑
class ABTestManager {
  private tests: Map<string, ABTestConfig> = new Map();
  
  // 获取用户分组
  getGroup(userId: string, testId: string): string {
    const test = this.tests.get(testId);
    if (!test || !this.isActive(test)) return 'control';
    
    // 哈希分桶
    const hash = this.hashUser(userId + testId);
    const bucket = hash % 100;
    
    // 分配分组
    let cumulative = 0;
    for (const group of [test.groups.control, ...test.groups.variants]) {
      cumulative += group.traffic * 100;
      if (bucket < cumulative) return group.id;
    }
    
    return 'control';
  }
  
  // 上报实验事件
  trackExperiment(event: string, userId: string, testId: string): void {
    const group = this.getGroup(userId, testId);
    AnalyticsManager.getInstance().track('abtest_event', {
      test_id: testId,
      group,
      event
    });
  }
}
```

### 5.2 实验报告

```sql
-- AB测试结果分析
SELECT 
  test_id,
  group_id,
  COUNT(DISTINCT user_id) as users,
  COUNT(CASE WHEN event_name = 'payment_success' THEN 1 END) as converters,
  SUM(CASE WHEN event_name = 'payment_success' THEN params.amount ELSE 0 END) as revenue
FROM events
WHERE event_name IN ('abtest_assign', 'payment_success')
  AND timestamp BETWEEN '2026-03-01' AND '2026-03-15'
GROUP BY test_id, group_id;
```

---

## 六、数据安全

### 6.1 数据脱敏

```typescript
// 敏感信息加密
function maskUserId(userId: string): string {
  return userId.substring(0, 4) + '****' + userId.substring(-4);
}

function maskDeviceId(deviceId: string): string {
  return crypto.createHash('sha256')
    .update(deviceId)
    .digest('hex')
    .substring(0, 16);
}
```

### 6.2 权限控制

```sql
-- 数据访问权限
CREATE TABLE data_access_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64),
  query_type VARCHAR(32),
  tables_accessed VARCHAR(256),
  query_time TIMESTAMP,
  ip_address VARCHAR(64)
);
```

---

*文档完成 - 等待实施*
