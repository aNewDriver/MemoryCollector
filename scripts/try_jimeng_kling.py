#!/usr/bin/env python3
"""
即梦(Dreamina) / 可灵(Kling) AI图像生成脚本
尝试调用字节跳动旗下的AI平台API
"""

import urllib.request
import urllib.parse
import json
import os
import time
from pathlib import Path

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent.parent / "assets" / "resources" / "images" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 角色配置
CHARACTERS = [
    {
        "id": "jin_yu",
        "name": "烬羽",
        "prompt": "古风女战士，凤凰主题铠甲，火焰纹路，手持长刀，英姿飒爽，20岁，黑色长发带红色挑染，金色眼睛，赤红与黑色相间的轻甲，凤凰翅膀形状的肩甲，破损飘逸的披风，刀刃有熔岩般的纹路，眼神坚定而悲伤，侧身拔刀姿势，黄昏下燃烧的村庄废墟背景，空中漂浮着火星和灰烬，戏剧性金色时光照明，暖橙红色调为主，深邃黑色阴影，国风二次元风格，高精细节，电影感，概念艺术，全身像，动态构图",
        "negative": "低质量，模糊，水印，签名，最坏质量，畸形身体，现代服装"
    },
    {
        "id": "qing_yi",
        "name": "青漪",
        "prompt": "优雅的女琴师，飘逸的青色长裙，怀抱古琴，空灵绝美的气质，水系魔法，22岁，青色长发如瀑布，珍珠发饰，清澈蓝眼，白色丝绸上衣，宽大飘逸袖子，脚系银铃，赤足，宁静忧伤的表情，跪坐抚琴姿势，月光下的竹林背景，薄雾缭绕，蓝色光点漂浮，柔和月光，清冷蓝调，生物发光粒子，中国水墨画融合二次元风格，空灵梦幻，全身坐姿构图",
        "negative": "暖色调，鲜艳色彩，攻击性姿势，现代服装"
    },
    {
        "id": "zhu_feng",
        "name": "逐风",
        "prompt": "神秘蒙面刺客，深色紧身衣，双短刃，风系特效，潜行姿势，黑色面罩遮下半脸，锐利翠绿色眼睛，黑色短发，深绿与黑色相间的服装，皮质护甲，多个武器袋，露指手套，手臂缠绷带，短小披风，手持散发绿光的双匕首，冰冷锐利杀手眼神，蹲在建筑边缘如狩猎猎豹的姿势，风暴中的废墟城市背景，风沙树叶漩涡，阴沉乌云，动感构图，国漫风格",
        "negative": "鲜艳色彩，开心表情，静态姿势，护甲过重，露脸"
    },
    {
        "id": "yan_xin",
        "name": "岩心",
        "prompt": "魁梧重装骑士，巨塔盾，岩石质感铠甲，坚不可摧的守护者，30岁，高大肌肉身材，短发如钢针竖立，面部有伤疤，坚毅眼神，全身厚重岩石纹理板甲，山形肩甲，胸前大地宝石，可拆卸面甲头盔，破烂棕色披风，带裂纹图案的巨大塔盾，单手战锤，稳固站姿，破碎城墙或山地要塞背景，尘土飞扬的氛围，大地色调，写实动漫风格，稳健构图",
        "negative": "苗条身材，鲜艳色彩，笑容，动态姿势，现代元素"
    },
    {
        "id": "ming_zhu",
        "name": "明烛",
        "prompt": "圣洁女祭司，金色光芒，白色长袍，神圣法杖，慈悲之心，25岁，金色编发，金色皇冠，温暖琥珀色眼睛，白色金色相间圣袍，太阳刺绣，金色腰带配十字架，金色饰品，手持散发光芒的神圣法杖，温柔慈悲表情，温和微笑，站立或优雅飘浮，光芒四射的神殿或云端圣所背景，金色光束，漂浮光点，天使符号，温暖神圣氛围，神圣幻想艺术，国漫风格",
        "negative": "暗色调，阴影，邪恶，暗黑背景"
    },
    {
        "id": "can_ying",
        "name": "残影",
        "prompt": "神秘人影轮廓，记忆碎片，虚空实体，破碎现实，空灵，修长身形由记忆碎片构成，碎片间透出幽蓝虚空光芒，面部被阴影遮蔽，复杂情感的眼睛，半透明身体能看到不同场景的片段闪现，蓝色微光影刃，神秘伸手向观众姿势，纯粹虚空或星空背景，遥远星云，漂浮记忆碎片，深蓝与黑色，青色高光，抽象超现实，神秘氛围，国漫风格",
        "negative": "实体形态，鲜艳色彩，清晰特征，开心，简单背景"
    }
]

def generate_with_dreamina(prompt, negative_prompt="", width=1024, height=1820):
    """
    尝试调用即梦(Dreamina) API
    即梦是字节跳动的AI绘图产品
    """
    # 尝试即梦的API端点
    # 注意：这可能需要登录态或API密钥
    
    urls_to_try = [
        # 即梦可能的API端点
        "https://jimeng.jianying.com/api/v1/generate",
        "https://dreamina.iesdouyin.com/api/v1/generate",
        # 可灵可能的API端点
        "https://klingai.com/api/v1/generate",
    ]
    
    payload = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": width,
        "height": height,
        "num_images": 1,
        "guidance_scale": 7.5,
        "num_inference_steps": 30
    }
    
    data = json.dumps(payload).encode('utf-8')
    
    for url in urls_to_try:
        try:
            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0',
                'Accept': 'application/json'
            }
            
            req = urllib.request.Request(url, data=data, headers=headers, method='POST', timeout=30)
            
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                return result
                
        except urllib.error.HTTPError as e:
            print(f"    {url}: HTTP {e.code}")
            continue
        except Exception as e:
            print(f"    {url}: {str(e)[:50]}")
            continue
    
    return None

def try_web_scrape_approach():
    """
    尝试网页抓取方式（如果API不可用）
    """
    print("\n⚠️ 即梦/可灵的API需要：")
    print("   1. 登录账号获取Cookie/Token")
    print("   2. 或者企业版API密钥")
    print("   3. 或者通过Selenium模拟浏览器操作")
    print("\n💡 替代方案：")
    print("   请手动访问以下平台，复制Prompt生成图片：")
    print("   - 即梦: https://jimeng.jianying.com")
    print("   - 可灵: https://klingai.com")
    print("   - 通义万相: https://tongyi.aliyun.com/wanxiang")
    print("   - 文心一格: https://yige.baidu.com")
    return False

def main():
    print("🎨 即梦/可灵 AI图像生成尝试")
    print("=" * 50)
    print(f"输出目录: {OUTPUT_DIR}")
    print()
    
    # 首先尝试API调用
    print("🔄 尝试调用即梦/可灵API...")
    print("-" * 50)
    
    result = generate_with_dreamina(CHARACTERS[0]["prompt"], CHARACTERS[0]["negative"])
    
    if result:
        print("✅ API调用成功！")
        print(f"结果: {result}")
    else:
        print("\n❌ API调用失败（需要认证或网络限制）")
        try_web_scrape_approach()
    
    # 生成参考文档
    print("\n" + "=" * 50)
    print("📝 生成Prompt参考文档...")
    
    md_content = """# 即梦/可灵 生成指南

## 平台链接

- **即梦 (Dreamina)**: https://jimeng.jianying.com
- **可灵 (Kling)**: https://klingai.com
- **通义万相**: https://tongyi.aliyun.com/wanxiang
- **文心一格**: https://yige.baidu.com

## 角色Prompt

"""
    
    for char in CHARACTERS:
        md_content += f"""### {char['name']}

**正面Prompt:**
```
{char['prompt']}
```

**负面Prompt:**
```
{char['negative']}
```

**推荐设置:**
- 比例: 9:16 (竖屏)
- 分辨率: 1024 x 1820
- 风格: 国风/二次元/动漫

---

"""
    
    output_file = OUTPUT_DIR.parent.parent / "docs" / "ai_generation" / "jimeng_kling_guide.md"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print(f"✅ 已生成: {output_file}")
    
    print("\n💡 提示:")
    print("   由于即梦/可灵API需要登录认证，请手动访问平台网站")
    print("   复制上面的Prompt进行生成")
    print("   生成的图片请保存到: assets/resources/images/cards/")

if __name__ == "__main__":
    main()
