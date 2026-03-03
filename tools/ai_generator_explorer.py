#!/usr/bin/env python3
"""
记忆回收者 - AI美术资源生成探索器
尝试多种免费AI生成方案
"""

import requests
import os
import time
import base64
from PIL import Image
import io

OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/images/ai_generated"
os.makedirs(OUTPUT_DIR, exist_ok=True)

class AIGeneratorExplorer:
    """AI生成方案探索器"""
    
    def __init__(self):
        self.results = {}
    
    def test_huggingface_sd(self, prompt, filename):
        """测试HuggingFace Stable Diffusion API"""
        print(f"🧪 测试 HuggingFace SD...")
        try:
            # Stability AI的免费API
            API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2"
            headers = {"Authorization": "Bearer hf_dummy"}  # 无需key的公开模型
            
            payload = {"inputs": prompt}
            response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                image_bytes = response.content
                img = Image.open(io.BytesIO(image_bytes))
                img.save(f"{OUTPUT_DIR}/{filename}_hf.png")
                print(f"  ✅ HuggingFace成功: {filename}_hf.png")
                return True
            else:
                print(f"  ❌ HuggingFace失败: {response.status_code}")
                return False
        except Exception as e:
            print(f"  ❌ HuggingFace错误: {e}")
            return False
    
    def test_pollinations(self, prompt, filename):
        """测试Pollinations.AI（免费，无需注册）"""
        print(f"🧪 测试 Pollinations.AI...")
        try:
            import urllib.parse
            encoded_prompt = urllib.parse.quote(prompt)
            url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=512&seed=42&nologo=true"
            
            response = requests.get(url, timeout=60)
            if response.status_code == 200:
                img = Image.open(io.BytesIO(response.content))
                img.save(f"{OUTPUT_DIR}/{filename}_pollinations.png")
                print(f"  ✅ Pollinations成功: {filename}_pollinations.png")
                return True
            else:
                print(f"  ❌ Pollinations失败: {response.status_code}")
                return False
        except Exception as e:
            print(f"  ❌ Pollinations错误: {e}")
            return False
    
    def test_pixlr(self, prompt, filename):
        """测试Pixlr（免费在线工具）"""
        print(f"🧪 测试 Pixlr方案...")
        # Pixlr主要是客户端工具，无法直接API调用
        print(f"  ⚠️ Pixlr需要手动操作，提供方案文档")
        return None
    
    def test_local_sd(self, prompt, filename):
        """测试本地Stable Diffusion（如果已部署）"""
        print(f"🧪 测试本地SD...")
        try:
            # 检查是否有本地SD服务
            response = requests.get("http://localhost:7860/sdapi/v1/sd-models", timeout=5)
            if response.status_code == 200:
                # 本地SD可用，调用API
                payload = {
                    "prompt": prompt,
                    "steps": 20,
                    "width": 512,
                    "height": 512
                }
                response = requests.post("http://localhost:7860/sdapi/v1/txt2img", 
                                        json=payload, timeout=120)
                if response.status_code == 200:
                    result = response.json()
                    image_data = base64.b64decode(result['images'][0])
                    img = Image.open(io.BytesIO(image_data))
                    img.save(f"{OUTPUT_DIR}/{filename}_local_sd.png")
                    print(f"  ✅ 本地SD成功: {filename}_local_sd.png")
                    return True
            print(f"  ⚠️ 本地SD未运行")
            return False
        except Exception as e:
            print(f"  ⚠️ 本地SD不可用: {e}")
            return False
    
    def generate_with_best_method(self, prompt, filename):
        """使用最佳可用方法生成"""
        methods = [
            ("local_sd", self.test_local_sd),
            ("pollinations", self.test_pollinations),
            ("huggingface", self.test_huggingface_sd),
        ]
        
        for method_name, method_func in methods:
            result = method_func(prompt, filename)
            if result:
                self.results[filename] = method_name
                return method_name
            time.sleep(1)  # 避免请求过快
        
        return None
    
    def run_exploration(self):
        """运行探索测试"""
        print("=" * 60)
        print("🔬 AI美术生成方案探索")
        print("=" * 60)
        
        test_prompts = [
            ("fire_warrior", "anime style fire warrior, male, red armor, flaming sword, full body, high quality"),
            ("water_mage", "anime style water mage, female, blue robe, water staff, full body, high quality"),
        ]
        
        for name, prompt in test_prompts:
            print(f"\n🎨 生成: {name}")
            print(f"Prompt: {prompt[:50]}...")
            method = self.generate_with_best_method(prompt, name)
            if method:
                print(f"✅ 使用方案: {method}")
            else:
                print(f"❌ 所有方案失败，使用占位图")
        
        print("\n" + "=" * 60)
        print("📊 探索结果:")
        for filename, method in self.results.items():
            print(f"  {filename}: {method}")
        print("=" * 60)
        
        return self.results

if __name__ == "__main__":
    explorer = AIGeneratorExplorer()
    explorer.run_exploration()
