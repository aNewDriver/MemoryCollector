/**
 * 角色立绘详细配置
 * 用于AI生成（Midjourney/Stable Diffusion）
 */

export interface CharacterArtConfig {
    id: string;
    name: string;
    title: string;
    element: 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'dark';
    rarity: 'rare' | 'epic' | 'legendary' | 'mythic';
    class: 'warrior' | 'assassin' | 'mage' | 'archer' | 'priest' | 'tank';
    
    // 基础Prompt
    basePrompt: string;
    
    // 详细描述
    description: {
        appearance: string;
        clothing: string;
        weapon: string;
        expression: string;
        pose: string;
        background: string;
    };
    
    // AI生成参数
    aiParams: {
        style: string;
        lighting: string;
        colorPalette: string;
        composition: string;
        negativePrompt: string;
    };
    
    // 不同版本
    versions: {
        normal: string;
        awakened: string;
        chibi?: string;
    };
}

export const CHARACTER_ART_CONFIGS: CharacterArtConfig[] = [
    {
        id: 'jin_yu',
        name: '烬羽',
        title: '焚天剑姬',
        element: 'fire',
        rarity: 'rare',
        class: 'warrior',
        basePrompt: 'female warrior, phoenix themed armor, flame patterns, katana, elegant but fierce',
        description: {
            appearance: '20岁左右的女性剑士，黑色长发带有红色挑染，发尾如火焰般微微卷曲。金色瞳孔中仿佛有火焰跳动。身材修长但充满力量感，身高约165cm。',
            clothing: '身穿赤红色与黑色相间的轻甲，肩甲设计成凤凰羽翼形状，边缘有火焰纹路。胸前护甲中央镶嵌着火红色宝石。腰系黑色腰带，下身是便于行动的红色战裙，配有护膝。背后有残破的披风，边缘焦黑。',
            weapon: '双手持一柄日式长刀，刀身修长，刃口有熔岩般流动的纹路。刀镡是凤凰展翅的造型。刀鞘黑色，有红色火焰图案。',
            expression: '眼神坚定而悲伤，眉宇间有历经沧桑的成熟。嘴角微微抿紧，透露出战士的坚毅。',
            pose: '侧身站立，长刀斜指地面，左手握刀鞘。重心微微下沉，呈现随时可以拔刀战斗的姿态。',
            background: '黄昏下的战场废墟，远处有燃烧的村庄。天空呈现橙红到深紫的渐变色。有火星和灰烬在空中飘舞。'
        },
        aiParams: {
            style: 'anime style, highly detailed, cinematic, concept art',
            lighting: 'dramatic golden hour lighting, rim lighting from flames',
            colorPalette: 'warm orange-red dominant, deep black shadows, golden highlights',
            composition: 'full body, dynamic pose, vertical composition',
            negativePrompt: 'deformed, blurry, low quality, worst quality, bad anatomy, extra limbs, watermark, signature, text'
        },
        versions: {
            normal: 'standard appearance as described',
            awakened: 'surrounded by intense flames, armor becomes more elaborate with phoenix wings manifesting, eyes glowing with fire, hair floating as if weightless, background shows phoenix rising'
        }
    },
    {
        id: 'qing_yi',
        name: '青漪',
        title: '流水琴仙',
        element: 'water',
        rarity: 'epic',
        class: 'priest',
        basePrompt: 'elegant female musician, flowing blue dress, ancient guqin, ethereal beauty, water magic',
        description: {
            appearance: '约22岁的温婉女子，淡青色长发如瀑布般垂落至腰际，发间点缀着珍珠和水滴形状的发饰。淡蓝色眼眸清澈如水，带着淡淡的忧伤。肌肤白皙近乎透明，给人如水般温柔的感觉。',
            clothing: '身着淡青色渐变长裙，裙摆似水波流动。上衣是白色丝绸，袖口宽大，有水流纹路刺绣。腰间系着青色丝带，垂下流苏。赤足，脚踝系有银铃。',
            weapon: '怀抱一张古色古琴（七弦琴），琴身由千年沉香木制成，泛着淡淡的青色光芒。琴弦似由水丝织就。',
            expression: '宁静而忧伤，眼神望向远方，仿佛在回忆什么。嘴角带着淡淡的、温柔的微笑。',
            pose: '优雅地跪坐或盘坐，古琴横于膝上，双手轻抚琴弦。姿态如同在演奏一曲哀伤的古曲。',
            background: '月光下的竹林，竹影婆娑。地面有淡淡的雾气，月光透过竹叶洒落。远处有瀑布和流水的声音。空气中漂浮着蓝色的光点。'
        },
        aiParams: {
            style: 'chinese ink painting style mixed with anime, ethereal, dreamy',
            lighting: 'soft moonlight, cool blue tones, bioluminescent particles',
            colorPalette: 'cool cyan-blue dominant, silver highlights, white accents, deep forest greens',
            composition: 'full body seated pose, vertical, flowing composition',
            negativePrompt: 'bright colors, warm tones, aggressive pose, modern clothing, low quality'
        },
        versions: {
            normal: 'gentle musician playing in moonlight',
            awakened: 'floating in air surrounded by water dragons, dress transforming into liquid water, hair flowing like waterfall, playing music that creates visible water ripples, background shows massive tidal wave or water dragon'
        }
    },
    {
        id: 'zhu_feng',
        name: '逐风',
        title: '影杀',
        element: 'wind',
        rarity: 'epic',
        class: 'assassin',
        basePrompt: 'mysterious masked assassin, dark outfit, dual blades, wind effects, stealthy pose',
        description: {
            appearance: '无法判断年龄的神秘人物，身形修长矫健。下半脸被黑色面罩遮住，只露出一双锐利如鹰隼的翠绿色眼睛。黑色短发，有几缕被风吹起。皮肤呈健康的小麦色。',
            clothing: '身着深绿色与黑色相间的夜行衣，贴身设计便于行动。胸前和肩膀有皮质护甲。腰间有多个暗器袋。戴着露指手套，手臂缠绕绷带。背后有短小披风，在风中猎猎作响。',
            weapon: '双手各持一柄短刃，刀身弧度优美，泛着幽绿光芒。刀柄缠着黑色布条。腰间还藏着备用匕首和暗器。',
            expression: '眼神冰冷锐利，充满杀气。即使面罩遮住大部分表情，也能感受到那种危险的气息。',
            pose: '蹲伏在建筑物边缘或树枝上，身体前倾，呈现蓄势待发的猎豹姿态。双刀反握，随时准备出击。',
            background: '狂风中的废墟城市或古老森林，风沙和落叶被卷到空中。天空阴沉，乌云翻滚。画面有动态模糊效果表现风速。'
        },
        aiParams: {
            style: 'dark fantasy, anime style, dynamic action pose',
            lighting: 'dramatic contrast, sharp shadows, storm lighting',
            colorPalette: 'deep green and black dominant, gray storm clouds, silver blade highlights',
            composition: 'dynamic crouching pose, diagonal composition, sense of motion',
            negativePrompt: 'bright colors, happy expression, static pose, armor too heavy, exposed face'
        },
        versions: {
            normal: 'stealthy assassin in shadows',
            awakened: 'moving at impossible speed leaving afterimages, surrounded by tornado, blades glowing with green wind energy, mask partially revealing intense expression, background completely consumed by storm'
        }
    },
    {
        id: 'yan_xin',
        name: '岩心',
        title: '铁壁',
        element: 'earth',
        rarity: 'rare',
        class: 'tank',
        basePrompt: 'bulky armored knight, tower shield, earth armor, stalwart defender',
        description: {
            appearance: '30岁左右的魁梧壮汉，身高超过190cm。短发如钢针般竖起，面部有疤痕，眼神坚毅。皮肤粗糙，充满力量感。整体给人的感觉就像一座不可撼动的山岳。',
            clothing: '全身覆盖厚重的岩石质感板甲，甲片上有自然的裂纹和磨损痕迹。肩甲设计成山岩形状。胸前护甲中央有土黄色宝石。头盔有面甲可放下。披风是深褐色，边缘破烂。',
            weapon: '左手持一面巨大的塔盾，盾面有裂纹图案。右手持单手战锤或短剑。武器都给人一种沉重可靠的感觉。',
            expression: '沉稳坚定，嘴角微微下压，透露出严肃认真的性格。眼神直视前方，如同岩石般不可动摇。',
            pose: '挺拔站立，双脚分开与肩同宽。盾牌立于身前，右手武器垂于身侧。姿态如山岳般稳固。',
            background: '破碎的城墙或山地要塞，地面有裂痕。背景是黄昏或阴天的天空，远处有山脉轮廓。有碎石和尘土在地面。'
        },
        aiParams: {
            style: 'realistic anime, heavy armor detail, solid composition',
            lighting: 'earthy tones, solid shadows, dust particles in air',
            colorPalette: 'brown and gray dominant, bronze highlights, earthy yellows',
            composition: 'full body imposing stance, centered, grounded',
            negativePrompt: 'slim build, bright colors, smiling, dynamic pose, modern elements'
        },
        versions: {
            normal: 'solid defender with shield',
            awakened: 'armor covered in living rock and crystals, body partially merged with stone, shield transformed into massive earth wall, creating earthquake just by standing, background showing mountains rising'
        }
    },
    {
        id: 'ming_zhu',
        name: '明烛',
        title: '圣光祭司',
        element: 'light',
        rarity: 'legendary',
        class: 'priest',
        basePrompt: 'holy priestess, golden light, white robes, divine staff, compassionate',
        description: {
            appearance: '约25岁的圣洁女性，金色长发编成复杂的发辫，戴着金色头冠。眼睛是温暖的琥珀色，仿佛蕴含着太阳的光芒。皮肤白皙有光晕。身上散发着柔和的金色光芒。',
            clothing: '身着白色为主、金色装饰的神圣长袍。长袍上有复杂的金色刺绣，图案是太阳和光芒。腰间系着金色腰带，垂下十字架或其他神圣符号。手腕和脚踝有金色饰品。',
            weapon: '手持一根神圣法杖，杖头是可发光的金色灯笼或水晶。另一只手可能拿着圣书或圣徽。',
            expression: '慈祥而悲悯，眼神温柔地注视着前方。嘴角带着圣者般的微笑，给人安心和治愈的感觉。',
            pose: '站立或半浮空，法杖高举或平举。姿态优雅而神圣，仿佛在接受或赐予祝福。',
            background: '光芒四射的神殿或云端圣所。背景是金色的光芒和漂浮的光点。有天使或神圣符号的虚影。整体氛围温暖而神圣。'
        },
        aiParams: {
            style: 'divine fantasy art, anime style, ethereal glow',
            lighting: 'holy golden light from behind, volumetric lighting, lens flares',
            colorPalette: 'white and gold dominant, warm yellow glows, divine light',
            composition: 'full body, slightly floating, vertical, ascending composition',
            negativePrompt: 'dark colors, shadows, evil, dark background, low quality'
        },
        versions: {
            normal: 'holy priestess with gentle light',
            awakened: 'fully transformed into angelic form with wings of pure light, floating high above, radiating intense golden aura that dispels all darkness, eyes glowing white, background showing heavenly gates opening'
        }
    },
    {
        id: 'can_ying',
        name: '残影',
        title: '???',
        element: 'dark',
        rarity: 'mythic',
        class: 'assassin',
        basePrompt: 'mysterious silhouette, memory fragments, void entity, fragmented reality, ethereal',
        description: {
            appearance: '无法看清具体面容的神秘存在。身体轮廓由无数记忆碎片构成，碎片之间透出幽蓝色的虚空光芒。身形修长但模糊，时隐时现。面部被阴影遮住，只能看到一双复杂的眼睛。',
            clothing: '没有实体 clothing，身体由半透明的记忆碎片和暗影构成。碎片中似乎能看到不同场景的回闪——战斗、欢笑、悲伤。整体呈现出一种既真实又虚幻的感觉。',
            weapon: '双手可以具现出由阴影构成的利刃，或者使用记忆碎片作为攻击手段。武器也是半透明的，有蓝色微光。',
            expression: '眼神极其复杂，包含着悲伤、愤怒、怀念、决心等多种情绪。因为是剪影，表情难以辨认，但能感受到强烈的情感波动。',
            pose: '半跪或站立在虚空中，身体微微前倾，一只手伸向观众，仿佛在寻求帮助或想要传达什么。姿态充满故事感。',
            background: '纯粹的虚空或星空，有遥远的星云和漂浮的记忆碎片。背景中隐约可见其他世界或时间线的残影。整体色调偏暗但有很多蓝色光点。'
        },
        aiParams: {
            style: 'abstract surreal, dark fantasy, cinematic, mysterious',
            lighting: 'bioluminescent blue glow, dramatic rim lighting from fragments',
            colorPalette: 'deep blue and black dominant, cyan highlights, void purples',
            composition: 'ethereal floating pose, fragmented, mysterious',
            negativePrompt: 'solid form, bright colors, defined features, happy, simple background'
        },
        versions: {
            normal: 'mysterious fragmented silhouette',
            awakened: 'memory fragments coalescing into more defined but still ethereal form, revealing glimpses of true identity through fragments, surrounded by vortex of memories and shadows, eyes showing full range of human emotions, background showing multiple timelines converging'
        }
    }
];

// 生成Midjourney Prompt
export function generateMidjourneyPrompt(character: CharacterArtConfig, version: 'normal' | 'awakened'): string {
    const desc = character.description;
    const params = character.aiParams;
    const verDesc = character.versions[version];
    
    return `
${character.basePrompt}, ${desc.appearance}, ${desc.clothing}, ${desc.weapon},
${desc.expression}, ${desc.pose},
${desc.background},
${version === 'awakened' ? verDesc : ''},
${params.style}, ${params.lighting}, ${params.colorPalette}, ${params.composition},
--ar 9:16 --style raw --s 250 --no ${params.negativePrompt}
`.trim().replace(/\s+/g, ' ');
}

// 生成Stable Diffusion Prompt
export function generateSDPrompt(character: CharacterArtConfig, version: 'normal' | 'awakened'): {
    prompt: string;
    negative: string;
} {
    const desc = character.description;
    const params = character.aiParams;
    const verDesc = character.versions[version];
    
    const prompt = `
(masterpiece, best quality, ultra-detailed), ${character.basePrompt},
${desc.appearance}, ${desc.clothing}, ${desc.weapon},
${desc.expression}, ${desc.pose}, ${desc.background},
${version === 'awakened' ? verDesc : ''},
${params.style}, ${params.lighting}, ${params.colorPalette}
`.trim();
    
    return {
        prompt: prompt.replace(/\s+/g, ' '),
        negative: params.negativePrompt
    };
}

// 导出所有角色的生成配置
export function exportAllPrompts(): Record<string, { midjourney: string; sd: { prompt: string; negative: string } }> {
    const result: Record<string, { midjourney: string; sd: { prompt: string; negative: string } }> = {};
    
    CHARACTER_ART_CONFIGS.forEach(char => {
        result[char.id] = {
            midjourney: generateMidjourneyPrompt(char, 'normal'),
            sd: generateSDPrompt(char, 'normal')
        };
    });
    
    return result;
}

// 保存配置到文件（用于批量生成）
export function saveGenerationConfig(outputPath: string): void {
    const config = {
        generatedAt: new Date().toISOString(),
        characters: CHARACTER_ART_CONFIGS.map(char => ({
            id: char.id,
            name: char.name,
            element: char.element,
            rarity: char.rarity,
            prompts: {
                normal: {
                    midjourney: generateMidjourneyPrompt(char, 'normal'),
                    sd: generateSDPrompt(char, 'normal')
                },
                awakened: {
                    midjourney: generateMidjourneyPrompt(char, 'awakened'),
                    sd: generateSDPrompt(char, 'awakened')
                }
            },
            recommendedSettings: {
                width: 1024,
                height: 1820,
                steps: 30,
                cfg: 7,
                sampler: 'DPM++ 2M Karras'
            }
        }))
    };
    
    // 注意：在浏览器/游戏环境中，这里需要改用其他方式保存
    console.log('Character art config:', JSON.stringify(config, null, 2));
}
