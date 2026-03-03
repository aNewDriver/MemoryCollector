# CI/CD 自动化构建配置

**项目**: 记忆回收者  
**日期**: 2026-03-03  
**目标**: 实现自动化构建、测试、部署

---

## 一、GitHub Actions 配置

### 1.1 主工作流

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # ===== 代码检查 =====
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint
    
    - name: Check TypeScript
      run: npm run type-check

  # ===== 单元测试 =====
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
        ports:
          - 3306:3306
      redis:
        image: redis
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage
      env:
        DB_HOST: localhost
        DB_PORT: 3306
        DB_USER: root
        DB_PASSWORD: root
        DB_NAME: test
        REDIS_HOST: localhost
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  # ===== 构建游戏 =====
  build-game:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Cocos Creator
      run: |
        wget -q https://download.cocos.com/CocosDashboard/v2.0.0/CocosDashboard-v2.0.0-linux.zip
        unzip -q CocosDashboard-v2.0.0-linux.zip
        ./CocosDashboard/CocosCreator --version
    
    - name: Build Web Mobile
      run: |
        ./CocosDashboard/CocosCreator \
          --project ./projects/memory-collector \
          --build "platform=web-mobile;debug=false"
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: web-mobile-build
        path: ./projects/memory-collector/build/web-mobile

  # ===== 构建后端 =====
  build-server:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd server
        npm ci
    
    - name: Build
      run: |
        cd server
        npm run build
    
    - name: Docker build
      run: |
        cd server
        docker build -t memory-collector-server:${{ github.sha }} .
```

### 1.2 发布工作流

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build all platforms
      run: |
        # Web
        npm run build:web
        # Android
        npm run build:android
        # iOS
        npm run build:ios
        # WeChat
        npm run build:wechat
    
    - name: Create Release
      uses: softprops/action-gh-release@v1
      with:
        files: |
          build/web-mobile.zip
          build/android/*.apk
          build/ios/*.ipa
        body: |
          ## 更新内容
          - 新增功能
          - Bug修复
          - 性能优化
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 二、Docker 配置

### 2.1 后端 Dockerfile

```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制构建文件
COPY dist ./dist

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动
CMD ["node", "dist/app.js"]
```

### 2.2 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - REDIS_HOST=redis
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mysql
      - redis
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: memory_collector
      MYSQL_USER: game_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./server/sql/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: always

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./build/web-mobile:/usr/share/nginx/html
    depends_on:
      - app
    restart: always

volumes:
  mysql_data:
  redis_data:
```

---

## 三、部署脚本

### 3.1 自动部署脚本

```bash
#!/bin/bash
# deploy.sh

set -e

ENV=${1:-staging}
VERSION=$(git describe --tags --always)

echo "🚀 开始部署 ${ENV} 环境..."

# 构建
echo "📦 构建应用..."
docker build -t memory-collector:${VERSION} .
docker tag memory-collector:${VERSION} memory-collector:latest

# 推送到镜像仓库
echo "☁️ 推送镜像..."
docker push memory-collector:${VERSION}
docker push memory-collector:latest

# 部署到服务器
echo "🖥️ 部署到服务器..."
ssh deploy@server << EOF
  cd /opt/memory-collector
  docker-compose pull
  docker-compose up -d
  docker system prune -f
EOF

echo "✅ 部署完成！"
```

### 3.2 回滚脚本

```bash
#!/bin/bash
# rollback.sh

VERSION=${1}

if [ -z "$VERSION" ]; then
  echo "请指定版本号: ./rollback.sh v1.0.0"
  exit 1
fi

echo "⏮️ 回滚到版本 ${VERSION}..."

ssh deploy@server << EOF
  cd /opt/memory-collector
  docker-compose down
  docker pull memory-collector:${VERSION}
  sed -i "s/memory-collector:.*/memory-collector:${VERSION}/" docker-compose.yml
  docker-compose up -d
EOF

echo "✅ 回滚完成！"
```

---

## 四、监控告警

### 4.1 Prometheus 配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'memory-collector'
    static_configs:
      - targets: ['app:3000']
    metrics_path: /metrics
```

### 4.2 Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Memory Collector Monitor",
    "panels": [
      {
        "title": "在线用户数",
        "type": "stat",
        "targets": [
          {
            "expr": "active_users"
          }
        ]
      },
      {
        "title": "API响应时间",
        "type": "graph",
        "targets": [
          {
            "expr": "http_request_duration_seconds"
          }
        ]
      },
      {
        "title": "错误率",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      }
    ]
  }
}
```

### 4.3 告警规则

```yaml
# alert-rules.yml
groups:
  - name: memory-collector
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "错误率过高"
          description: "5分钟内错误率超过5%"
      
      - alert: HighLatency
        expr: http_request_duration_seconds > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "响应时间过长"
          description: "平均响应时间超过2秒"
      
      - alert: LowActiveUsers
        expr: active_users < 100
        for: 10m
        labels:
          severity: info
        annotations:
          summary: "活跃用户数量下降"
```

---

## 五、环境配置

### 5.1 开发环境

```bash
# 启动开发环境
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# 热重载配置
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    volumes:
      - ./server/src:/app/src
    environment:
      - NODE_ENV=development
      - DEBUG=true
```

### 5.2 生产环境

```bash
# 生产环境变量
# .env.production
NODE_ENV=production
DB_HOST=mysql
DB_PORT=3306
DB_USER=game_user
DB_PASSWORD=secure_password_here
REDIS_HOST=redis
JWT_SECRET=your_secret_key_here
LOG_LEVEL=info
```

---

## 六、Git 工作流

### 6.1 分支策略

```
main        - 生产分支，只接受合并
  ↑
develop     - 开发分支，功能集成
  ↑
feature/*   - 功能分支
  ↑
hotfix/*    - 紧急修复
  ↑
release/*   - 发布分支
```

### 6.2 提交规范

```
feat: 新功能
type(scope): subject

body

footer

示例:
feat(gacha): 添加十连抽保底机制

- 实现90抽必出SSR机制
- 添加保底计数器
- 更新抽卡记录

Fixes #123
```

---

## 七、构建优化

### 7.1 缓存策略

```yaml
# .github/workflows/build.yml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 7.2 并行构建

```yaml
strategy:
  matrix:
    platform: [web-mobile, android, ios, wechat]
    
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Build ${{ matrix.platform }}
        run: npm run build:${{ matrix.platform }}
```

---

## 八、部署检查清单

```markdown
- [ ] 代码审查通过
- [ ] 单元测试通过 (>70% 覆盖率)
- [ ] 集成测试通过
- [ ] 性能测试通过 (FPS >= 30)
- [ ] 安全扫描通过
- [ ] 版本号更新
- [ ] 更新日志编写
- [ ] 数据库迁移脚本
- [ ] 回滚方案准备
- [ ] 监控告警配置
```

---

*文档完成 - 等待实施*
