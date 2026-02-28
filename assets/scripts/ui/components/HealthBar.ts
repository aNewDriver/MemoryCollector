/**
 * 血条/进度条组件
 * 支持平滑动画、数值显示
 */

import { _decorator, Component, Node, ProgressBar, Label, Color } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HealthBar')
export class HealthBar extends Component {
    
    @property(ProgressBar)
    private progressBar: ProgressBar | null = null;
    
    @property(Label)
    private valueLabel: Label | null = null;
    
    @property
    private showValue: boolean = true;
    
    @property
    private format: string = '{current}/{max}';
    
    @property
    private animateDuration: number = 0.3;  // 动画时长（秒）
    
    @property(Color)
    private highColor: Color = new Color(0, 255, 0);      // 健康（绿）
    
    @property(Color)
    private mediumColor: Color = new Color(255, 255, 0);  // 警告（黄）
    
    @property(Color)
    private lowColor: Color = new Color(255, 0, 0);       // 危险（红）
    
    private currentValue: number = 0;
    private maxValue: number = 100;
    private targetProgress: number = 1;
    private isAnimating: boolean = false;
    
    onLoad() {
        this.updateDisplay();
    }
    
    update(dt: number) {
        if (this.isAnimating && this.progressBar) {
            const current = this.progressBar.progress;
            const diff = this.targetProgress - current;
            
            if (Math.abs(diff) < 0.01) {
                this.progressBar.progress = this.targetProgress;
                this.isAnimating = false;
            } else {
                this.progressBar.progress += diff * dt / this.animateDuration;
            }
            
            this.updateColor();
        }
    }
    
    // 设置数值（带动画）
    public setValue(current: number, max: number) {
        this.currentValue = Math.max(0, current);
        this.maxValue = Math.max(1, max);
        
        this.targetProgress = this.currentValue / this.maxValue;
        this.isAnimating = true;
        
        this.updateDisplay();
    }
    
    // 立即设置数值（无动画）
    public setValueInstant(current: number, max: number) {
        this.currentValue = Math.max(0, current);
        this.maxValue = Math.max(1, max);
        
        this.targetProgress = this.currentValue / this.maxValue;
        this.isAnimating = false;
        
        if (this.progressBar) {
            this.progressBar.progress = this.targetProgress;
        }
        
        this.updateDisplay();
        this.updateColor();
    }
    
    // 减少数值（伤害）
    public decrease(amount: number) {
        this.setValue(this.currentValue - amount, this.maxValue);
    }
    
    // 增加数值（治疗）
    public increase(amount: number) {
        this.setValue(this.currentValue + amount, this.maxValue);
    }
    
    private updateDisplay() {
        if (this.valueLabel && this.showValue) {
            const text = this.format
                .replace('{current}', Math.floor(this.currentValue).toString())
                .replace('{max}', this.maxValue.toString())
                .replace('{percent}', Math.floor(this.targetProgress * 100).toString());
            this.valueLabel.string = text;
        }
    }
    
    private updateColor() {
        if (!this.progressBar) return;
        
        const bar = this.progressBar.barSprite;
        if (!bar) return;
        
        let color: Color;
        if (this.targetProgress > 0.5) {
            color = this.highColor;
        } else if (this.targetProgress > 0.25) {
            color = this.mediumColor;
        } else {
            color = this.lowColor;
        }
        
        bar.color = color;
    }
    
    // 获取当前数值
    public getCurrentValue(): number {
        return this.currentValue;
    }
    
    public getMaxValue(): number {
        return this.maxValue;
    }
    
    public getPercentage(): number {
        return this.targetProgress;
    }
}
