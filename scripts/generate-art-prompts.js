const fs = require('fs');
const path = require('path');

// 角色立绘详细配置
const characters = [
    {
        id: 'jin_yu',
        name: '烬羽',
        title: '焚天剑姬',
        element: 'fire',
        rarity: 'rare',
        class: 'warrior',
        midjourney: {
            normal: `female warrior, phoenix themed armor, flame patterns, katana, elegant but fierce, 20 years old, black hair with red highlights, golden eyes, crimson and black light armor, phoenix wing shoulder guards, flowing damaged cape, holding katana with lava-like patterns, determined and sorrowful expression, side stance ready to draw, burning village ruins at sunset, embers floating, dramatic golden hour lighting, warm orange-red dominant, deep black shadows, anime style, highly detailed, cinematic, concept art, full body, dynamic pose, vertical composition --ar 9:16 --style raw --s 250`,
            awakened: `female warrior surrounded by intense flames, armor transforming into phoenix wings manifesting, eyes glowing with fire, hair floating weightless, phoenix rising in background, golden flames everywhere, transcendent power, ultimate form, golden aura, anime style, highly detailed, cinematic lighting --ar 9:16 --style raw --s 750 --niji 5`
        },
        sd: {
            normal: `(masterpiece, best quality, ultra-detailed:1.2), female warrior, phoenix armor, flame patterns, katana, 1girl, solo, black hair with red tips, golden eyes, red and black armor, phoenix shoulder wings, damaged cape, lava patterned katana, determined expression, burning village background, sunset, embers, dramatic lighting, warm colors, anime style, cinematic, full body`,
            negative: `worst quality, low quality, normal quality, bad anatomy, bad hands, signature, watermark, username, blurry, artist name, bright colors, happy, smiling`
        },
        description: '年轻的女性剑士，身穿燃烧殆尽的凤凰铠甲，手持熔岩纹路长刀。眼神坚定而悲伤，背负着燃烧的村庄记忆。',
        color: '#FF6B35'
    },
    {
        id: 'qing_yi',
        name: '青漪',
        title: '流水琴仙',
        element: 'water',
        rarity: 'epic',
        class: 'priest',
        midjourney: {
            normal: `elegant female musician, flowing cyan dress, ancient guqin, ethereal beauty, water magic, 22 years old, long cyan hair like waterfall, pearl hair ornaments, clear blue eyes, white silk upper garment, flowing sleeves, ankle bells, barefoot, serene and melancholic expression, kneeling playing guqin, bamboo forest at moonlight, mist and blue light particles, soft moonlight, cool blue tones, bioluminescent particles, chinese ink painting mixed with anime, ethereal, dreamy, full body seated pose --ar 9:16 --style raw --s 250`,
            awakened: `celestial musician floating in air, surrounded by water dragons, dress transforming into liquid water, hair flowing like waterfall, playing music creating visible water ripples, massive tidal wave and water dragon in background, transcendent beauty, divine water spirit, cyan and silver glow, ethereal atmosphere --ar 9:16 --style raw --s 750 --niji 5`
        },
        sd: {
            normal: `(masterpiece, best quality, ultra-detailed:1.2), female musician, ancient guqin, 1girl, solo, long cyan hair, blue eyes, flowing cyan dress, white silk sleeves, pearl ornaments, barefoot, ankle bells, melancholic expression, playing instrument, bamboo forest, moonlight, mist, blue particles, cool colors, chinese style, ethereal, full body`,
            negative: `warm tones, bright colors, aggressive pose, modern clothing, worst quality, low quality, blurry`
        },
        description: '温婉的女性琴师，身着淡青色长裙，怀抱古琴。在月光下的竹林中弹奏，有水雾和蓝色光点环绕。',
        color: '#4ECDC4'
    },
    {
        id: 'zhu_feng',
        name: '逐风',
        title: '影杀',
        element: 'wind',
        rarity: 'epic',
        class: 'assassin',
        midjourney: {
            normal: `mysterious masked assassin, dark fitted outfit, dual short blades, wind effects, stealthy pose, unknown age, black face mask covering lower face, sharp emerald green eyes, black short hair, dark green and black outfit, leather armor, multiple weapon pouches, fingerless gloves, bandaged arms, short cape, holding twin daggers with green glow, cold sharp killer eyes, crouching on building edge like hunting panther, ruined city in storm, wind and leaves swirling, dark storm clouds, dynamic composition --ar 9:16 --style raw --s 250`,
            awakened: `assassin moving at impossible speed leaving afterimages, surrounded by tornado, blades glowing with green wind energy, mask partially revealing intense expression, storm completely consuming background, ultimate wind technique, invisible speed, green lightning, transcendent assassin --ar 9:16 --style raw --s 750 --niji 5`
        },
        sd: {
            normal: `(masterpiece, best quality, ultra-detailed:1.2), masked assassin, dual blades, 1boy, solo, black mask, green eyes, black hair, dark green outfit, leather armor, weapon pouches, bandages, short cape, glowing daggers, cold expression, crouching pose, stormy background, wind effects, leaves swirling, dark fantasy, dynamic pose`,
            negative: `bright colors, happy expression, static pose, armor too heavy, exposed face, low quality`
        },
        description: '神秘的蒙面刺客，身形修长矫健，手持双短刃。在狂风中的废墟里潜伏，眼神锐利如刀。',
        color: '#95E1D3'
    },
    {
        id: 'yan_xin',
        name: '岩心',
        title: '铁壁',
        element: 'earth',
        rarity: 'rare',
        class: 'tank',
        midjourney: {
            normal: `bulky armored knight, tower shield, earth armor, stalwart defender, 30 years old, tall muscular build, short spiky hair, facial scars, determined eyes, full heavy rock-textured plate armor, mountain-shaped shoulder guards, earth gem on chest, removable face helmet, tattered brown cape, massive tower shield with crack patterns, one-handed war hammer, firm grounded stance, broken wall or mountain fortress background, dusty atmosphere, earthy tones, realistic anime, solid composition --ar 9:16 --style raw --s 250`,
            awakened: `armor covered in living rock and crystals, body partially merged with stone, shield transformed into massive earth wall, creating earthquake just by standing, mountains rising in background, earth titan form, indestructible fortress, brown and gold glow, ultimate defense --ar 9:16 --style raw --s 750 --niji 5`
        },
        sd: {
            normal: `(masterpiece, best quality, ultra-detailed:1.2), armored knight, tower shield, 1boy, solo, muscular, tall, short hair, facial scar, determined expression, heavy plate armor, rock texture, mountain shoulders, brown cape, massive shield, war hammer, standing pose, fortress background, dusty, earth tones, realistic, grounded`,
            negative: `slim build, bright colors, smiling, dynamic pose, modern elements, low quality`
        },
        description: '魁梧的重装战士，全身覆盖岩石质感板甲，手持巨盾。如山岳般稳固，是团队最可靠的防线。',
        color: '#C9B99A'
    },
    {
        id: 'ming_zhu',
        name: '明烛',
        title: '圣光祭司',
        element: 'light',
        rarity: 'legendary',
        class: 'priest',
        midjourney: {
            normal: `holy priestess, golden light, white robes, divine staff, compassionate, 25 years old, golden braided hair, golden crown, warm amber eyes, white and gold holy robes, sun embroidery, golden belt with cross, golden accessories, holding sacred staff with glowing lantern, kind and compassionate expression, gentle smile, standing or floating gracefully, radiant temple or cloud sanctuary, golden light rays, floating light particles, angelic symbols, warm divine atmosphere, divine fantasy art --ar 9:16 --style raw --s 250`,
            awakened: `fully transformed angelic form with wings of pure light, floating high above, radiating intense golden aura that dispels all darkness, eyes glowing white, heavenly gates opening in background, divine ascension, ultimate holy form, transcendent light, gold and white explosion of holy power --ar 9:16 --style raw --s 750 --niji 5`
        },
        sd: {
            normal: `(masterpiece, best quality, ultra-detailed:1.2), holy priestess, divine staff, 1girl, solo, golden hair, crown, amber eyes, white and gold robes, sun embroidery, golden accessories, sacred staff, glowing lantern, compassionate smile, floating pose, temple background, golden light rays, light particles, divine atmosphere, fantasy art, ethereal`,
            negative: `dark colors, shadows, evil, dark background, low quality, worst quality`
        },
        description: '圣洁的女性祭司，身着白色神圣长袍，手持发光法杖。在光芒四射的神殿中，给人温暖和治愈。',
        color: '#FFD93D'
    },
    {
        id: 'can_ying',
        name: '残影',
        title: '记忆碎片',
        element: 'dark',
        rarity: 'mythic',
        class: 'assassin',
        midjourney: {
            normal: `mysterious silhouette, memory fragments, void entity, fragmented reality, ethereal, slender form made of memory fragments, blue void glow between fragments, face obscured shadow, complex emotional eyes, translucent body showing glimpses of different scenes, shadow blades with blue light, mysterious pose reaching toward viewer, pure void or starry space background, distant nebula, floating memory fragments, dark blue and black, cyan highlights, abstract surreal, mysterious --ar 9:16 --style raw --s 250`,
            awakened: `memory fragments coalescing into more defined but still ethereal form, revealing glimpses of true identity through fragments, surrounded by vortex of memories and shadows, eyes showing full range of human emotions, multiple timelines converging in background, transcendence through memories, ultimate void form --ar 9:16 --style raw --s 750 --niji 5`
        },
        sd: {
            normal: `(masterpiece, best quality, ultra-detailed:1.2), mysterious silhouette, memory fragments, void entity, 1other, solo, form made of fragments, blue glow, obscured face, complex eyes, translucent body, shadow blades, reaching pose, void space background, nebula, floating fragments, dark blue, cyan highlights, surreal, mysterious`,
            negative: `solid form, bright colors, defined features, happy, simple background, low quality`
        },
        description: '由记忆碎片构成的神秘存在，轮廓模糊但散发熟悉感。在虚空中时隐时现，蕴含着复杂的情感。',
        color: '#6C5CE7'
    }
];

// 生成配置文件
const output = {
    generatedAt: new Date().toISOString(),
    version: '1.0',
    total: characters.length,
    characters: characters.map(char => ({
        id: char.id,
        name: char.name,
        title: char.title,
        element: char.element,
        rarity: char.rarity,
        class: char.class,
        description: char.description,
        color: char.color,
        prompts: {
            midjourney: char.midjourney,
            stableDiffusion: char.sd
        },
        recommended: {
            width: 1024,
            height: 1820,
            steps: 30,
            cfg: 7,
            sampler: 'DPM++ 2M Karras',
            model: 'AnythingV5/NovelAI/CounterfeitV3'
        }
    }))
};

// 保存配置
const outputPath = path.join(__dirname, '..', 'docs', 'Character_Art_Prompts.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log('✅ Character art prompts generated!');
console.log(`📁 Saved to: ${outputPath}`);
console.log(`📊 Total: ${characters.length} characters × 2 versions = ${characters.length * 2} prompts`);

// 同时生成Markdown格式方便阅读
const mdContent = `# 角色立绘AI生成配置

生成时间: ${new Date().toLocaleString()}

## 角色列表

${characters.map(char => `
### ${char.name} (${char.title})
- **ID**: ${char.id}
- **元素**: ${char.element}
- **稀有度**: ${char.rarity}
- **职业**: ${char.class}
- **描述**: ${char.description}

#### Midjourney Prompt (普通)
\`\`\`
${char.midjourney.normal}
\`\`\`

#### Midjourney Prompt (觉醒)
\`\`\`
${char.midjourney.awakened}
\`\`\`

#### Stable Diffusion Prompt (普通)
\`\`\`
${char.sd.normal}
\`\`\`

**Negative Prompt:**
\`\`\`
${char.sd.negative}
\`\`\`
`).join('\n---\n')}

## 生成参数建议

- **分辨率**: 1024 × 1820 (9:16)
- **步数**: 30
- **CFG**: 7
- **采样器**: DPM++ 2M Karras
- **推荐模型**: AnythingV5 / NovelAI / CounterfeitV3

## 文件命名
\`\`\`
cards/
├── {id}_portrait.png    (512×512 头像)
├── {id}_full.png        (1024×1820 全身)
└── {id}_awaken.png      (1024×1820 觉醒)
\`\`\`
`;

const mdPath = path.join(__dirname, '..', 'docs', 'Character_Art_Prompts.md');
fs.writeFileSync(mdPath, mdContent);

console.log(`📝 Markdown version saved to: ${mdPath}`);
