#!/usr/bin/env python3
"""
即梦AI图像生成 - 基于官方文档实现
API文档: https://www.volcengine.com/docs/85621/1817045
"""

import json
import time
import requests
from pathlib import Path

# 火山引擎SDK
from volcengine.auth.SignerV4 import SignerV4
from volcengine.base.Request import Request
from volcengine.Credentials import Credentials

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
        "prompt": "古风女战士，凤凰主题铠甲，火焰纹路，手持长刀，英姿飒爽，20岁，黑色长发带红色挑染，金色眼睛，赤红与黑色相间的轻甲，凤凰翅膀形状的肩甲，破损飘逸的披风，刀刃有熔岩般的纹路，眼神坚定而悲伤，侧身拔刀姿势，黄昏下燃烧的村庄废墟背景，空中漂浮着火星和灰烬，戏剧性金色时光照明，暖橙红色调为主，深邃黑色阴影，国风二次元风格，高精细节，电影感，概念艺术，全身像，动态构图",
        "negative": "低质量，模糊，水印，签名，最坏质量，畸形身体，现代服装"
    },
    {
        "id": "qing_yi",
        "name": "青漪",
        "prompt": "优雅的女琴师，飘逸的青色长裙，怀抱古琴，空灵绝美的气质，水系魔法，22岁，青色长发如瀑布，珍珠发饰，清澈蓝眼，白色丝绸上衣，宽大飘逸袖子，脚系银铃，赤足，宁静忧伤的表情，跪坐抚琴姿势，月光下的竹林背景，薄雾缭绕，蓝色光点漂浮，柔和月光，清冷蓝调，生物发光粒子，中国水墨画融合二次元风格，空灵梦幻，全身坐姿构图",
        "negative": "暖色调，鲜艳色彩，攻击性姿势，现代服装"
    }
]

def call_volcengine_api(action, version, body_dict):
    """
    调用火山引擎API
    """
    # 创建凭证 - 使用固定值
    credentials = Credentials(ACCESS_KEY_ID, SECRET_ACCESS_KEY, "cn-north-1", "cv")
    
    # 创建请求
    request = Request()
    request.set_method("POST")
    request.set_host("open.volcengineapi.com")
    request.set_path("/")
    request.set_query({
        "Action": action,
        "Version": version
    })
    
    # 设置请求体
    request.set_body(json.dumps(body_dict, ensure_ascii=False))
    
    # 签名
    SignerV4.sign(request, credentials)
    
    # 构建URL
    url = f"https://{request.host}{request.path}?Action={action}&Version={version}"
    
    # 构建headers
    headers = {
        'Content-Type': 'application/json',
        'host': request.host,
        'x-date': request.headers.get('x-date'),
        'authorization': request.headers.get('authorization')
    }
    
    try:
        response = requests.post(url, data=request.body, headers=headers, timeout=60)
        return response.status_code, response.json() if response.status_code == 200 else response.text
    except Exception as e:
        return -1, str(e)

def submit_task(prompt, negative_prompt="", width=1024, height=1820):
    """
    提交图像生成任务
    """
    # 构建req_json
    req_json = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": width,
        "height": height,
        "seed": int(time.time()) % 1000000000,
        "return_url": True  # 返回图片URL而不是base64
    }
    
    body = {
        "req_key": "jimeng_t2i_v40",
        "req_json": json.dumps(req_json, ensure_ascii=False)
    }
    
    print(f"  提交任务...")
    print(f"  Prompt: {prompt[:50]}...")
    
    status, result = call_volcengine_api("SubmitTask", "2022-08-31", body)
    
    return status, result

def get_task_result(task_id):
    """
    查询任务结果
    """
    body = {
        "req_key": "jimeng_t2i_v40",
        "task_id": task_id
    }
    
    print(f"  查询任务结果: {task_id}")
    
    status, result = call_volcengine_api("GetTaskResult", "2022-08-31", body)
    
    return status, result

def download_image(url, output_path):
    """下载图片"""
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"    下载失败: {e}")
    return False

def generate_character(char, version_name, width, height):
    """生成单个角色版本"""
    output_filename = f"{char['id']}_{version_name}_jimeng.png"
    output_path = OUTPUT_DIR / output_filename
    
    # 检查是否已存在
    if output_path.exists():
        print(f"  ⏭ {version_name}: 已存在 ({output_filename})")
        return True
    
    print(f"\n  🎨 生成 {char['name']} - {version_name}")
    print(f"  分辨率: {width}x{height}")
    
    # 提交任务
    prompt = char["prompt"]
    if version_name == "portrait":
        # 头像版本简化prompt
        prompt = char["prompt"].split("，")[:8] + ["半身像"]
        prompt = "，".join(prompt)
    
    status, result = submit_task(prompt, char["negative"], width, height)
    
    if status != 200:
        print(f"  ❌ 提交失败: HTTP {status}")
        print(f"  错误: {result[:200] if isinstance(result, str) else result}")
        return False
    
    print(f"  ✅ 提交成功")
    print(f"  响应: {json.dumps(result, indent=2, ensure_ascii=False)[:500]}")
    
    # 提取任务ID
    task_id = None
    if isinstance(result, dict):
        if "Result" in result:
            task_id = result["Result"].get("TaskId")
        elif "result" in result:
            task_id = result["result"].get("task_id")
        elif "data" in result:
            task_id = result["data"].get("task_id")
    
    if not task_id:
        print(f"  ❌ 未获取到任务ID")
        return False
    
    print(f"  📝 任务ID: {task_id}")
    
    # 轮询查询结果
    max_retries = 30
    for i in range(max_retries):
        print(f"  ⏳ 等待结果... ({i+1}/{max_retries})")
        time.sleep(3)
        
        status, result = get_task_result(task_id)
        
        if status == 200 and isinstance(result, dict):
            # 检查任务状态
            task_status = result.get("Result", {}).get("Status") or result.get("result", {}).get("status")
            
            if task_status == "Done" or task_status == "done":
                # 获取图片URL
                image_url = result.get("Result", {}).get("ImageUrl") or result.get("result", {}).get("image_url")
                
                if image_url:
                    print(f"  ✅ 图片生成完成")
                    print(f"  📥 下载图片...")
                    
                    if download_image(image_url, output_path):
                        print(f"  ✅ 已保存: {output_filename}")
                        return True
                    else:
                        print(f"  ❌ 下载失败")
                        return False
                else:
                    print(f"  ⚠️ 未找到图片URL，尝试从base64获取...")
                    image_base64 = result.get("Result", {}).get("ImageBase64") or result.get("result", {}).get("image_base64")
                    if image_base64:
                        with open(output_path, 'wb') as f:
                            f.write(base64.b64decode(image_base64))
                        print(f"  ✅ 已保存(base64): {output_filename}")
                        return True
            elif task_status in ["Failed", "failed", "Error", "error"]:
                print(f"  ❌ 任务失败: {result}")
                return False
        
        # 继续等待
    
    print(f"  ❌ 超时，未获取到结果")
    return False

def main():
    print("🎨 即梦AI角色立绘自动生成")
    print("=" * 60)
    print(f"输出目录: {OUTPUT_DIR}")
    print(f"角色数量: {len(CHARACTERS)}")
    print("=" * 60)
    
    success_count = 0
    failed_count = 0
    
    for char in CHARACTERS:
        print(f"\n{'='*60}")
        print(f"🎭 角色: {char['name']}")
        print(f"{'='*60}")
        
        # 生成三个版本
        versions = [
            ("full", 1024, 1820),
            ("awaken", 1024, 1820),
            ("portrait", 512, 512)
        ]
        
        for version_name, width, height in versions:
            if generate_character(char, version_name, width, height):
                success_count += 1
            else:
                failed_count += 1
            
            # 请求间隔
            time.sleep(2)
    
    # 报告
    print(f"\n{'='*60}")
    print("📊 生成报告")
    print(f"{'='*60}")
    print(f"✅ 成功: {success_count} 张")
    print(f"❌ 失败: {failed_count} 张")
    print(f"📁 输出目录: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
