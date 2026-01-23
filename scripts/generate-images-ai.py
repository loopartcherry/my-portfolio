#!/usr/bin/env python3
"""
使用OpenAI DALL-E API生成图片的脚本
需要先安装: pip install openai requests pillow
需要设置环境变量: export OPENAI_API_KEY="your-api-key"
"""

import os
import sys
from pathlib import Path
import requests
from typing import Dict

# 配置
IMAGES_DIR = Path(__file__).parent.parent / "public" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# 图片需求列表
IMAGE_REQUIREMENTS = {
    "about-workshop.jpg": {
        "prompt": "A modern minimalist design workshop space, professional designer working on ToB visualization project, clean background, orange (#FF6B35) and purple (#9666FF) accent colors, dark theme, high quality, professional photography style, shallow depth of field, soft lighting",
        "width": 1792,
        "height": 1024
    },
    "about-story.jpg": {
        "prompt": "A thoughtful designer's journey from tech to design, abstract visualization of career transformation, purple and orange gradient, modern minimalist style, dark background, geometric shapes, flowing lines, professional illustration, digital art",
        "width": 1792,
        "height": 1024
    },
    "article-tob-visual.jpg": {
        "prompt": "ToB enterprise visualization design showcase, professional business presentation, data visualization, clean modern design, orange and purple theme, dashboard mockup, infographic style, minimalist, professional, high quality",
        "width": 1792,
        "height": 1024
    },
    "article-data-story.jpg": {
        "prompt": "Data visualization storytelling, transforming complex data into clear visual narratives, infographic style, modern design, dark theme, charts and graphs, clean layout, orange and purple accents, professional design",
        "width": 1792,
        "height": 1024
    },
    "article-pitch.jpg": {
        "prompt": "Professional pitch deck design, investor presentation, business proposal visualization, sleek modern design, orange and purple accents, clean typography, minimalist layout, professional presentation slide, high quality",
        "width": 1792,
        "height": 1024
    },
    "article-dashboard.jpg": {
        "prompt": "Modern dashboard design, data analytics interface, clean UI, professional ToB SaaS dashboard, dark theme with orange and purple accents, charts and metrics, minimalist design, professional mockup, high quality",
        "width": 1792,
        "height": 1024
    },
    "avatar.jpg": {
        "prompt": "Professional designer portrait, friendly confident expression, modern style, neutral background, high quality headshot, studio lighting, professional photography, clean background, portrait photography",
        "width": 1024,
        "height": 1024
    },
    "product-ppt.jpg": {
        "prompt": "Professional PowerPoint template design for ToB presentations, modern slide design, clean layout, orange (#FF6B35) and purple (#9666FF) color scheme, business presentation template, minimalist design, professional, high quality mockup",
        "width": 1792,
        "height": 1024
    },
    "product-design-system.jpg": {
        "prompt": "Design system showcase, component library, UI kit visualization, modern design tokens, orange and purple theme, professional design system mockup, clean interface, component grid, high quality design",
        "width": 1792,
        "height": 1024
    },
    "product-toolkit.jpg": {
        "prompt": "Data visualization toolkit, design resources, tools and templates collection, modern design, dark theme with orange accents, professional toolkit showcase, clean layout, high quality mockup",
        "width": 1792,
        "height": 1024
    },
    "product-course.jpg": {
        "prompt": "Online design course illustration, educational content, ToB visualization training, modern learning interface, professional design, orange and purple theme, clean educational design, course banner, high quality",
        "width": 1792,
        "height": 1024
    },
}

def generate_with_openai(filename: str, config: Dict) -> bool:
    """使用OpenAI DALL-E生成图片"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("错误: 请设置 OPENAI_API_KEY 环境变量")
        print("  例如: export OPENAI_API_KEY='your-api-key'")
        return False
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        print(f"正在生成: {filename}...")
        print(f"提示词: {config['prompt'][:100]}...")
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=config['prompt'],
            size=f"{config['width']}x{config['height']}",
            quality="hd",
            n=1,
        )
        
        image_url = response.data[0].url
        print(f"  图片URL: {image_url}")
        
        # 下载图片
        img_response = requests.get(image_url)
        if img_response.status_code == 200:
            output_path = IMAGES_DIR / filename
            with open(output_path, 'wb') as f:
                f.write(img_response.content)
            print(f"✓ 已保存: {filename}")
            return True
        else:
            print(f"✗ 下载失败: {filename}")
            return False
            
    except ImportError:
        print("错误: 请先安装 openai 库")
        print("  运行: pip install openai requests")
        return False
    except Exception as e:
        print(f"✗ 生成失败 {filename}: {e}")
        return False

def main():
    print("=" * 60)
    print("使用OpenAI DALL-E生成图片")
    print("=" * 60)
    
    # 检查已有图片
    existing_images = set(os.listdir(IMAGES_DIR)) if IMAGES_DIR.exists() else set()
    
    # 生成缺失的图片
    to_generate = {
        filename: config 
        for filename, config in IMAGE_REQUIREMENTS.items()
        if filename not in existing_images
    }
    
    if not to_generate:
        print("\n所有图片已存在！")
        return
    
    print(f"\n需要生成 {len(to_generate)} 张图片\n")
    
    generated = 0
    for filename, config in to_generate.items():
        if generate_with_openai(filename, config):
            generated += 1
        print()  # 空行分隔
    
    print("=" * 60)
    print(f"完成！成功生成了 {generated}/{len(to_generate)} 张图片")

if __name__ == "__main__":
    main()
