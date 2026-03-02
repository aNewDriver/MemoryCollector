#!/usr/bin/env python3
"""
即梦(Jimeng/Dreamina) AI图像生成脚本
使用字节跳动旗下的即梦平台进行批量图像生成
"""

import requests
import json
import base64
import hmac
import hashlib
import time
import os
from pathlib import Path
from datetime import datetime, timezone

# API配置
ACCESS_KEY_ID = "AKLTMTYxNDdmZWM5YTEzNDBlMWE2ZGU2YTE4NjZhNDIxZTc"
SECRET_ACCESS_KEY = "WmpVME1qUm1OV1ZpTW1Kak5ESmxaamxpWXpFME9ESm1aREkxTlRFNE16Yw=="

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent.parent / "assets" / "resources" / "images" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 角色配置
CHARACTERS = [
    {
        "id": "jin_yu",
        "name": "烬羽",
        "title": "焚天剑姬",
        "element": "fire",
        "prompts": {
            "full": "古风女战士，凤凰主题铠甲，火焰纹路，手持长刀，英姿飒爽，20岁，黑色长发带红色挑染，金色眼睛，赤红与黑色相间的轻甲，凤凰翅膀形状的肩甲，破损飘逸的披风，刀刃有熔岩般的纹路，眼神坚定而悲伤，侧身拔刀姿势，黄昏下燃烧的村庄废墟背景，空中漂浮着火星和灰烬，戏剧性金色时光照明，暖橙红色调为主，深邃黑色阴影，国风二次元风格，高精细节，电影感，概念艺术，全身像，动态构图",
            "awaken": "女战士被烈焰包围，铠甲幻化成凤凰翅膀显现，眼睛燃烧着火光，头发无重力飘浮，身后凤凰展翅，到处都是金色火焰，超凡力量，终极形态，金色光环，国风二次元，高精细节，电影级光照",
            "portrait": "古风女战士，凤凰铠甲，黑发红挑染，金色眼睛，赤黑轻甲，凤凰翅膀肩甲，飘逸披风，熔岩长刀，坚定悲伤表情，半身像，国风二次元"
        },
        "negative": "低质量，模糊，水印，签名，最坏质量，畸形身体，现代服装"
    },
    {
        "id": "qing_yi",
        "name": "青漪",
        "title": "流水琴仙",
        "element": "water",
        "prompts": {
            "full": "优雅的女琴师，飘逸的青色长裙，怀抱古琴，空灵绝美的气质，水系魔法，22岁，青色长发如瀑布，珍珠发饰，清澈蓝眼，白色丝绸上衣，宽大飘逸袖子，脚系银铃，赤足，宁静忧伤的表情，跪坐抚琴姿势，月光下的竹林背景，薄雾缭绕，蓝色光点漂浮，柔和月光，清冷蓝调，生物发光粒子，中国水墨画融合二次元风格，空灵梦幻，全身坐姿构图",
            "awaken": "天界琴师空中飘浮，被水龙环绕，长裙化作液态水流，头发如瀑布流淌，弹奏音乐产生可见水波纹，身后巨大浪潮和水龙，超凡脱俗的美貌，神圣水精灵，青色银光，空灵氛围",
            "portrait": "女琴师，青发瀑布，珍珠发饰，清澈蓝眼，飘逸青裙，白丝宽袖，怀抱古琴，宁静忧伤，半身像，国风二次元"
        },
        "negative": "暖色调，鲜艳色彩，攻击性姿势，现代服装"
    },
    {
        "id": "zhu_feng",
        "name": "逐风",
        "title": "影杀",
        "element": "wind",
        "prompts": {
            "full": "神秘蒙面刺客，深色紧身衣，双短刃，风系特效，潜行姿势，黑色面罩遮下半脸，锐利翠绿色眼睛，黑色短发，深绿与黑色相间的服装，皮质护甲，多个武器袋，露指手套，手臂缠绷带，短小披风，手持散发绿光的双匕首，冰冷锐利杀手眼神，蹲在建筑边缘如狩猎猎豹的姿势，风暴中的废墟城市背景，风沙树叶漩涡，阴沉乌云，动感构图，国漫风格",
            "awaken": "刺客以不可能的速度移动留下残影，被龙卷风包围，刀刃散发绿色风系能量，面罩部分露出强烈表情，风暴完全吞没背景，终极风系绝技，隐形速度，绿色闪电，超凡刺客",
            "portrait": "蒙面刺客，黑面罩，翠绿锐利眼睛，黑发，深绿黑衣，皮质护甲，手持绿光双匕，冰冷杀手眼神，半身像，国漫风格"
        },
        "negative": "鲜艳色彩，开心表情，静态姿势，护甲过重，露脸"
    },
    {
        "id": "yan_xin",
        "name": "岩心",
        "title": "铁壁",
        "element": "earth",
        "prompts": {
            "full": "魁梧重装骑士，巨塔盾，岩石质感铠甲，坚不可摧的守护者，30岁，高大肌肉身材，短发如钢针竖立，面部有伤疤，坚毅眼神，全身厚重岩石纹理板甲，山形肩甲，胸前大地宝石，可拆卸面甲头盔，破烂棕色披风，带裂纹图案的巨大塔盾，单手战锤，稳固站姿，破碎城墙或山地要塞背景，尘土飞扬的氛围，大地色调，写实动漫风格，稳健构图",
            "awaken": "铠甲覆盖活体岩石和水晶，身体部分与岩石融合，盾化作巨大岩墙，仅仅站立就产生地震，身后群山升起，大地泰坦形态，坚不可摧的堡垒，棕金光芒，终极防御",
            "portrait": "重装骑士，岩石铠甲，高大肌肉，短发尖刺，面部伤疤，坚毅眼神，岩石纹理板甲，山形肩甲，手持巨盾战锤，半身像，写实动漫"
        },
        "negative": "苗条身材，鲜艳色彩，笑容，动态姿势，现代元素"
    },
    {
        "id": "ming_zhu",
        "name": "明烛",
        "title": "圣光祭司",
        "element": "light",
        "prompts": {
            "full": "圣洁女祭司，金色光芒，白色长袍，神圣法杖，慈悲之心，25岁，金色编发，金色皇冠，温暖琥珀色眼睛，白色金色相间圣袍，太阳刺绣，金色腰带配十字架，金色饰品，手持散发光芒的神圣法杖，温柔慈悲表情，温和微笑，站立或优雅飘浮，光芒四射的神殿或云端圣所背景，金色光束，漂浮光点，天使符号，温暖神圣氛围，神圣幻想艺术，国漫风格",
            "awaken": "完全转化为天使形态，纯光之翼，高空飘浮，散发强烈金色光环驱散一切黑暗，眼睛发光白色，背景天国之门开启，神圣升华，终极神圣形态，超凡光芒，金白光芒爆发",
            "portrait": "圣洁女祭司，金发编辫，金色皇冠，温暖琥珀眼，白金圣袍，太阳刺绣，手持发光法杖，温柔微笑，半身像，神圣幻想艺术"
        },
        "negative": "暗色调，阴影，邪恶，暗黑背景"
    },
    {
        "id": "can_ying",
        "name": "残影",
        "title": "记忆碎片",
        "element": "dark",
        "prompts": {
            "full": "神秘人影轮廓，记忆碎片，虚空实体，破碎现实，空灵，修长身形由记忆碎片构成，碎片间透出幽蓝虚空光芒，面部被阴影遮蔽，复杂情感的眼睛，半透明身体能看到不同场景的片段闪现，蓝色微光影刃，神秘伸手向观众姿势，纯粹虚空或星空背景，遥远星云，漂浮记忆碎片，深蓝与黑色，青色高光，抽象超现实，神秘氛围，国漫风格",
            "awaken": "记忆碎片凝聚成更明确但仍空灵形态，通过碎片揭示真实身份片段，被记忆与阴影漩涡包围，眼睛展现人类全部情感，背景多重时间线汇聚，通过记忆升华，终极虚空形态",
            "portrait": "神秘剪影，记忆碎片，虚空实体，身形碎片构成，幽蓝光芒，半透明身体，复杂眼神，半身像，抽象超现实"
        },
        "negative": "实体形态，鲜艳色彩，清晰特征，开心，简单背景"
    }
]

def generate_image_jimeng(prompt, negative_prompt="", width=1024, height=1820, seed=None):
    """
    调用即梦API生成图像
    """
    # 构建请求
    timestamp = str(int(time.time()))
    
    # 请求体
    payload = {
        "model": "jimeng-2.0",  # 或其他可用模型
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": width,
        "height": height,
        "num_images": 1,
        "guidance_scale": 7.5,
        "num_inference_steps": 30
    }
    
    if seed:
        payload["seed"] = seed
    
    # 构建签名
    # 注意：这是简化的签名逻辑，实际需要根据即梦API文档调整
    string_to_sign = f"POST\n/application/json\n{timestamp}\n/api/v1/generate"
    signature = base64.b64encode(
        hmac.new(
            SECRET_ACCESS_KEY.encode(),
            string_to_sign.encode(),
            hashlib.sha256
        ).digest()
    ).decode()
    
    headers = {
        "Content-Type": "application/json",
        "X-Access-Key-ID": ACCESS_KEY_ID,
        "X-Timestamp": timestamp,
        "X-Signature": signature,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0"
    }
    
    # 尝试多个可能的API端点
    endpoints = [
        "https://jimeng.jianying.com/api/v1/generate",
        "https://api.jimeng.jianying.com/v1/generate",
        "https://jimeng-api.ixigua.com/v1/generate",
    ]
    
    for endpoint in endpoints:
        try:
            print(f"  尝试: {endpoint}")
            response = requests.post(endpoint, json=payload, headers=headers, timeout=60)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("data") or result.get("images"):
                    return result
                else:
                    print(f"    返回数据异常: {result}")
            else:
                print(f"    HTTP {response.status_code}: {response.text[:200]}")
                
        except requests.exceptions.RequestException as e:
            print(f"    请求失败: {e}")
            continue
    
    return None

def download_image(url, output_path):
    """下载图像"""
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"    下载失败: {e}")
    return False

def main():
    print("🎨 即梦AI角色立绘批量生成工具")
    print("=" * 60)
    print(f"输出目录: {OUTPUT_DIR}")
    print(f"角色数量: {len(CHARACTERS)}")
    print(f"版本数量: 3 (全身/觉醒/头像)")
    print(f"预计生成: {len(CHARACTERS) * 3} 张图像")
    print("=" * 60)
    
    # 生成统计
    success_count = 0
    failed_count = 0
    
    for char in CHARACTERS:
        print(f"\n🎭 正在生成: {char['name']} ({char['title']})")
        print("-" * 60)
        
        # 生成三个版本
        versions = [
            ("full", 1024, 1820),
            ("awaken", 1024, 1820),
            ("portrait", 512, 512)
        ]
        
        for version_name, width, height in versions:
            output_filename = f"{char['id']}_{version_name}_jimeng.png"
            output_path = OUTPUT_DIR / output_filename
            
            # 检查是否已存在
            if output_path.exists():
                print(f"  ⏭ {version_name}: 已存在 ({output_filename})")
                success_count += 1
                continue
            
            print(f"  🔄 {version_name}: 正在生成...")
            
            # 调用API
            prompt = char["prompts"][version_name]
            negative = char["negative"]
            seed = hash(char["id"] + version_name) % 1000000
            
            result = generate_image_jimeng(prompt, negative, width, height, seed)
            
            if result and (result.get("data") or result.get("images")):
                # 提取图片URL
                image_url = None
                if isinstance(result.get("data"), list) and len(result["data"]) > 0:
                    image_url = result["data"][0].get("url")
                elif isinstance(result.get("images"), list) and len(result["images"]) > 0:
                    image_url = result["images"][0].get("url")
                
                if image_url:
                    print(f"    ✅ 生成成功，正在下载...")
                    if download_image(image_url, output_path):
                        print(f"    ✅ 已保存: {output_filename}")
                        success_count += 1
                    else:
                        print(f"    ❌ 下载失败")
                        failed_count += 1
                else:
                    print(f"    ❌ 未找到图片URL: {result}")
                    failed_count += 1
            else:
                print(f"    ❌ 生成失败")
                failed_count += 1
            
            # 请求间隔，避免频率限制
            time.sleep(2)
    
    # 生成报告
    print("\n" + "=" * 60)
    print("📊 生成报告")
    print("=" * 60)
    print(f"✅ 成功: {success_count} 张")
    print(f"❌ 失败: {failed_count} 张")
    print(f"📁 输出目录: {OUTPUT_DIR}")
    
    if failed_count > 0:
        print("\n💡 提示:")
        print("   部分生成失败可能是由于:")
        print("   - API端点不正确（需要查阅即梦官方文档）")
        print("   - 认证签名逻辑需要调整")
        print("   - 网络限制或频率限制")
        print("\n   请检查即梦官方API文档获取正确的调用方式")

if __name__ == "__main__":
    main()
