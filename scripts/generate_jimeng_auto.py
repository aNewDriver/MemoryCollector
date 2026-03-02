#!/usr/bin/env python3
"""
即梦AI图像生成 - 完整版
根据火山引擎官方文档实现正确的签名调用
"""

import requests
import json
import hashlib
import hmac
import base64
import time
import urllib.parse
from pathlib import Path
from datetime import datetime, timezone

# API配置
ACCESS_KEY_ID = "AKLTMTYxNDdmZWM5YTEzNDBlMWE2ZGU2YTE4NjZhNDIxZTc"
SECRET_ACCESS_KEY = "WmpVME1qUm1OV1ZpTW1Kak5ESmxaamxpWXpFME9ESm1aREkxTlRFNE16Yw=="

# 服务配置
REGION = "cn-north-1"
SERVICE = "cv"
HOST = "open.volcengineapi.com"
ENDPOINT = f"https://{HOST}"

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent.parent / "assets" / "resources" / "images" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# 角色配置
CHARACTERS = [
    {
        "id": "jin_yu",
        "name": "烬羽",
        "prompt": "古风女战士，凤凰主题铠甲，火焰纹路，手持长刀，英姿飒爽，20岁，黑色长发带红色挑染，金色眼睛，赤红与黑色相间的轻甲，凤凰翅膀形状的肩甲，破损飘逸的披风，刀刃有熔岩般的纹路，眼神坚定而悲伤，侧身拔刀姿势，黄昏下燃烧的村庄废墟背景，空中漂浮着火星和灰烬，戏剧性金色时光照明，暖橙红色调为主，深邃黑色阴影，国风二次元风格，高精细节，电影感，概念艺术，全身像，动态构图",
        "negative": "低质量，模糊，水印，签名，最坏质量，畸形身体，多余肢体，现代服装，开心大笑，明亮糖果色"
    },
    {
        "id": "qing_yi",
        "name": "青漪",
        "prompt": "优雅的女琴师，飘逸的青色长裙，怀抱古琴，空灵绝美的气质，水系魔法，22岁，青色长发如瀑布，珍珠发饰，清澈蓝眼，白色丝绸上衣，宽大飘逸袖子，脚系银铃，赤足，宁静忧伤的表情，跪坐抚琴姿势，月光下的竹林背景，薄雾缭绕，蓝色光点漂浮，柔和月光，清冷蓝调，生物发光粒子，中国水墨画融合二次元风格，空灵梦幻，全身坐姿构图",
        "negative": "暖色调，鲜艳色彩，攻击性姿势，现代服装，开心大笑"
    },
    {
        "id": "zhu_feng",
        "name": "逐风",
        "prompt": "神秘蒙面刺客，深色紧身衣，双短刃，风系特效，潜行姿势，黑色面罩遮下半脸，锐利翠绿色眼睛，黑色短发，深绿与黑色相间的服装，皮质护甲，多个武器袋，露指手套，手臂缠绷带，短小披风，手持散发绿光的双匕首，冰冷锐利杀手眼神，蹲在建筑边缘如狩猎猎豹的姿势，风暴中的废墟城市背景，风沙树叶漩涡，阴沉乌云，动感构图，国漫风格",
        "negative": "鲜艳色彩，开心表情，静态姿势，护甲过重，露脸，笑容"
    },
    {
        "id": "yan_xin",
        "name": "岩心",
        "prompt": "魁梧重装骑士，巨塔盾，岩石质感铠甲，坚不可摧的守护者，30岁，高大肌肉身材，短发如钢针竖立，面部有伤疤，坚毅眼神，全身厚重岩石纹理板甲，山形肩甲，胸前大地宝石，可拆卸面甲头盔，破烂棕色披风，带裂纹图案的巨大塔盾，单手战锤，稳固站姿，破碎城墙或山地要塞背景，尘土飞扬的氛围，大地色调，写实动漫风格，稳健构图",
        "negative": "苗条身材，鲜艳色彩，笑容，动态姿势，现代元素，开心"
    },
    {
        "id": "ming_zhu",
        "name": "明烛",
        "prompt": "圣洁女祭司，金色光芒，白色长袍，神圣法杖，慈悲之心，25岁，金色编发，金色皇冠，温暖琥珀色眼睛，白色金色相间圣袍，太阳刺绣，金色腰带配十字架，金色饰品，手持散发光芒的神圣法杖，温柔慈悲表情，温和微笑，站立或优雅飘浮，光芒四射的神殿或云端圣所背景，金色光束，漂浮光点，天使符号，温暖神圣氛围，神圣幻想艺术，国漫风格",
        "negative": "暗色调，阴影，邪恶，暗黑背景，冷酷表情，黑色主调"
    },
    {
        "id": "can_ying",
        "name": "残影",
        "prompt": "神秘人影轮廓，记忆碎片，虚空实体，破碎现实，空灵，修长身形由记忆碎片构成，碎片间透出幽蓝虚空光芒，面部被阴影遮蔽，复杂情感的眼睛，半透明身体能看到不同场景的片段闪现，蓝色微光影刃，神秘伸手向观众姿势，纯粹虚空或星空背景，遥远星云，漂浮记忆碎片，深蓝与黑色，青色高光，抽象超现实，神秘氛围，国漫风格",
        "negative": "实体形态，鲜艳色彩，清晰特征，开心，简单背景，笑容"
    }
]

def sha256_hash(data):
    """计算SHA256哈希"""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return hashlib.sha256(data).hexdigest()

def get_signature_key(secret_key, date_stamp):
    """生成签名密钥 (AWS Signature V4)"""
    k_date = hmac.new(('TLS' + secret_key).encode('utf-8'), date_stamp.encode('utf-8'), hashlib.sha256).digest()
    k_region = hmac.new(k_date, REGION.encode('utf-8'), hashlib.sha256).digest()
    k_service = hmac.new(k_region, SERVICE.encode('utf-8'), hashlib.sha256).digest()
    k_signing = hmac.new(k_service, 'request'.encode('utf-8'), hashlib.sha256).digest()
    return k_signing

def create_canonical_request(method, uri, query_string, headers, payload_hash):
    """创建规范请求"""
    # CanonicalHeaders
    canonical_headers = ""
    signed_headers = ""
    for key in sorted(headers.keys()):
        canonical_headers += f"{key.lower()}:{headers[key].strip()}\n"
        signed_headers += f"{key.lower()};"
    signed_headers = signed_headers[:-1]  # 去掉最后一个分号
    
    canonical_request = f"{method}\n{uri}\n{query_string}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    return canonical_request, signed_headers

def sign_request(method, uri, query_string, headers, payload):
    """签名请求"""
    now = datetime.now(timezone.utc)
    amz_date = now.strftime('%Y%m%dT%H%M%SZ')
    date_stamp = now.strftime('%Y%m%d')
    
    # 计算payload哈希
    payload_hash = sha256_hash(payload)
    
    # 创建规范请求
    canonical_request, signed_headers = create_canonical_request(
        method, uri, query_string, headers, payload_hash
    )
    
    # 创建待签名字符串
    credential_scope = f"{date_stamp}/{REGION}/{SERVICE}/request"
    string_to_sign = f"HMAC-SHA256\n{amz_date}\n{credential_scope}\n{sha256_hash(canonical_request)}"
    
    # 计算签名
    signing_key = get_signature_key(SECRET_ACCESS_KEY, date_stamp)
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    
    # 构建Authorization头
    auth_header = f"HMAC-SHA256 Credential={ACCESS_KEY_ID}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
    
    return auth_header, amz_date

def submit_task(prompt, negative_prompt="", width=1024, height=1820):
    """提交即梦图像生成任务"""
    
    # 构建请求体
    req_json = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": width,
        "height": height,
        "seed": int(time.time()) % 1000000,
        "return_url": True
    }
    
    request_body = {
        "req_key": "jimeng_t2i_v40",
        "req_json": json.dumps(req_json, ensure_ascii=False)
    }
    
    payload = json.dumps(request_body, ensure_ascii=False)
    
    # 查询参数
    query_params = {
        "Action": "SubmitTask",
        "Version": "2022-08-31"
    }
    query_string = urllib.parse.urlencode(query_params)
    
    # 请求头
    headers = {
        'Content-Type': 'application/json',
        'host': HOST,
    }
    
    # 签名
    auth_header, amz_date = sign_request('POST', '/', query_string, headers, payload)
    
    headers['X-Date'] = amz_date
    headers['Authorization'] = auth_header
    
    # 发送请求
    url = f"{ENDPOINT}/?{query_string}"
    
    try:
        print(f"  URL: {url[:60]}...")
        response = requests.post(url, data=payload.encode('utf-8'), headers=headers, timeout=60)
        
        print(f"  状态: {response.status_code}")
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"  错误: {response.text[:500]}")
            return None
            
    except Exception as e:
        print(f"  异常: {e}")
        return None

def query_task(task_id):
    """查询任务结果"""
    
    request_body = {
        "req_key": "jimeng_t2i_v40",
        "task_id": task_id
    }
    
    payload = json.dumps(request_body, ensure_ascii=False)
    
    query_params = {
        "Action": "QueryTask",
        "Version": "2022-08-31"
    }
    query_string = urllib.parse.urlencode(query_params)
    
    headers = {
        'Content-Type': 'application/json',
        'host': HOST,
    }
    
    auth_header, amz_date = sign_request('POST', '/', query_string, headers, payload)
    
    headers['X-Date'] = amz_date
    headers['Authorization'] = auth_header
    
    url = f"{ENDPOINT}/?{query_string}"
    
    try:
        response = requests.post(url, data=payload.encode('utf-8'), headers=headers, timeout=60)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"查询异常: {e}")
    
    return None

def download_image(url, output_path):
    """下载图像"""
    try:
        response = requests.get(url, timeout=60)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"下载失败: {e}")
    return False

def generate_character_art(char, version_name, width=1024, height=1820):
    """生成角色立绘"""
    
    output_filename = f"{char['id']}_{version_name}.png"
    output_path = OUTPUT_DIR / output_filename
    
    if output_path.exists():
        print(f"  ⏭ 已存在: {output_filename}")
        return True
    
    print(f"  🔄 生成 {version_name}...")
    
    # 提交任务
    result = submit_task(char['prompt'], char['negative'], width, height)
    
    if not result:
        return False
    
    print(f"  响应: {json.dumps(result, indent=2, ensure_ascii=False)[:600]}")
    
    # 提取任务ID
    task_id = None
    if 'Result' in result:
        task_id = result['Result'].get('TaskId')
    elif 'result' in result:
        task_id = result['result'].get('task_id')
    elif 'data' in result:
        task_id = result['data'].get('task_id')
    
    if not task_id:
        print(f"  ❌ 未找到任务ID")
        return False
    
    print(f"  📝 任务ID: {task_id}")
    print(f"  ⏳ 等待生成完成...")
    
    # 轮询查询结果
    max_retries = 30
    for i in range(max_retries):
        time.sleep(2)
        
        query_result = query_task(task_id)
        
        if query_result:
            print(f"  查询响应: {json.dumps(query_result, indent=2, ensure_ascii=False)[:400]}")
            
            # 检查任务状态
            status = None
            image_url = None
            
            if 'Result' in query_result:
                status = query_result['Result'].get('Status')
                image_url = query_result['Result'].get('ImageUrl') or query_result['Result'].get('ImageURLs', [None])[0]
            elif 'result' in query_result:
                status = query_result['result'].get('status')
                image_url = query_result['result'].get('image_url') or query_result['result'].get('image_urls', [None])[0]
            
            if status == 'Done' or status == 'done':
                if image_url:
                    print(f"  ✅ 生成完成，下载中...")
                    if download_image(image_url, output_path):
                        print(f"  ✅ 已保存: {output_filename}")
                        return True
                    else:
                        print(f"  ❌ 下载失败")
                        return False
                else:
                    print(f"  ❌ 未找到图片URL")
                    return False
            elif status == 'Failed' or status == 'failed':
                print(f"  ❌ 生成失败")
                return False
            else:
                print(f"  ⏳ 状态: {status}，继续等待... ({i+1}/{max_retries})")
    
    print(f"  ❌ 超时")
    return False

def main():
    print("🎨 即梦AI角色立绘自动生成")
    print("=" * 70)
    print(f"输出目录: {OUTPUT_DIR}")
    print(f"角色数量: {len(CHARACTERS)}")
    print("=" * 70)
    
    success_count = 0
    failed_count = 0
    
    for char in CHARACTERS:
        print(f"\n🎭 {char['name']}")
        print("-" * 70)
        
        # 生成全身立绘
        if generate_character_art(char, "full", 1024, 1820):
            success_count += 1
        else:
            failed_count += 1
        
        time.sleep(3)  # 请求间隔
        
        # 生成觉醒立绘
        if generate_character_art(char, "awaken", 1024, 1820):
            success_count += 1
        else:
            failed_count += 1
        
        time.sleep(3)
        
        # 生成头像
        if generate_character_art(char, "portrait", 512, 512):
            success_count += 1
        else:
            failed_count += 1
        
        time.sleep(5)  # 角色间隔
    
    print("\n" + "=" * 70)
    print("📊 生成报告")
    print("=" * 70)
    print(f"✅ 成功: {success_count} 张")
    print(f"❌ 失败: {failed_count} 张")
    print(f"📁 输出: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
