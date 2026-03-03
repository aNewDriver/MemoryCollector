#!/usr/bin/env python3
"""
记忆回收者 - 程序化音频生成器
使用numpy生成基础音效
"""

import numpy as np
import wave
import os

OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/audio/generated"
os.makedirs(f"{OUTPUT_DIR}/sfx", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/ui", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/battle", exist_ok=True)

class AudioGenerator:
    """音频生成器"""
    
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.generated_count = 0
    
    def save_wav(self, data, filename):
        """保存为WAV文件"""
        # 转换为16位整数
        data = np.int16(data * 32767)
        
        with wave.open(filename, 'w') as wav:
            wav.setnchannels(1)  # 单声道
            wav.setsampwidth(2)  # 16位
            wav.setframerate(self.sample_rate)
            wav.writeframes(data.tobytes())
        
        self.generated_count += 1
    
    def generate_click_sound(self):
        """生成点击音效"""
        print("🔊 生成点击音效...")
        duration = 0.05
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        
        # 短促高频音
        freq = 2000
        envelope = np.exp(-t * 50)  # 快速衰减
        wave = np.sin(2 * np.pi * freq * t) * envelope
        
        self.save_wav(wave, f"{OUTPUT_DIR}/ui/click.wav")
        print("  ✅ ui/click.wav")
    
    def generate_confirm_sound(self):
        """生成确认音效"""
        print("🔊 生成确认音效...")
        duration = 0.2
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        
        # 上升音调
        freq_start = 400
        freq_end = 800
        freq = np.linspace(freq_start, freq_end, len(t))
        envelope = np.exp(-t * 8)
        wave = np.sin(2 * np.pi * freq * t) * envelope
        
        self.save_wav(wave, f"{OUTPUT_DIR}/ui/confirm.wav")
        print("  ✅ ui/confirm.wav")
    
    def generate_cancel_sound(self):
        """生成取消音效"""
        print("🔊 生成取消音效...")
        duration = 0.15
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        
        # 下降音调
        freq_start = 600
        freq_end = 300
        freq = np.linspace(freq_start, freq_end, len(t))
        envelope = np.exp(-t * 10)
        wave = np.sin(2 * np.pi * freq * t) * envelope
        
        self.save_wav(wave, f"{OUTPUT_DIR}/ui/cancel.wav")
        print("  ✅ ui/cancel.wav")
    
    def generate_attack_sound(self):
        """生成攻击音效"""
        print("🔊 生成攻击音效...")
        duration = 0.3
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        
        # 白噪音 + 低频
        noise = np.random.uniform(-1, 1, len(t))
        envelope = np.exp(-t * 15)
        
        # 添加低频冲击
        impact = np.sin(2 * np.pi * 100 * t) * envelope * 0.5
        
        wave = (noise * 0.3 + impact) * envelope
        wave = np.clip(wave, -1, 1)
        
        self.save_wav(wave, f"{OUTPUT_DIR}/battle/attack.wav")
        print("  ✅ battle/attack.wav")
    
    def generate_heal_sound(self):
        """生成治疗音效"""
        print("🔊 生成治疗音效...")
        duration = 0.8
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        
        # 上升琶音
        notes = [440, 554, 659, 880]  # A4, C#5, E5, A5
        wave = np.zeros_like(t)
        
        for i, freq in enumerate(notes):
            start = i * len(t) // 4
            end = (i + 1) * len(t) // 4
            note_t = t[:end-start]
            envelope = np.exp(-note_t * 3)
            note_wave = np.sin(2 * np.pi * freq * note_t) * envelope * 0.25
            wave[start:end] += note_wave
        
        self.save_wav(wave, f"{OUTPUT_DIR}/battle/heal.wav")
        print("  ✅ battle/heal.wav")
    
    def generate_level_up_sound(self):
        """生成升级音效"""
        print("🔊 生成升级音效...")
        duration = 1.5
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        
        # 庆祝式上升音阶
        notes = [523, 659, 784, 1047, 1319]  # C5, E5, G5, C6, E6
        wave = np.zeros_like(t)
        
        for i, freq in enumerate(notes):
            start = i * len(t) // 5
            end = len(t)
            note_t = t[:end-start]
            envelope = np.exp(-note_t * 2) * 0.3
            note_wave = np.sin(2 * np.pi * freq * note_t) * envelope
            wave[start:end] += note_wave
        
        # 添加一些和谐泛音
        for i, freq in enumerate(notes):
            start = i * len(t) // 5
            end = len(t)
            note_t = t[:end-start]
            envelope = np.exp(-note_t * 2) * 0.15
            note_wave = np.sin(2 * np.pi * freq * 1.5 * note_t) * envelope
            wave[start:end] += note_wave
        
        wave = np.clip(wave, -1, 1)
        self.save_wav(wave, f"{OUTPUT_DIR}/sfx/level_up.wav")
        print("  ✅ sfx/level_up.wav")
    
    def generate_gacha_rare_sound(self):
        """生成抽卡稀有音效"""
        print("🔊 生成抽卡稀有音效...")
        duration = 2.0
        t = np.linspace(0, duration, int(self.sample_rate * duration))
        
        # 神秘的闪烁音效
        wave = np.zeros_like(t)
        
        # 基础 shimmering
        shimmer_freq = 880
        shimmer = np.sin(2 * np.pi * shimmer_freq * t) * 0.1
        wave += shimmer
        
        # 添加闪烁效果
        for i in range(20):
            start = i * len(t) // 20
            end = start + len(t) // 40
            if end < len(t):
                freq = 440 + i * 50
                note_t = t[:end-start]
                envelope = np.exp(-note_t * 10)
                note_wave = np.sin(2 * np.pi * freq * note_t) * envelope * 0.1
                wave[start:end] += note_wave
        
        # 最后的长音
        end_note = np.sin(2 * np.pi * 1109 * t) * np.exp(-t * 1) * 0.3
        wave += end_note
        
        wave = np.clip(wave, -1, 1)
        self.save_wav(wave, f"{OUTPUT_DIR}/sfx/gacha_rare.wav")
        print("  ✅ sfx/gacha_rare.wav")
    
    def generate_all_audio(self):
        """生成所有音频"""
        print("=" * 60)
        print("🎵 程序化音频生成器")
        print("=" * 60)
        
        # UI音效
        self.generate_click_sound()
        self.generate_confirm_sound()
        self.generate_cancel_sound()
        
        # 战斗音效
        self.generate_attack_sound()
        self.generate_heal_sound()
        
        # 特殊音效
        self.generate_level_up_sound()
        self.generate_gacha_rare_sound()
        
        print("\n" + "=" * 60)
        print(f"✅ 音频生成完成!")
        print(f"📁 输出目录: {OUTPUT_DIR}")
        print(f"🔊 生成文件数: {self.generated_count}")
        print("=" * 60)
        
        return self.generated_count

if __name__ == "__main__":
    generator = AudioGenerator()
    generator.generate_all_audio()
