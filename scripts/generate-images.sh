#!/bin/bash

# 图片生成脚本 - 使用placeholder服务临时生成图片

IMAGES_DIR="public/images"
mkdir -p "$IMAGES_DIR"

echo "开始生成缺失的图片..."
echo "=========================================="

# 检查并生成缺失的图片
generate_image() {
    local filename=$1
    local width=$2
    local height=$3
    local description=$4
    
    if [ ! -f "$IMAGES_DIR/$filename" ]; then
        echo "生成: $filename - $description"
        curl -s "https://via.placeholder.com/${width}x${height}.jpg" -o "$IMAGES_DIR/$filename"
        if [ $? -eq 0 ]; then
            echo "✓ 已生成: $filename"
        else
            echo "✗ 生成失败: $filename"
        fi
    else
        echo "✓ 已存在: $filename"
    fi
}

# 生成所有缺失的图片
generate_image "about-workshop.jpg" 1920 1080 "About Workshop"
generate_image "about-story.jpg" 1920 1080 "About Story"
generate_image "article-tob-visual.jpg" 1600 900 "Article ToB Visual"
generate_image "article-data-story.jpg" 1600 900 "Article Data Story"
generate_image "article-pitch.jpg" 1600 900 "Article Pitch"
generate_image "article-dashboard.jpg" 1600 900 "Article Dashboard"
generate_image "avatar.jpg" 400 400 "Avatar"
generate_image "product-ppt.jpg" 1600 900 "Product PPT"
generate_image "product-design-system.jpg" 1600 900 "Product Design System"
generate_image "product-toolkit.jpg" 1600 900 "Product Toolkit"
generate_image "product-course.jpg" 1600 900 "Product Course"

echo ""
echo "=========================================="
echo "完成！"
echo ""
echo "注意：当前生成的是占位图片"
echo "如需使用AI生成真实图片，请参考 generate-images-ai.md 文档"
