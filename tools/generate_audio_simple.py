#!/usr/bin/env python3
"""
记忆回收者 - 纯Python音频生成器
无需numpy，使用标准库生成基础音效
"""

import wave
import struct
import math
import os
import random

OUTPUT_DIR = "/root/.openclaw/workspace/projects/memory-collector/assets/audio/generated"
os.makedirs(f"{OUTPUT_DIR}/sfx", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/ui", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/battle", exist_ok=True)

class SimpleAudioGenerator:
    """简单音频生成器 - 纯Python实现"""
    
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.generated_count = 0
    
    def save_wav(self, samples, filename):
        """保存为WAV文件"""
        with wave.open(filename, 'w') as wav:
            wav.setnchannels(1)  # 单声道
            wav.setsampwidth(2)  # 16位
            wav.setframerate(self.sample_rate)
            
            # 将浮点样本转换为16位整数
            for s in samples:
                s = max(-1.0, min(1.0, s))  # 限幅
                wav.writeframes(struct.pack('h', int(s * 32767)))
        
        self.generated_count += 1
    
    def generate_sine_wave(self, freq, duration, envelope_type='decay'):
        """生成正弦波"""
        samples = []
        num_samples = int(self.sample_rate * duration)
        
        for i in range(num_samples):
            t = i / self.sample_rate
            
            # 包络
            if envelope_type == 'decay':
                envelope = math.exp(-t * 5)
            elif envelope_type == 'linear':
                envelope = 1.0 - (t / duration)
            elif envelope_type == 'pulse':
                envelope = 1.0 if t < duration * 0.1 else math.exp(-(t - duration*0.1) * 10)
            else:
                envelope = 1.0
            
            sample = math.sin(2 * math.pi * freq * t) * envelope
            samples.append(sample)
        
        return samples
    
    def generate_click(self):
        """生成点击音效 - 短促高频"""
        print("🔊 生成点击音效...")
        samples = []
        duration = 0.05
        num_samples = int(self.sample_rate * duration)
        
        for i in range(num_samples):
            t = i / self.sample_rate
            freq = 2000
            envelope = math.exp(-t * 100)
            sample = math.sin(2 * math.pi * freq * t) * envelope * 0.5
            samples.append(sample)
        
        self.save_wav(samples, f"{OUTPUT_DIR}/ui/click.wav")
        print("  ✅ ui/click.wav")
    
    def generate_confirm(self):
        """生成确认音效 - 上升音调"""
        print("🔊 生成确认音效...")
        samples = []
        duration = 0.2
        num_samples = int(self.sample_rate * duration)
        
        for i in range(num_samples):
            t = i / self.sample_rate
            progress = i / num_samples
            freq = 400 + progress * 400  # 400Hz -> 800Hz
            envelope = math.exp(-t * 8)
            sample = math.sin(2 * math.pi * freq * t) * envelope * 0.6
            samples.append(sample)
        
        self.save_wav(samples, f"{OUTPUT_DIR}/ui/confirm.wav")
        print("  ✅ ui/confirm.wav")
    
    def generate_cancel(self):
        """生成取消音效 - 下降音调"""
        print("🔊 生成取消音效...")
        samples = []
        duration = 0.15
        num_samples = int(self.sample_rate * duration)
        
        for i in range(num_samples):
            t = i / self.sample_rate
            progress = i / num_samples
            freq = 600 - progress * 300  # 600Hz -> 300Hz
            envelope = math.exp(-t * 10)
            sample = math.sin(2 * math.pi * freq * t) * envelope * 0.6
            samples.append(sample)
        
        self.save_wav(samples, f"{OUTPUT_DIR}/ui/cancel.wav")
        print("  ✅ ui/cancel.wav")
    
    def generate_attack(self):
        """生成攻击音效 - 噪点+冲击"""
        print("🔊 生成攻击音效...")
        samples = []
        duration = 0.3
        num_samples = int(self.sample_rate * duration)
        
        for i in range(num_samples):
            t = i / self.sample_rate
            # 白噪音
            noise = random.uniform(-0.3, 0.3)
            # 低频冲击
            impact = math.sin(2 * math.pi * 100 * t) * 0.5
            envelope = math.exp(-t * 15)
            sample = (noise + impact) * envelope
            samples.append(sample)
        
        self.save_wav(samples, f"{OUTPUT_DIR}/battle/attack.wav")
        print("  ✅ battle/attack.wav")
    
    def generate_heal(self):
        """生成治疗音效 - 和谐琶音"""
        print("🔊 生成治疗音效...")
        samples = []
        duration = 0.8
        num_samples = int(self.sample_rate * duration)
        
        notes = [440, 554, 659, 880]  # A4, C#5, E5, A5
        note_duration = num_samples // 4
        
        for i in range(num_samples):
            note_index = min(i // note_duration, 3)
            freq = notes[note_index]
            t = (i % note_duration) / self.sample_rate
            envelope = math.exp(-t * 3)
            sample = math.sin(2 * math.pi * freq * t) * envelope * 0.4
            samples.append(sample)
        
        self.save_wav(samples, f"{OUTPUT_DIR}/battle/heal.wav")
        print("  ✅ battle/heal.wav")
    
    def generate_level_up(self):
        """生成升级音效 - 胜利号角"""
        print("🔊 生成升级音效...")
        samples = []
        duration = 1.5
        num_samples = int(self.sample_rate * duration)
        
        notes = [523, 659, 784, 1047, 1319]  # C5, E5, G5, C6, E6
        
        for i in range(num_samples):
            t = i / self.sample_rate
            progress = i / num_samples
            
            # 叠加多个音符
            sample = 0
            for j, freq in enumerate(notes):
                if progress >= j / 5:
                    note_t = t - (j / 5 * duration)
                    envelope = math.exp(-note_t * 2) * 0.2
                    sample += math.sin(2 * math.pi * freq * note_t) * envelope
            
            samples.append(sample)
        
        self.save_wav(samples, f"{OUTPUT_DIR}/sfx/level_up.wav")
        print("  ✅ sfx/level_up.wav")
    
    def generate_gacha_rare(self):
        """生成抽卡稀有音效 - 神秘闪烁"""
        print("🔊 生成抽卡稀有音效...")
        samples = []
        duration = 2.0
        num_samples = int(self.sample_rate * duration)
        
        for i in range(num_samples):
            t = i / self.sample_rate
            
            # 基础 shimmer
            shimmer = math.sin(2 * math.pi * 880 * t) * 0.1
            
            # 添加闪烁
            sparkle = 0
            for j in range(20):
                start = j / 20 * duration
                if start <= t < start + 0.05:
                    freq = 440 + j * 50
                    sparkle += math.sin(2 * math.pi * freq * t) * 0.05
            
            # 结束长音
            end_note = math.sin(2 * math.pi * 1109 * t) * math.exp(-t * 1) * 0.3
            
            sample = shimmer + sparkle + end_note
            samples.append(sample)
        
        self.save_wav(samples, f"{OUTPUT_DIR}/sfx/gacha_rare.wav")
        print("  ✅ sfx/gacha_rare.wav")
    
    def generate_card_flip(self):
        """生成卡牌翻转音效"""
        print("🔊 生成卡牌翻转音效...")
        samples = []
        duration = 0.4
        num_samples = int(self.sample_rate * duration)
        
        for i in range(num_samples):
            t = i / self.sample_rate
            # 快速的"嗖"声
            freq = 800 + math.sin(t * 50) * 400
            envelope = math.exp(-abs(t - duration/2) * 10)
            sample = math.sin(2 * math.pi * freq * t) * envelope * 0.5
            samples.append(sample)
        
        self.save_wav(samples, f"{OUTPUT_DIR}/sfx/card_flip.wav")
        print("  ✅ sfx/card_flip.wav")
    
    def generate_all(self):
        """生成所有音效"""
        print("=" * 60)
        print("🎵 程序化音频生成器 (纯Python)")
        print("=" * 60)
        
        # UI音效
        self.generate_click()
        self.generate_confirm()
        self.generate_cancel()
        
        # 战斗音效
        self.generate_attack()
        self.generate_heal()
        
        # 特殊音效
        self.generate_level_up()
        self.generate_gacha_rare()
        self.generate_card_flip()
        
        print("\n" + "=" * 60)
        print(f"✅ 音频生成完成!")
        print(f"📁 输出目录: {OUTPUT_DIR}")
        print(f"🔊 生成文件数: {self.generated_count}")
        print("=" * 60)
        
        return self.generated_count

if __name__ == "__main__":
    generator = SimpleAudioGenerator()
    generator.generate_all()
