#!/bin/bash
# 美术资源生成监控脚本
# 每10分钟检查一次生成进度

LOG_FILE="/root/.openclaw/workspace/projects/memory-collector/assets/images/generated/EXECUTION_LOG.md"
OUTPUT_DIR="/root/.openclaw/workspace/projects/memory-collector/assets/images/generated"

while true; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 检查生成进度..."
    
    # 统计已生成的文件
    CHAR_COUNT=$(ls -1 $OUTPUT_DIR/characters/*.png 2>/dev/null | wc -l)
    CARD_COUNT=$(ls -1 $OUTPUT_DIR/cards/*.png 2>/dev/null | wc -l)
    UI_COUNT=$(ls -1 $OUTPUT_DIR/ui/*.png 2>/dev/null | wc -l)
    
    echo "主角立绘: $CHAR_COUNT/18"
    echo "卡牌: $CARD_COUNT/700"
    echo "UI素材: $UI_COUNT/30"
    
    # 如果18张主角立绘完成，开始生成卡牌
    if [ $CHAR_COUNT -ge 18 ] && [ $CARD_COUNT -lt 700 ]; then
        echo "主角立绘已完成，开始批量生成卡牌..."
        # 这里可以触发卡牌生成脚本
    fi
    
    # 更新日志
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 进度: 立绘$CHAR_COUNT/18, 卡牌$CARD_COUNT/700, UI$UI_COUNT/30" >> $LOG_FILE
    
    # 每10分钟检查一次
    sleep 600
done
