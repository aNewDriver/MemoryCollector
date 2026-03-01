const fs = require('fs');
const path = require('path');

/**
 * AI立绘生成工具
 * 整理Prompt并输出为可直接使用的格式
 */

const config = require('../docs/Character_Art_Prompts.json');

// 输出目录
const outputDir = path.join(__dirname, '..', 'docs', 'ai_generation');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 整理AI生成配置...\n');

// 1. 生成Midjourney批量提示文件
const midjourneyContent = config.characters.map(char => {
    return `
# ${char.name} (${char.title}) - 普通版本
${char.prompts.midjourney.normal}

# ${char.name} - 觉醒版本
${char.prompts.midjourney.awakened}

---
`;
}).join('\n');

fs.writeFileSync(
    path.join(outputDir, 'midjourney_prompts.txt'),
    `# Midjourney 角色立绘生成提示词
# 生成时间: ${new Date().toLocaleString()}
# 使用方法: 复制下面的提示词到 Midjourney Discord 中

${midjourneyContent}

# 提示:
# 1. 普通版本用于常规立绘
# 2. 觉醒版本用于觉醒/突破后立绘
# 3. 建议先用普通版本测试效果，满意后再生成觉醒版本
# 4. 可以使用 --seed 参数保持角色一致性
`
);

console.log('✓ 已生成: midjourney_prompts.txt');

// 2. 生成Stable Diffusion批量提示文件
const sdContent = config.characters.map(char => {
    return `
# ${char.name} (${char.title})
## 正面提示词 (Prompt)
${char.prompts.stableDiffusion.normal}

## 负面提示词 (Negative Prompt)
${char.prompts.stableDiffusion.negative}

## 推荐参数
- 分辨率: ${char.recommended.width} x ${char.recommended.height}
- 步数: ${char.recommended.steps}
- CFG: ${char.recommended.cfg}
- 采样器: ${char.recommended.sampler}
- 模型: ${char.recommended.model}

---
`;
}).join('\n');

fs.writeFileSync(
    path.join(outputDir, 'stable_diffusion_prompts.txt'),
    `# Stable Diffusion 角色立绘生成提示词
# 生成时间: ${new Date().toLocaleString()}

${sdContent}

# 使用建议:
# 1. 使用 ControlNet 保持角色姿势一致性
# 2. 可以用 ADetailer 修复面部细节
# 3. Hires.fix 可以提升图像质量
# 4. 使用相同的 Seed 可以保持角色一致性
`
);

console.log('✓ 已生成: stable_diffusion_prompts.txt');

// 3. 生成批量生成脚本 (ComfyUI/Automatic1111)
const batchScript = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    total: config.characters.length * 2, // 普通+觉醒
    characters: config.characters.map(char => ({
        id: char.id,
        name: char.name,
        versions: [
            {
                type: 'normal',
                filename: `${char.id}_full.png`,
                prompt: char.prompts.stableDiffusion.normal,
                negative: char.prompts.stableDiffusion.negative,
                width: char.recommended.width,
                height: char.recommended.height,
                steps: char.recommended.steps,
                cfg: char.recommended.cfg,
                sampler: char.recommended.sampler
            },
            {
                type: 'awakened',
                filename: `${char.id}_awaken.png`,
                prompt: char.prompts.stableDiffusion.normal.replace(
                    /full body.*/i,
                    char.prompts.midjourney.awakened.replace(/--ar.*$/m, '')
                ),
                negative: char.prompts.stableDiffusion.negative,
                width: char.recommended.width,
                height: char.recommended.height,
                steps: 40, // 觉醒版本更多步数
                cfg: 8,
                sampler: char.recommended.sampler
            }
        ]
    }))
};

fs.writeFileSync(
    path.join(outputDir, 'batch_generation.json'),
    JSON.stringify(batchScript, null, 2)
);

console.log('✓ 已生成: batch_generation.json');

// 4. 生成ComfyUI工作流配置
const comfyUIWorkflow = {
    last_node_id: 15,
    last_link_id: 14,
    nodes: config.characters.map((char, index) => ({
        id: index * 3 + 1,
        type: "CLIPTextEncode",
        pos: [100, 100 + index * 200],
        size: {0: 400, 1: 200},
        inputs: {clip: ["4", 0]},
        widgets_values: [char.prompts.stableDiffusion.normal],
        outputs: [["3", 0]]
    })),
    links: [],
    groups: [],
    config: {},
    extra: {},
    version: 0.4
};

fs.writeFileSync(
    path.join(outputDir, 'comfyui_workflow.json'),
    JSON.stringify(comfyUIWorkflow, null, 2)
);

console.log('✓ 已生成: comfyui_workflow.json');

// 5. 生成文件命名规范文档
const namingGuide = `# 角色立绘文件命名规范

生成时间: ${new Date().toLocaleString()}

## 文件命名格式

\`\`\`
{角色ID}_{类型}.png
\`\`\`

### 示例

| 角色 | 普通立绘 | 觉醒立绘 | 头像 |
|------|----------|----------|------|
| 烬羽 | jin_yu_full.png | jin_yu_awaken.png | jin_yu_portrait.png |
| 青漪 | qing_yi_full.png | qing_yi_awaken.png | qing_yi_portrait.png |
| 逐风 | zhu_feng_full.png | zhu_feng_awaken.png | zhu_feng_portrait.png |
| 岩心 | yan_xin_full.png | yan_xin_awaken.png | yan_xin_portrait.png |
| 明烛 | ming_zhu_full.png | ming_zhu_awaken.png | ming_zhu_portrait.png |
| 残影 | can_ying_full.png | can_ying_awaken.png | can_ying_portrait.png |

## 存放路径

\`\`\`
assets/resources/images/cards/
├── jin_yu_full.png
├── jin_yu_awaken.png
├── jin_yu_portrait.png
├── qing_yi_full.png
├── ...
\`\`\`

## 分辨率要求

| 类型 | 分辨率 | 用途 |
|------|--------|------|
| full | 1024 x 1820 | 卡牌详情页全身立绘 |
| awaken | 1024 x 1820 | 觉醒后全身立绘 |
| portrait | 512 x 512 | 头像/列表展示 |

## 格式要求

- **格式**: PNG (支持透明通道)
- **色彩空间**: sRGB
- **位深度**: 8-bit

## 注意事项

1. 生成完成后请检查人物面部是否清晰
2. 确保角色特征与描述一致（发色、眼睛颜色、服装等）
3. 觉醒版本需要有明显的视觉升级效果
4. 所有图片需保持风格统一
`;

fs.writeFileSync(path.join(outputDir, 'naming_guide.md'), namingGuide);

console.log('✓ 已生成: naming_guide.md');

// 6. 生成一键复制网页
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>记忆回收者 - AI立绘生成工具</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .character { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .character h2 { margin-top: 0; color: #666; }
        .prompt-box { background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 10px 0; }
        .prompt-box h3 { margin-top: 0; font-size: 14px; color: #999; }
        pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
        button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        button:hover { background: #45a049; }
        .copy-btn { background: #2196F3; }
        .copy-btn:hover { background: #1976D2; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; background: #e0e0e0; border: none; cursor: pointer; }
        .tab.active { background: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>🎨 记忆回收者 - AI立绘生成工具</h1>
    <p>点击下方按钮复制Prompt，粘贴到 Midjourney / Stable Diffusion 中生成角色立绘。生成的图片请按 naming_guide.md 中的规范命名并存放到 assets/resources/images/cards/ 目录。</p>
    
    <div class="tabs">
        <button class="tab active" onclick="showTab('midjourney')">Midjourney</button>
        <button class="tab" onclick="showTab('sd')">Stable Diffusion</button>
    </div>
    
    <div id="midjourney-tab">
        ${config.characters.map(char => `
        <div class="character">
            <h2>${char.name} (${char.title}) - ${char.element}</h2>            
            <div class="prompt-box">
                <h3>普通版本</h3>
                <pre id="mj-${char.id}-normal">${char.prompts.midjourney.normal}</pre>
                <button class="copy-btn" onclick="copyToClipboard('mj-${char.id}-normal')">复制普通版Prompt</button>
            </div>            
            <div class="prompt-box">
                <h3>觉醒版本</h3>
                <pre id="mj-${char.id}-awaken">${char.prompts.midjourney.awakened}</pre>
                <button class="copy-btn" onclick="copyToClipboard('mj-${char.id}-awaken')">复制觉醒版Prompt</button>
            </div>
        </div>
        `).join('')}
    </div>
    
    <div id="sd-tab" style="display:none">
        ${config.characters.map(char => `
        <div class="character">
            <h2>${char.name} (${char.title}) - ${char.element}</h2>            
            <div class="prompt-box">
                <h3>正面提示词 (Prompt)</h3>
                <pre id="sd-${char.id}-prompt">${char.prompts.stableDiffusion.normal}</pre>
                <button class="copy-btn" onclick="copyToClipboard('sd-${char.id}-prompt')">复制Prompt</button>
            </div>            
            <div class="prompt-box">
                <h3>负面提示词 (Negative Prompt)</h3>
                <pre id="sd-${char.id}-neg">${char.prompts.stableDiffusion.negative}</pre>
                <button class="copy-btn" onclick="copyToClipboard('sd-${char.id}-neg')">复制Negative</button>
            </div>            
            <p><strong>推荐参数：</strong> 分辨率 ${char.recommended.width}x${char.recommended.height}, 步数 ${char.recommended.steps}, CFG ${char.recommended.cfg}, ${char.recommended.sampler}</p>
        </div>
        `).join('')}
    </div>
    
    <script>
        function copyToClipboard(elementId) {
            const text = document.getElementById(elementId).innerText;
            navigator.clipboard.writeText(text).then(() => {
                alert('已复制到剪贴板！');
            });
        }
        
        function showTab(tab) {
            document.getElementById('midjourney-tab').style.display = tab === 'midjourney' ? 'block' : 'none';
            document.getElementById('sd-tab').style.display = tab === 'sd' ? 'block' : 'none';
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
        }
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'ai_generator.html'), htmlContent);

console.log('✓ 已生成: ai_generator.html');

// 7. 生成生成任务清单
const taskList = config.characters.map(char => ([
    { id: `${char.id}_full`, name: `${char.name} - 全身立绘`, priority: 'P0', status: '待生成' },
    { id: `${char.id}_awaken`, name: `${char.name} - 觉醒立绘`, priority: 'P0', status: '待生成' },
    { id: `${char.id}_portrait`, name: `${char.name} - 头像`, priority: 'P0', status: '待生成' }
])).flat();

const taskContent = `# AI立绘生成任务清单

生成时间: ${new Date().toLocaleString()}
总计: ${taskList.length} 张图片

## 角色列表

| 序号 | 文件名 | 角色 | 类型 | 优先级 | 状态 |
|------|--------|------|------|--------|------|
${taskList.map((task, i) => `| ${i + 1} | ${task.id}.png | ${task.name.split(' - ')[0]} | ${task.name.split(' - ')[1]} | ${task.priority} | ${task.status} |`).join('\n')}

## 生成步骤

1. **准备环境**
   - Midjourney: 确保有活跃的订阅
   - Stable Diffusion: 安装好 WebUI 或 ComfyUI

2. **按顺序生成**
   - 建议先生成一个角色的普通版本和觉醒版本，确认风格统一后再批量生成

3. **质量检查**
   - 检查面部是否清晰
   - 检查角色特征是否符合描述
   - 检查画风是否统一

4. **导出处理**
   - 使用 Upscayl 或类似工具放大图片
   - 裁剪为合适的分辨率
   - 转换为 PNG 格式

5. **导入项目**
   - 按 naming_guide.md 规范命名
   - 放入 assets/resources/images/cards/ 目录
   - 在 Cocos Creator 中刷新资源

## 参考资源

- midjourney_prompts.txt - Midjourney 提示词
- stable_diffusion_prompts.txt - SD 提示词
- naming_guide.md - 文件命名规范
- ai_generator.html - 网页版生成工具（可直接复制Prompt）
`;

fs.writeFileSync(path.join(outputDir, 'task_list.md'), taskContent);

console.log('✓ 已生成: task_list.md');

// 汇总
console.log('\n📁 所有文件已生成到: docs/ai_generation/');
console.log('\n文件清单:');
console.log('  - midjourney_prompts.txt (Midjourney提示词)');
console.log('  - stable_diffusion_prompts.txt (SD提示词)');
console.log('  - batch_generation.json (批量生成配置)');
console.log('  - comfyui_workflow.json (ComfyUI工作流)');
console.log('  - naming_guide.md (命名规范)');
console.log('  - task_list.md (任务清单)');
console.log('  - ai_generator.html (网页版生成工具)');
console.log('\n💡 提示: 可以在浏览器中打开 ai_generator.html 方便地复制Prompt！');
