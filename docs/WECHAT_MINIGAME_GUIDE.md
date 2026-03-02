# 微信小游戏适配指南

**项目**: 记忆回收者  
**目标平台**: 微信小游戏  
**创建日期**: 2026-03-03  

---

## 一、技术准备

### 1.1 开发环境

| 工具 | 版本要求 | 用途 |
|------|---------|------|
| Cocos Creator | 3.8+ | 游戏开发 |
| 微信开发者工具 | 最新版 | 调试/预览/上传 |
| Node.js | 18+ | 构建工具 |

### 1.2 项目配置

```javascript
// project.json 微信小游戏配置
{
  "platforms": ["wechatgame"],
  "wechatgame": {
    "appid": "wx YOUR_APP_ID",
    "orientation": "portrait",
    "deviceOrientation": "portrait",
    "showStatusBar": false,
    "networkTimeout": {
      "request": 5000,
      "downloadFile": 10000
    }
  }
}
```

---

## 二、API适配

### 2.1 登录适配

```typescript
// platform/WechatAdapter.ts
export class WechatAdapter {
    async login(): Promise<LoginResult> {
        try {
            const res = await wx.login();
            // 发送code到后端换取openid
            const serverRes = await fetch('/api/auth/wechat', {
                method: 'POST',
                body: JSON.stringify({ code: res.code })
            });
            return await serverRes.json();
        } catch (err) {
            console.error('Wechat login failed:', err);
            throw err;
        }
    }
}
```

### 2.2 支付适配

```typescript
// 微信支付的prepay_id需要从后端获取
async requestPayment(orderInfo: OrderInfo): Promise<void> {
    const prepayRes = await fetch('/api/payment/wechat-prepay', {
        method: 'POST',
        body: JSON.stringify({
            orderId: orderInfo.orderId,
            amount: orderInfo.amount
        })
    });
    
    const { prepayId, nonceStr, timeStamp, paySign } = await prepayRes.json();
    
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            timeStamp,
            nonceStr,
            package: `prepay_id=${prepayId}`,
            signType: 'RSA',
            paySign,
            success: resolve,
            fail: reject
        });
    });
}
```

### 2.3 云存档适配

```typescript
// 使用微信的KV存储作为云存档补充
async saveToCloud(saveData: SaveData): Promise<void> {
    try {
        await wx.setUserCloudStorage({
            KVDataList: [
                { key: 'save_version', value: String(saveData.version) },
                { key: 'save_data', value: JSON.stringify(saveData) }
            ]
        });
    } catch (err) {
        console.warn('Cloud save failed, falling back to local:', err);
    }
}
```

---

## 三、性能优化

### 3.1 包体优化

| 优化项 | 目标值 | 方法 |
|--------|--------|------|
| 首包大小 | < 4MB | 资源分包 |
| 代码分包 | < 2MB | 按需加载 |
| 纹理压缩 | ASTC/ETC2 | 平台适配 |
| 音频压缩 | OGG | 降低体积 |

### 3.2 内存优化

```typescript
// 微信小游戏内存限制较严格
class MemoryManager {
    private static readonly WARNING_THRESHOLD = 200; // MB
    
    static checkMemory(): void {
        if (wx.getPerformance) {
            const mem = wx.getPerformance();
            if (mem.usedJSHeapSize > this.WARNING_THRESHOLD * 1024 * 1024) {
                // 触发资源清理
                this.releaseUnusedAssets();
            }
        }
    }
    
    private static releaseUnusedAssets(): void {
        // 清理未使用的纹理和音频
        assetManager.releaseUnused();
    }
}
```

### 3.3 帧率优化

```typescript
// 微信小游戏建议锁定30fps以节省电量
if (sys.platform === sys.Platform.WECHAT_GAME) {
    game.setFrameRate(30);
    
    // 后台运行时暂停游戏
    wx.onHide(() => {
        game.pause();
    });
    
    wx.onShow(() => {
        game.resume();
    });
}
```

---

## 四、社交功能

### 4.1 排行榜

```typescript
// 使用微信的开放数据域
async showFriendRank(): Promise<void> {
    const openDataContext = wx.getOpenDataContext();
    openDataContext.postMessage({
        action: 'showRank',
        key: 'power_rank'
    });
}

// 上报分数
async submitScore(score: number): Promise<void> {
    wx.setUserCloudStorage({
        KVDataList: [{
            key: 'power_rank',
            value: JSON.stringify({
                wxgame: {
                    score: score,
                    update_time: Math.floor(Date.now() / 1000)
                }
            })
        }]
    });
}
```

### 4.2 分享功能

```typescript
// 主动分享
async shareToFriend(): Promise<void> {
    return new Promise((resolve, reject) => {
        wx.shareAppMessage({
            title: '我在记忆回收者中获得了SSR卡牌！',
            imageUrl: canvas.toTempFilePathSync(),
            query: 'inviteCode=xxx',
            success: resolve,
            fail: reject
        });
    });
}

// 设置被动分享
wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
});

wx.onShareAppMessage(() => {
    return {
        title: '快来玩记忆回收者！',
        imageUrl: 'https://example.com/share.png'
    };
});
```

### 4.3 广告接入

```typescript
// 激励视频广告
class AdManager {
    private rewardAd: any;
    
    initRewardAd(adUnitId: string): void {
        this.rewardAd = wx.createRewardedVideoAd({ adUnitId });
        
        this.rewardAd.onLoad(() => {
            console.log('Reward ad loaded');
        });
        
        this.rewardAd.onError((err) => {
            console.error('Reward ad error:', err);
        });
    }
    
    async showRewardAd(): Promise<boolean> {
        return new Promise((resolve) => {
            this.rewardAd.show().catch(() => {
                this.rewardAd.load().then(() => this.rewardAd.show());
            });
            
            this.rewardAd.onClose((res) => {
                resolve(res.isEnded); // 是否看完
            });
        });
    }
}
```

---

## 五、审核注意事项

### 5.1 内容规范

- ✅ 游戏内容健康，无暴力/恐怖元素
- ✅ 卡牌设计符合价值观
- ✅ 抽卡概率公示
- ✅ 未成年人防沉迷系统接入

### 5.2 技术规范

- ✅ 不使用eval/new Function
- ✅ 不使用动态脚本加载
- ✅ 敏感操作必须用户触发
- ✅ 网络请求使用https

### 5.3 所需资质

1. 软件著作权
2. ICP备案
3. 文网文（如含虚拟货币）
4. 游戏版号（如需充值）

---

## 六、发布流程

```
1. Cocos Creator 构建微信小游戏
2. 微信开发者工具导入项目
3. 本地调试测试
4. 上传代码到微信后台
5. 提交审核
6. 审核通过后发布
```

---

## 七、测试清单

### 7.1 功能测试

- [ ] 登录/注册流程
- [ ] 云存档同步
- [ ] 支付流程
- [ ] 分享功能
- [ ] 排行榜显示
- [ ] 广告播放

### 7.2 性能测试

- [ ] 首屏加载时间 < 3s
- [ ] 内存占用 < 300MB
- [ ] 帧率稳定 30fps
- [ ] 无内存泄漏

### 7.3 兼容性测试

- [ ] iOS 微信
- [ ] Android 微信
- [ ] 不同分辨率适配
- [ ] 网络切换处理

---

*文档完成 - 等待实施*
