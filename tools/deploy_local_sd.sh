#!/bin/bash
# 本地Stable Diffusion CPU部署脚本
# 用于在无GPU服务器上生成美术资源

set -e

echo "🎨 开始部署本地Stable Diffusion CPU版本..."

# 创建工作目录
WORK_DIR="/root/.openclaw/workspace/ai-art-generator"
mkdir -p $WORK_DIR
cd $WORK_DIR

# 1. 安装依赖
echo "📦 安装依赖..."
apt-get update -qq
apt-get install -y -qq python3-pip python3-venv git wget

# 2. 创建虚拟环境
echo "🐍 创建Python虚拟环境..."
python3 -m venv venv
source venv/bin/activate

# 3. 安装PyTorch CPU版本
echo "🔥 安装PyTorch (CPU版本)..."
pip install -q torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# 4. 安装Diffusers和Transformers
echo "🤗 安装Diffusers..."
pip install -q diffusers transformers accelerate safetensors

# 5. 安装PIL和numpy
echo "🖼️ 安装图像处理库..."
pip install -q Pillow numpy

echo "✅ 依赖安装完成"

# 6. 创建生成脚本
cat > generate_art.py << 'PYTHON_EOF'
#!/usr/bin/env python3
"""
Stable Diffusion CPU批量生成脚本
"""

import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from PIL import Image
import os
import time

# 配置
OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/images/generated"
MODEL_ID = "runwayml/stable-diffusion-v1-5"
# 二次元模型
ANIME_MODEL = "dreamlike-art/dreamlike-anime-1.0"

# 确保输出目录存在
os.makedirs(f"{OUTPUT_DIR}/characters", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/cards", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/ui", exist_ok=True)

def load_pipeline(model_id=ANIME_MODEL):
    """加载Stable Diffusion Pipeline"""
    print(f"📥 正在加载模型: {model_id}")
    
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id,
        torch_dtype=torch.float32,  # CPU使用float32
        safety_checker=None,  # 禁用安全检查器（加速）
        requires_safety_checker=False
    )
    
    # 使用DPM Scheduler加速
    pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
    
    # CPU优化
    pipe = pipe.to("cpu")
    
    # 启用内存优化
    pipe.enable_attention_slicing(1)
    
    print("✅ 模型加载完成")
    return pipe

def generate_image(pipe, prompt, save_path, width=512, height=512, steps=25):
    """生成单张图片"""
    start_time = time.time()
    
    # 生成
    image = pipe(
        prompt,
        width=width,
        height=height,
        num_inference_steps=steps,
        guidance_scale=7.5,
    ).images[0]
    
    # 保存
    image.save(save_path)
    
    elapsed = time.time() - start_time
    return elapsed

def generate_characters(pipe):
    """生成主角立绘"""
    characters = [
        ("jin_yu_normal", "anime boy fire warrior, black hair, red armor, flaming katana, battle pose, full body, transparent background, high quality"),
        ("jin_yu_awakened", "anime boy fire warrior awakened form, long red hair, golden armor, fire wings, epic pose, full body, transparent background, divine aura"),
        ("jin_yu_chibi", "chibi anime boy fire warrior, big head small body, cute, red armor, tiny sword, full body, transparent background"),
        
        ("shuang_ren_normal", "anime girl ice assassin, white hair, blue armor, dual daggers, agile pose, full body, transparent background, high quality"),
        ("shuang_ren_awakened", "anime girl ice queen, blue hair, crystal armor, ice wings, epic pose, full body, transparent background, frost aura"),
        ("shuang_ren_chibi", "chibi anime girl ice ninja, big head small body, cute, blue outfit, tiny daggers, full body, transparent background"),
        
        ("lei_yin_normal", "anime male thunder mage, purple hair, golden robe, thunder staff, majestic pose, full body, transparent background, high quality"),
        ("lei_yin_awakened", "anime male thunder god, white hair, golden armor, thunder halo, epic pose, full body, transparent background, divine aura"),
        ("lei_yin_chibi", "chibi anime male thunder mage, big head small body, cute, purple robe, tiny staff, full body, transparent background"),
        
        ("qing_lan_normal", "anime girl wind archer, green hair, forest cloak, wind bow, aiming pose, full body, transparent background, high quality"),
        ("qing_lan_awakened", "anime girl wind goddess, green hair flowing, nature armor, wind wings, epic pose, full body, transparent background, nature aura"),
        ("qing_lan_chibi", "chibi anime girl wind archer, big head small body, cute, green cloak, tiny bow, full body, transparent background"),
        
        ("yue_chen_normal", "anime male earth guardian, brown hair, heavy stone armor, giant shield, defensive pose, full body, transparent background, high quality"),
        ("yue_chen_awakened", "anime male earth titan, rocky hair, earth armor, mountain shield, fortress pose, full body, transparent background, earth aura"),
        ("yue_chen_chibi", "chibi anime male earth guardian, big head small body, cute, stone armor, tiny shield, full body, transparent background"),
        
        ("you_zhu_normal", "anime girl dark priestess, black purple hair, dark robe, shadow staff, mystical pose, full body, transparent background, high quality"),
        ("you_zhu_awakened", "anime girl shadow goddess, dark hair flowing, dark light armor, shadow wings, epic pose, full body, transparent background, divine aura"),
        ("you_zhu_chibi", "chibi anime girl dark priestess, big head small body, cute, dark robe, tiny staff, full body, transparent background"),
    ]
    
    print("\n🎭 开始生成主角立绘 (18张)...")
    for i, (name, prompt) in enumerate(characters):
        save_path = f"{OUTPUT_DIR}/characters/{name}.png"
        if os.path.exists(save_path):
            print(f"⏭️  [{i+1}/18] {name} - 已存在，跳过")
            continue
        
        print(f"🎨  [{i+1}/18] 生成 {name}...")
        try:
            elapsed = generate_image(pipe, prompt, save_path, width=512, height=512, steps=20)
            print(f"✅  [{i+1}/18] {name} - 完成 ({elapsed:.1f}s)")
        except Exception as e:
            print(f"❌  [{i+1}/18] {name} - 失败: {e}")
        
        # 生成间隔，避免过热
        time.sleep(2)

def main():
    print("=" * 60)
    print("🎨 记忆回收者 - AI美术资源生成器 (CPU版本)")
    print("=" * 60)
    
    # 加载模型
    pipe = load_pipeline()
    
    # 生成主角立绘
    generate_characters(pipe)
    
    print("\n" + "=" * 60)
    print("✅ 生成完成！")
    print(f"📁 输出目录: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
PYTHON_EOF

echo "🚀 部署脚本创建完成"
echo ""
echo "📋 使用方法:"
echo "  cd $WORK_DIR"
echo "  source venv/bin/activate"
echo "  python generate_art.py"
echo ""
echo "⚠️  注意: CPU生成速度较慢，约2-5分钟/张图片"
echo "   18张主角立绘预计需要1-2小时"
