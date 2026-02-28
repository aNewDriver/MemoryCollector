/**
 * AI美术资源生成脚本
 * 生成Midjourney/Stable Diffusion的完整Prompt
 */

import { getAllCards } from '../data/CardDatabase';
import { ElementType, Rarity } from '../data/CardData';

interface ArtPrompt {
    characterId: string;
    characterName: string;
    promptType: 'portrait' | 'fullbody' | 'awakened';
    prompt: string;
    negativePrompt: string;
    aspectRatio: string;
}

export class ArtPromptGenerator {
    
    // 基础风格定义
    private baseStyle = `post-apocalyptic wasteland setting, 
ethereal golden light particles, memory fragments floating around,
dark muted color palette with golden accents,
concept art style, painterly style, cinematic lighting,
high detail, 4K`;

    private negativePrompt = `bright colors, cartoon, anime, 3d render, 
low quality, blurry, deformed hands, extra fingers,
modern city, futuristic technology, clean background`;

    // 元素风格映射
    private elementStyles: { [key in ElementType]: string } = {
        [ElementType.FIRE]: 'warm orange and red tones, embers, flames, burning effects',
        [ElementType.WATER]: 'cool blue and silver tones, mist, water reflections, flowing water',
        [ElementType.WIND]: 'gray and green tones, motion blur, wind effects, floating leaves',
        [ElementType.EARTH]: 'brown and gray metallic tones, stone textures, dust, rugged',
        [ElementType.LIGHT]: 'gold and white color scheme, holy light rays, divine atmosphere',
        [ElementType.DARK]: 'dark blue and black with blue luminescence, void space, mysterious'
    };

    // 生成单个角色的所有Prompt
    public generateCharacterPrompts(characterId: string): ArtPrompt[] {
        const card = getAllCards().find(c => c.id === characterId);
        if (!card) return [];

        const prompts: ArtPrompt[] = [];

        // 头像立绘
        prompts.push({
            characterId: card.id,
            characterName: card.name,
            promptType: 'portrait',
            prompt: this.generatePortraitPrompt(card),
            negativePrompt: this.negativePrompt,
            aspectRatio: '1:1'
        });

        // 全身立绘
        prompts.push({
            characterId: card.id,
            characterName: card.name,
            promptType: 'fullbody',
            prompt: this.generateFullbodyPrompt(card),
            negativePrompt: this.negativePrompt,
            aspectRatio: '9:16'
        });

        // 觉醒立绘（如果有）
        if (card.art.awakened) {
            prompts.push({
                characterId: card.id,
                characterName: card.name,
                promptType: 'awakened',
                prompt: this.generateAwakenedPrompt(card),
                negativePrompt: this.negativePrompt,
                aspectRatio: '9:16'
            });
        }

        return prompts;
    }

    private generatePortraitPrompt(card: any): string {
        const elementStyle = this.elementStyles[card.element];
        
        return `character portrait, headshot, ${card.name} - ${card.title},
${card.story.summary},
${elementStyle},
${this.baseStyle},
--ar 1:1 --style raw`;
    }

    private generateFullbodyPrompt(card: any): string {
        const elementStyle = this.elementStyles[card.element];
        
        return `character design, full body, ${card.name} - ${card.title},
${card.story.summary},
${this.getCharacterVisualDescription(card.id)},
${elementStyle},
${this.baseStyle},
--ar 9:16 --style raw`;
    }

    private generateAwakenedPrompt(card: any): string {
        const elementStyle = this.elementStyles[card.element];
        
        return `character design, full body, awakened form, ${card.name} - ${card.title},
${card.story.summary}, transformed, glowing aura, more powerful appearance,
${this.getCharacterVisualDescription(card.id)},
enhanced ${elementStyle}, more intense lighting,
${this.baseStyle},
--ar 9:16 --style raw --stylize 250`;
    }

    private getCharacterVisualDescription(characterId: string): string {
        const descriptions: { [key: string]: string } = {
            'jin_yu': 'young samurai warrior, charred armor with burnt edges, holding damaged katana with flame patterns, determined and sorrowful expression, long black hair, burning village ruins background',
            'qing_yi': 'elegant female musician in flowing cyan dress, holding ancient guqin, long hair with blue ribbons, serene expression, bamboo forest in moonlight',
            'zhu_feng': 'mysterious masked assassin in dark fitted outfit, dual short blades, predatory stance, ruins in strong wind, sand and leaves swirling',
            'yan_xin': 'bulky heavy armored warrior, full plate armor with battle scars, holding massive tower shield, stance immovable like mountain, broken city wall background',
            'ming_zhu': 'holy female priestess holding golden lantern, white robes with golden embroidery, warm holy light surrounding, kind compassionate face, darkness pierced by golden light',
            'can_ying': 'mysterious humanoid silhouette made of memory fragments, fragments showing glimpses of scenes, ethereal blue glow between fragments, face obscured, void space background'
        };
        
        return descriptions[characterId] || '';
    }

    // 生成所有角色的Prompt
    public generateAllPrompts(): ArtPrompt[] {
        const allPrompts: ArtPrompt[] = [];
        const cards = getAllCards();
        
        cards.forEach(card => {
            allPrompts.push(...this.generateCharacterPrompts(card.id));
        });
        
        return allPrompts;
    }

    // 导出为CSV格式
    public exportToCSV(): string {
        const prompts = this.generateAllPrompts();
        let csv = '角色ID,角色名称,类型,Prompt,Negative Prompt,比例\n';
        
        prompts.forEach(p => {
            csv += `${p.characterId},${p.characterName},${p.promptType},"${p.prompt.replace(/"/g, '""')}","${p.negativePrompt}",${p.aspectRatio}\n`;
        });
        
        return csv;
    }

    // 导出为Markdown格式
    public exportToMarkdown(): string {
        const prompts = this.generateAllPrompts();
        let md = '# AI美术生成Prompt合集\n\n';
        
        prompts.forEach(p => {
            md += `## ${p.characterName} - ${p.promptType}\n\n`;
            md += '**Prompt:**\n```\n';
            md += p.prompt;
            md += '\n```\n\n';
            md += '**Negative Prompt:**\n```\n';
            md += p.negativePrompt;
            md += '\n```\n\n';
            md += `**比例:** ${p.aspectRatio}\n\n---\n\n`;
        });
        
        return md;
    }
}

// 单例
export const artPromptGenerator = new ArtPromptGenerator();

// 如果是直接运行，导出文件
if (typeof window === 'undefined') {
    const generator = new ArtPromptGenerator();
    console.log(generator.exportToMarkdown());
}
