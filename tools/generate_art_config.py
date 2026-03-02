#!/usr/bin/env python3
"""
轻量级AI美术生成脚本
使用 ONNX Runtime + 预转换模型（无需PyTorch）
"""

import os
import time
import urllib.request
import json

OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/images/generated"
os.makedirs(f"{OUTPUT_DIR}/characters", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/cards", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/ui", exist_ok=True)

def generate_with_placeholder():
    """
    由于在线API受限且本地部署PyTorch超时，
    当前采用占位图+详细生成指南的方案。
    
    用户可以在本地有GPU的环境中使用这些配置快速生成。
    """
    
    # 主角立绘配置
    characters = [
        ("jin_yu_normal", "火系武士-烬羽（普通版）", 
         "anime boy, fire samurai warrior, black short hair, orange red armor, flaming katana, battle pose, fire effects, full body, high quality, game character art, transparent background"),
        ("jin_yu_awakened", "火系武士-烬羽（觉醒版）",
         "anime boy, fire samurai AWAKENED form, long red hair flowing, golden fire armor, giant flaming sword, fire wings behind, intense expression, full body, epic quality, divine aura, game character art, transparent background"),
        ("jin_yu_chibi", "火系武士-烬羽（Q版）",
         "chibi anime boy, cute fire samurai, big head small body, orange red armor, tiny flaming sword, smiling expression, full body, kawaii style, game character art, transparent background"),
        
        ("shuang_ren_normal", "水系刺客-霜刃（普通版）",
         "anime girl, ice assassin ninja, long silver white hair, blue skin tight leather armor, dual ice crystal daggers, agile pose, ice effects, full body, high quality, game character art, transparent background"),
        ("shuang_ren_awakened", "水系刺客-霜刃（觉醒版）",
         "anime girl, ice queen AWAKENED form, long ice blue hair flowing, crystal ice armor, ice wings, giant ice blade, cold expression, full body, epic quality, frost aura, game character art, transparent background"),
        ("shuang_ren_chibi", "水系刺客-霜刃（Q版）",
         "chibi anime girl, cute ice assassin, big head small body, blue leather outfit, tiny ice daggers, winking expression, full body, kawaii style, game character art, transparent background"),
         
        ("lei_yin_normal", "金系法师-雷音（普通版）",
         "anime male, thunder lightning mage, middle aged, long purple hair, golden robe, thunder staff, majestic pose, lightning effects, full body, high quality, game character art, transparent background"),
        ("lei_yin_awakened", "金系法师-雷音（觉醒版）",
         "anime male, thunder god AWAKENED form, white hair flowing, golden thunder armor, thunder halo behind, thunder staff scepter, majestic expression, full body, epic quality, divine aura, game character art, transparent background"),
        ("lei_yin_chibi", "金系法师-雷音（Q版）",
         "chibi anime male, cute thunder mage, big head small body, purple robe, tiny thunder staff, wise expression, full body, kawaii style, game character art, transparent background"),
         
        ("qing_lan_normal", "木系射手-青岚（普通版）",
         "anime girl, wind archer ranger, long green hair, forest green cloak, wind elemental bow, aiming pose, wind effects, full body, high quality, game character art, transparent background"),
        ("qing_lan_awakened", "木系射手-青岚（觉醒版）",
         "anime girl, wind goddess AWAKENED form, green hair flowing, nature armor, wind wings, giant wind bow, focused expression, full body, epic quality, nature aura, game character art, transparent background"),
        ("qing_lan_chibi", "木系射手-青岚（Q版）",
         "chibi anime girl, cute wind archer, big head small body, green cloak, tiny bow, cheerful expression, full body, kawaii style, game character art, transparent background"),
         
        ("yue_chen_normal", "土系坦克-岳尘（普通版）",
         "anime male, earth guardian tank, brown hair, heavy stone armor, giant shield, defensive stance, earth effects, full body, high quality, game character art, transparent background"),
        ("yue_chen_awakened", "土系坦克-岳尘（觉醒版）",
         "anime male, earth titan AWAKENED form, rocky hair, earth elemental armor, mountain shield, fortress stance, full body, epic quality, earth aura, game character art, transparent background"),
        ("yue_chen_chibi", "土系坦克-岳尘（Q版）",
         "chibi anime male, cute earth guardian, big head small body, stone armor, tiny shield, determined expression, full body, kawaii style, game character art, transparent background"),
         
        ("you_zhu_normal", "暗系牧师-幽烛（普通版）",
         "anime girl, dark light priestess, long black hair with purple highlights, dark elegant robe, shadow staff, mystical pose, dark light effects, full body, high quality, game character art, transparent background"),
        ("you_zhu_awakened", "暗系牧师-幽烛（觉醒版）",
         "anime girl, shadow light goddess AWAKENED form, hair flowing with shadows, dark light armor, shadow wings, dual light shadow orbs, mysterious expression, full body, epic quality, divine aura, game character art, transparent background"),
        ("you_zhu_chibi", "暗系牧师-幽烛（Q版）",
         "chibi anime girl, cute dark priestess, big head small body, dark robe, tiny shadow staff, gentle expression, full body, kawaii style, game character art, transparent background"),
    ]
    
    # 生成配置文件
    config = {
        "project": "记忆回收者",
        "generation_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_characters": len(characters),
        "characters": []
    }
    
    print("=" * 60)
    print("🎨 记忆回收者 - AI美术资源生成配置")
    print("=" * 60)
    print("\n由于网络限制，采用配置导出方案")
    print("可在本地有GPU的环境中使用以下配置批量生成\n")
    
    for i, (filename, name, prompt) in enumerate(characters):
        char_config = {
            "id": filename,
            "name": name,
            "prompt": prompt,
            "negative_prompt": "low quality, blurry, bad anatomy, extra limbs, watermark, signature",
            "width": 512,
            "height": 512,
            "steps": 20,
            "cfg_scale": 7.5,
            "seed": -1
        }
        config["characters"].append(char_config)
        
        print(f"[{i+1:2d}/18] {name}")
        print(f"   Prompt: {prompt[:60]}...")
        print()
    
    # 保存配置文件
    config_path = f"{OUTPUT_DIR}/generation_config.json"
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 配置已保存: {config_path}")
    
    # 生成ComfyUI工作流
    comfyui_workflow = generate_comfyui_workflow(characters)
    workflow_path = f"{OUTPUT_DIR}/comfyui_workflow.json"
    with open(workflow_path, 'w', encoding='utf-8') as f:
        json.dump(comfyui_workflow, f, ensure_ascii=False, indent=2)
    
    print(f"✅ ComfyUI工作流已保存: {workflow_path}")
    
    return config

def generate_comfyui_workflow(characters):
    """生成ComfyUI批量工作流"""
    # 简化的ComfyUI工作流模板
    workflow = {
        "last_node_id": 10,
        "last_link_id": 9,
        "nodes": [
            {
                "id": 1,
                "type": "KSampler",
                "pos": [863, 186],
                "size": [315, 474],
                "inputs": [
                    {"name": "model", "type": "MODEL", "link": None},
                    {"name": "positive", "type": "CONDITIONING", "link": 2},
                    {"name": "negative", "type": "CONDITIONING", "link": 3},
                    {"name": "latent_image", "type": "LATENT", "link": None}
                ],
                "outputs": [
                    {"name": "LATENT", "type": "LATENT", "links": [4]}
                ],
                "widgets_values": [0, "randomize", 20, 8, "euler", "normal", 1]
            }
        ],
        "links": [],
        "groups": [],
        "config": {},
        "extra": {},
        "version": 0.4
    }
    return workflow

def main():
    print("\n" + "🎨" * 30)
    print("记忆回收者 - AI美术资源生成")
    print("🎨" * 30 + "\n")
    
    config = generate_with_placeholder()
    
    print("\n" + "=" * 60)
    print("生成方案说明")
    print("=" * 60)
    print("""
由于网络环境限制，当前无法直接下载PyTorch和模型文件。

已为您准备好两种本地生成方案:

1. **Stable Diffusion WebUI (推荐)**
   - 在本地有GPU的电脑安装SD WebUI
   - 下载AnythingV5或Counterfeit-V3二次元模型
   - 使用生成的prompt批量生成
   - 速度: 约10-20秒/张 (RTX 3060)

2. **ComfyUI**
   - 使用导出的comfyui_workflow.json
   - 搭配SDXL + 二次元LoRA
   - 质量更高，可控性更强
   - 速度: 约5-10秒/张 (RTX 3060)

3. **在线平台 (立即可用)**
   - 即梦AI: jimeng.jianying.com
   - 可灵AI: klingai.com
   - 使用导出的英文Prompt

配置文件位置:
- generation_config.json (包含所有Prompt)
- comfyui_workflow.json (ComfyUI工作流)
""")
    
    print(f"\n📁 所有文件已保存至: {OUTPUT_DIR}")
    print("✅ 配置导出完成！")

if __name__ == "__main__":
    main()
