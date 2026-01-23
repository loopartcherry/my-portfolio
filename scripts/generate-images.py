#!/usr/bin/env python3
"""
图片生成脚本
使用AI生成缺失的图片文件
"""

import os
import requests
from pathlib import Path

# 配置
IMAGES_DIR = Path(__file__).parent.parent / "public" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# 图片需求列表（描述、尺寸、用途）
IMAGE_REQUIREMENTS = {
    "about-workshop.jpg": {
        "prompt": "A modern minimalist design workshop space, professional designer working on ToB visualization project, clean background, orange and purple accent colors, dark theme, high quality",
        "description": "关于页面 - 工作坊背景图",
        "width": 1920,
        "height": 1080
    },
    "about-story.jpg": {
        "prompt": "A thoughtful designer's journey from tech to design, abstract visualization of career transformation, purple and orange gradient, modern minimalist style, dark background",
        "description": "关于页面 - 创始人故事配图",
        "width": 1920,
        "height": 1080
    },
    "article-tob-visual.jpg": {
        "prompt": "ToB enterprise visualization design showcase, professional business presentation, data visualization, clean modern design, orange and purple theme",
        "description": "文章配图 - ToB可视化",
        "width": 1600,
        "height": 900
    },
    "article-data-story.jpg": {
        "prompt": "Data visualization storytelling, transforming complex data into clear visual narratives, infographic style, modern design, dark theme",
        "description": "文章配图 - 数据故事",
        "width": 1600,
        "height": 900
    },
    "article-pitch.jpg": {
        "prompt": "Professional pitch deck design, investor presentation, business proposal visualization, sleek modern design, orange and purple accents",
        "description": "文章配图 - 融资BP",
        "width": 1600,
        "height": 900
    },
    "article-dashboard.jpg": {
        "prompt": "Modern dashboard design, data analytics interface, clean UI, professional ToB SaaS dashboard, dark theme with orange and purple accents",
        "description": "文章配图 - 仪表板设计",
        "width": 1600,
        "height": 900
    },
    "avatar.jpg": {
        "prompt": "Professional designer portrait, friendly confident expression, modern style, neutral background, high quality headshot",
        "description": "作者头像",
        "width": 400,
        "height": 400
    },
    "product-ppt.jpg": {
        "prompt": "Professional PowerPoint template design for ToB presentations, modern slide design, clean layout, orange and purple color scheme, business presentation",
        "description": "产品 - PPT模板",
        "width": 1600,
        "height": 900
    },
    "product-design-system.jpg": {
        "prompt": "Design system showcase, component library, UI kit visualization, modern design tokens, orange and purple theme, professional",
        "description": "产品 - 设计系统",
        "width": 1600,
        "height": 900
    },
    "product-toolkit.jpg": {
        "prompt": "Data visualization toolkit, design resources, tools and templates collection, modern design, dark theme with orange accents",
        "description": "产品 - 工具包",
        "width": 1600,
        "height": 900
    },
    "product-course.jpg": {
        "prompt": "Online design course illustration, educational content, ToB visualization training, modern learning interface, professional design",
        "description": "产品 - 设计课程",
        "width": 1600,
        "height": 900
    },
}

def generate_placeholder_image(filename, width, height, description):
    """生成占位图片（暂时使用placeholder服务）"""
    placeholder_url = f"https://via.placeholder.com/{width}x{height}.jpg?text={description.replace(' ', '+')}"
    
    try:
        response = requests.get(placeholder_url, timeout=10)
        if response.status_code == 200:
            output_path = IMAGES_DIR / filename
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"✓ 已生成占位图片: {filename}")
            return True
    except Exception as e:
        print(f"✗ 生成失败 {filename}: {e}")
    return False

def main():
    print("开始生成缺失的图片...")
    print("=" * 60)
    
    # 检查已有图片
    existing_images = set(os.listdir(IMAGES_DIR)) if IMAGES_DIR.exists() else set()
    
    # 生成缺失的图片
    generated = 0
    for filename, config in IMAGE_REQUIREMENTS.items():
        if filename not in existing_images:
            print(f"\n生成: {filename} - {config['description']}")
            if generate_placeholder_image(filename, config['width'], config['height'], config['description']):
                generated += 1
            # 注意：这里使用占位图片，实际AI生成需要接入真实的图片生成API
            print(f"提示词: {config['prompt']}")
        else:
            print(f"✓ 已存在: {filename}")
    
    print("\n" + "=" * 60)
    print(f"完成！生成了 {generated} 张新图片")
    print("\n注意：当前使用占位图片服务")
    print("如需使用AI生成，请:")
    print("1. 安装图片生成库 (如: openai, stability-sdk, replicate)")
    print("2. 配置API密钥")
    print("3. 替换 generate_placeholder_image 函数中的实现")

if __name__ == "__main__":
    main()
