#!/usr/bin/env python3
"""
记忆回收者 - AI美术资源全自动生成脚本
使用 Pollinations.AI API (免费，无需注册)
"""

import requests
import urllib.parse
import os
import time
import json
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# 配置
OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/images/generated"
API_BASE = "https://image.pollinations.ai/prompt"
MAX_WORKERS = 3  # 并发数，避免过载
RETRY_COUNT = 3  # 失败重试次数

# 确保输出目录存在
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/characters", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/cards", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/ui", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/scenes", exist_ok=True)

# 主角立绘配置 (6角色 × 3版本 = 18张)
CHARACTERS = [
    {
        "id": "jin_yu",
        "name": "烬羽",
        "element": "fire",
        "role": "武士",
        "gender": "male",
        "versions": {
            "normal": "anime character, fire samurai warrior, young male, black short hair, orange red armor, flaming katana sword, battle pose, fire effects, full body, high quality, detailed, game character art style, 8k, transparent background",
            "awakened": "anime character, fire samurai AWAKENED form, young male, long red hair flowing, golden fire armor, giant flaming sword, fire wings behind, intense expression, full body, epic quality, divine aura, game character art style, 8k, transparent background",
            "chibi": "chibi anime character, cute fire samurai, young male, big head small body, orange red armor, tiny flaming sword, smiling expression, full body, kawaii style, game character art style, transparent background"
        }
    },
    {
        "id": "shuang_ren", 
        "name": "霜刃",
        "element": "water",
        "role": "刺客",
        "gender": "female",
        "versions": {
            "normal": "anime character, ice assassin ninja, young female, long silver white hair, blue skin tight leather armor, dual ice crystal daggers, agile pose, ice effects, full body, high quality, detailed, game character art style, 8k, transparent background",
            "awakened": "anime character, ice queen AWAKENED form, young female, long ice blue hair flowing, crystal ice armor, ice wings, giant ice blade, cold expression, full body, epic quality, frost aura, game character art style, 8k, transparent background",
            "chibi": "chibi anime character, cute ice assassin, young female, big head small body, blue leather outfit, tiny ice daggers, winking expression, full body, kawaii style, game character art style, transparent background"
        }
    },
    {
        "id": "lei_yin",
        "name": "雷音", 
        "element": "metal",
        "role": "法师",
        "gender": "male",
        "versions": {
            "normal": "anime character, thunder lightning mage, middle aged male, long purple hair, golden robe, thunder staff, majestic pose, lightning effects, full body, high quality, detailed, game character art style, 8k, transparent background",
            "awakened": "anime character, thunder god AWAKENED form, middle aged male, white hair flowing, golden thunder armor, thunder halo behind, thunder staff scepter, majestic expression, full body, epic quality, divine aura, game character art style, 8k, transparent background",
            "chibi": "chibi anime character, cute thunder mage, middle aged male, big head small body, purple robe, tiny thunder staff, wise expression, full body, kawaii style, game character art style, transparent background"
        }
    },
    {
        "id": "qing_lan",
        "name": "青岚",
        "element": "wood", 
        "role": "射手",
        "gender": "female",
        "versions": {
            "normal": "anime character, wind archer ranger, young female, long green hair, forest green cloak, wind elemental bow, aiming pose, wind effects, full body, high quality, detailed, game character art style, 8k, transparent background",
            "awakened": "anime character, wind goddess AWAKENED form, young female, green hair flowing, nature armor, wind wings, giant wind bow, focused expression, full body, epic quality, nature aura, game character art style, 8k, transparent background",
            "chibi": "chibi anime character, cute wind archer, young female, big head small body, green cloak, tiny bow, cheerful expression, full body, kawaii style, game character art style, transparent background"
        }
    },
    {
        "id": "yue_chen",
        "name": "岳尘",
        "element": "earth",
        "role": "坦克",
        "gender": "male",
        "versions": {
            "normal": "anime character, earth guardian tank, male, brown hair, heavy stone armor, giant shield, defensive stance, earth effects, full body, high quality, detailed, game character art style, 8k, transparent background",
            "awakened": "anime character, earth titan AWAKENED form, male, rocky hair, earth elemental armor, mountain shield, fortress stance, full body, epic quality, earth aura, game character art style, 8k, transparent background",
            "chibi": "chibi anime character, cute earth guardian, male, big head small body, stone armor, tiny shield, determined expression, full body, kawaii style, game character art style, transparent background"
        }
    },
    {
        "id": "you_zhu",
        "name": "幽烛",
        "element": "dark",
        "role": "牧师",
        "gender": "female",
        "versions": {
            "normal": "anime character, dark light priestess, young female, long black hair with purple highlights, dark elegant robe, shadow staff, mystical pose, dark light effects, full body, high quality, detailed, game character art style, 8k, transparent background",
            "awakened": "anime character, shadow light goddess AWAKENED form, young female, hair flowing with shadows, dark light armor, shadow wings, dual light shadow orbs, mysterious expression, full body, epic quality, divine aura, game character art style, 8k, transparent background",
            "chibi": "chibi anime character, cute dark priestess, young female, big head small body, dark robe, tiny shadow staff, gentle expression, full body, kawaii style, game character art style, transparent background"
        }
    }
]

# 卡牌生成配置 (每元素100张)
CARD_ELEMENTS = {
    "fire": {"name": "火", "color": "red", "creatures": ["phoenix", "dragon", "salamander", "fire spirit", "lava golem", "flame wolf", "ember fairy"]},
    "water": {"name": "水", "color": "blue", "creatures": ["water dragon", "sea serpent", "mermaid", "water elemental", "ice phoenix", "tidal beast", "coral spirit"]},
    "wood": {"name": "木", "color": "green", "creatures": ["treant", "dryad", "forest dragon", "nature spirit", "venus flytrap", "jungle cat", "seedling fairy"]},
    "metal": {"name": "金", "color": "gold", "creatures": ["golden dragon", "mechanical bird", "steel golem", "lightning eagle", "iron knight", "brass automaton", "silver wolf"]},
    "earth": {"name": "土", "color": "brown", "creatures": ["stone golem", "earth dragon", "sand worm", "mountain giant", "crystal tortoise", "mud elemental", "rock spirit"]}
}

def generate_image(prompt, save_path, width=1024, height=1024, seed=None):
    """调用Pollinations.AI生成图片"""
    if seed is None:
        seed = int(time.time() * 1000) % 1000000
    
    params = {
        "seed": seed,
        "width": width,
        "height": height,
        "nologo": "true",
        "private": "true", 
        "model": "flux",
        "enhance": "true"
    }
    
    encoded_prompt = urllib.parse.quote(prompt)
    query_params = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"{API_BASE}/{encoded_prompt}?{query_params}"
    
    for attempt in range(RETRY_COUNT):
        try:
            response = requests.get(url, timeout=120)
            if response.status_code == 200:
                os.makedirs(os.path.dirname(save_path), exist_ok=True)
                with open(save_path, 'wb') as f:
                    f.write(response.content)
                return True, None
            else:
                error = f"HTTP {response.status_code}"
        except Exception as e:
            error = str(e)
        
        if attempt < RETRY_COUNT - 1:
            time.sleep(5 * (attempt + 1))  # 指数退避
    
    return False, error

def generate_character_task(char_data, version_name, prompt):
    """生成单个角色立绘任务"""
    filename = f"{OUTPUT_DIR}/characters/{char_data['id']}_{version_name}.png"
    
    # 如果已存在则跳过
    if os.path.exists(filename):
        return True, char_data['name'], version_name, "skipped"
    
    success, error = generate_image(prompt, filename, width=1024, height=1024)
    
    if success:
        # 生成1024x1024后，自动创建512x512缩略图
        try:
            from PIL import Image
            img = Image.open(filename)
            img.thumbnail((512, 512))
            thumb_filename = filename.replace('.png', '_512.png')
            img.save(thumb_filename)
        except:
            pass  # 缩略图失败不影响主图
        return True, char_data['name'], version_name, "success"
    else:
        return False, char_data['name'], version_name, error

def generate_all_characters():
    """生成所有主角立绘 (18张)"""
    print("=" * 60)
    print("开始生成主角立绘 (18张)")
    print("=" * 60)
    
    tasks = []
    for char in CHARACTERS:
        for version_name, prompt in char['versions'].items():
            tasks.append((char, version_name, prompt))
    
    results = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_task = {
            executor.submit(generate_character_task, char, version, prompt): (char['name'], version)
            for char, version, prompt in tasks
        }
        
        for future in as_completed(future_to_task):
            success, char_name, version, status = future.result()
            results.append((success, char_name, version, status))
            
            if success:
                print(f"✅ {char_name} - {version}: {status}")
            else:
                print(f"❌ {char_name} - {version}: {status}")
            
            time.sleep(2)  # 避免请求过快
    
    # 统计
    success_count = sum(1 for r in results if r[0])
    print(f"\n主角立绘生成完成: {success_count}/{len(tasks)} 成功")
    return success_count == len(tasks)

def generate_card(element, index, total):
    """生成单张卡牌"""
    elem_data = CARD_ELEMENTS[element]
    creature = elem_data["creatures"][index % len(elem_data["creatures"])]
    
    # 随机稀有度视觉风格
    rarities = ["common", "rare", "epic", "legendary"]
    rarity = rarities[index % 4]
    
    prompt = f"game card illustration, {element} attribute {creature}, fantasy art style, {rarity} quality, detailed, vibrant colors, {elem_data['color']} gradient background, 4k, digital art"
    
    filename = f"{OUTPUT_DIR}/cards/card_{element}_{index:03d}.png"
    
    if os.path.exists(filename):
        return True, f"{element}_{index}", "skipped"
    
    success, error = generate_image(prompt, filename, width=512, height=768)
    return success, f"{element}_{index}", "success" if success else error

def generate_all_cards():
    """生成所有卡牌 (700张 = 140张/元素 × 5元素)"""
    print("\n" + "=" * 60)
    print("开始生成卡牌 (700张)")
    print("=" * 60)
    
    cards_per_element = 140
    total_cards = cards_per_element * 5
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = []
        for element in CARD_ELEMENTS:
            for i in range(cards_per_element):
                future = executor.submit(generate_card, element, i, total_cards)
                futures.append((future, element, i))
        
        success_count = 0
        for future, element, idx in futures:
            try:
                success, name, status = future.result()
                if success:
                    success_count += 1
                    if success_count % 50 == 0:
                        print(f"🎴 进度: {success_count}/{total_cards}")
                else:
                    print(f"❌ {name}: {status}")
            except Exception as e:
                print(f"❌ Error: {e}")
            
            time.sleep(1)  # 控制速率
    
    print(f"\n卡牌生成完成: {success_count}/{total_cards} 成功")
    return success_count

def generate_ui_assets():
    """生成UI素材"""
    print("\n" + "=" * 60)
    print("开始生成UI素材")
    print("=" * 60)
    
    ui_prompts = [
        ("button_normal", "game UI button, rectangular, blue gradient, glossy, fantasy style, transparent background, game asset"),
        ("button_hover", "game UI button, rectangular, blue gradient glowing, glossy, fantasy style, transparent background, game asset"),
        ("button_disabled", "game UI button, rectangular, gray, inactive, fantasy style, transparent background, game asset"),
        ("frame_common", "game UI frame border, bronze metal, common quality, fantasy style, transparent background, game asset"),
        ("frame_rare", "game UI frame border, silver metal, rare quality, glowing, fantasy style, transparent background, game asset"),
        ("frame_epic", "game UI frame border, gold metal, epic quality, glowing, fantasy style, transparent background, game asset"),
        ("frame_legendary", "game UI frame border, rainbow crystal, legendary quality, magical glow, fantasy style, transparent background, game asset"),
        ("hp_bar", "game UI health bar, red gradient, segmented, fantasy style, transparent background, game asset"),
        ("mp_bar", "game UI mana bar, blue gradient, segmented, fantasy style, transparent background, game asset"),
        ("exp_bar", "game UI experience bar, green gradient, fantasy style, transparent background, game asset"),
        ("icon_gold", "game UI icon, gold coin, shiny, fantasy style, transparent background, game asset"),
        ("icon_gem", "game UI icon, purple gem, shiny, fantasy style, transparent background, game asset"),
        ("icon_energy", "game UI icon, lightning bolt, yellow, fantasy style, transparent background, game asset"),
    ]
    
    success_count = 0
    for name, prompt in ui_prompts:
        filename = f"{OUTPUT_DIR}/ui/{name}.png"
        success, error = generate_image(prompt, filename, width=256, height=256)
        if success:
            success_count += 1
            print(f"✅ UI: {name}")
        else:
            print(f"❌ UI: {name} - {error}")
        time.sleep(2)
    
    print(f"\nUI素材生成完成: {success_count}/{len(ui_prompts)}")
    return success_count

def generate_scene_backgrounds():
    """生成场景背景"""
    print("\n" + "=" * 60)
    print("开始生成场景背景")
    print("=" * 60)
    
    scenes = [
        ("main_city", "fantasy game main city background, bustling marketplace, medieval architecture, sunny day, vibrant colors, wide angle, game background art, 4k"),
        ("battle_arena", "fantasy battle arena background, ancient ruins, dramatic lighting, stormy sky, epic atmosphere, game background art, 4k"),
        ("gacha_summon", "mystical summoning chamber background, magic circle, glowing crystals, purple and gold theme, game background art, 4k"),
        ("guild_hall", "fantasy guild hall interior background, stone walls, banners, cozy fireplace, game background art, 4k"),
        ("tower_climb", "endless tower interior background, floating platforms, cosmic void, mysterious atmosphere, game background art, 4k"),
    ]
    
    success_count = 0
    for name, prompt in scenes:
        filename = f"{OUTPUT_DIR}/scenes/{name}.png"
        success, error = generate_image(prompt, filename, width=1920, height=1080)
        if success:
            success_count += 1
            print(f"✅ Scene: {name}")
        else:
            print(f"❌ Scene: {name} - {error}")
        time.sleep(3)
    
    print(f"\n场景背景生成完成: {success_count}/{len(scenes)}")
    return success_count

def main():
    """主函数 - 执行完整生成流程"""
    start_time = datetime.now()
    print("\n" + "🎨" * 30)
    print("记忆回收者 - AI美术资源全自动生成")
    print("使用 Pollinations.AI API (免费，无需注册)")
    print("🎨" * 30 + "\n")
    
    # 记录生成日志
    log_file = f"{OUTPUT_DIR}/generation_log.txt"
    
    # 1. 生成主角立绘
    char_success = generate_all_characters()
    
    # 2. 生成UI素材
    ui_count = generate_ui_assets()
    
    # 3. 生成场景背景
    scene_count = generate_scene_backgrounds()
    
    # 4. 生成卡牌 (分批进行，避免时间过长)
    print("\n" + "=" * 60)
    print("卡牌生成将在后续批次中进行")
    print("(700张卡牌将分多批次完成)")
    print("=" * 60)
    
    # 先生成前50张卡牌作为测试
    print("\n生成前50张测试卡牌...")
    card_count = 0
    elements = list(CARD_ELEMENTS.keys())
    for i in range(50):
        element = elements[i % 5]
        success, name, status = generate_card(element, i, 50)
        if success:
            card_count += 1
        time.sleep(1)
    
    end_time = datetime.now()
    duration = end_time - start_time
    
    # 输出总结
    print("\n" + "=" * 60)
    print("生成完成总结")
    print("=" * 60)
    print(f"耗时: {duration}")
    print(f"输出目录: {OUTPUT_DIR}")
    print(f"主角立绘: 18张 {'✅' if char_success else '⚠️'}")
    print(f"UI素材: {ui_count}/13 {'✅' if ui_count == 13 else '⚠️'}")
    print(f"场景背景: {scene_count}/5 {'✅' if scene_count == 5 else '⚠️'}")
    print(f"测试卡牌: {card_count}/50 {'✅' if card_count == 50 else '⚠️'}")
    
    # 写入日志
    with open(log_file, 'a') as f:
        f.write(f"[{datetime.now()}] 生成完成\n")
        f.write(f"主角立绘: 18张\n")
        f.write(f"UI素材: {ui_count}/13\n")
        f.write(f"场景: {scene_count}/5\n")
        f.write(f"测试卡牌: {card_count}/50\n")
        f.write("-" * 40 + "\n")
    
    print(f"\n📁 所有文件已保存至: {OUTPUT_DIR}")
    print("🎉 第一批美术资源生成完成！")

if __name__ == "__main__":
    main()
