#!/usr/bin/env python3
"""
使用 Lovart API 生成图片的脚本
需要先安装: pip install requests pillow
需要设置环境变量: export LOVART_API_KEY="your-api-key"
"""

import os
import sys
from pathlib import Path
import requests
import time
from typing import Dict, Optional

# 配置
IMAGES_DIR = Path(__file__).parent.parent / "public" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Lovart API 配置（根据实际API文档调整）
LOVART_API_BASE = os.getenv("LOVART_API_BASE", "https://api.lovart.ai/v1")  # 根据实际API地址调整
LOVART_API_KEY = os.getenv("LOVART_API_KEY")

# 图片需求列表
IMAGE_REQUIREMENTS = {
    "about-workshop.jpg": {
        "prompt": "A modern minimalist design workshop space, professional designer working on ToB visualization project, clean background, orange (#FF6B35) and purple (#9666FF) accent colors, dark theme, high quality, professional photography style, shallow depth of field, soft lighting",
        "width": 1920,
        "height": 1080
    },
    "about-story.jpg": {
        "prompt": "A thoughtful designer's journey from tech to design, abstract visualization of career transformation, purple and orange gradient, modern minimalist style, dark background, geometric shapes, flowing lines, professional illustration, digital art",
        "width": 1920,
        "height": 1080
    },
    "article-tob-visual.jpg": {
        "prompt": "ToB enterprise visualization design showcase, professional business presentation, data visualization, clean modern design, orange and purple theme, dashboard mockup, infographic style, minimalist, professional, high quality",
        "width": 1600,
        "height": 900
    },
    "article-data-story.jpg": {
        "prompt": "Data visualization storytelling, transforming complex data into clear visual narratives, infographic style, modern design, dark theme, charts and graphs, clean layout, orange and purple accents, professional design",
        "width": 1600,
        "height": 900
    },
    "article-pitch.jpg": {
        "prompt": "Professional pitch deck design, investor presentation, business proposal visualization, sleek modern design, orange and purple accents, clean typography, minimalist layout, professional presentation slide, high quality",
        "width": 1600,
        "height": 900
    },
    "article-dashboard.jpg": {
        "prompt": "Modern dashboard design, data analytics interface, clean UI, professional ToB SaaS dashboard, dark theme with orange and purple accents, charts and metrics, minimalist design, professional mockup, high quality",
        "width": 1600,
        "height": 900
    },
    "avatar.jpg": {
        "prompt": "Professional designer portrait, friendly confident expression, modern style, neutral background, high quality headshot, studio lighting, professional photography, clean background, portrait photography",
        "width": 400,
        "height": 400
    },
    "product-ppt.jpg": {
        "prompt": "Professional PowerPoint template design for ToB presentations, modern slide design, clean layout, orange (#FF6B35) and purple (#9666FF) color scheme, business presentation template, minimalist design, professional, high quality mockup",
        "width": 1600,
        "height": 900
    },
    "product-design-system.jpg": {
        "prompt": "Design system showcase, component library, UI kit visualization, modern design tokens, orange and purple theme, professional design system mockup, clean interface, component grid, high quality design",
        "width": 1600,
        "height": 900
    },
    "product-toolkit.jpg": {
        "prompt": "Data visualization toolkit, design resources, tools and templates collection, modern design, dark theme with orange accents, professional toolkit showcase, clean layout, high quality mockup",
        "width": 1600,
        "height": 900
    },
    "product-course.jpg": {
        "prompt": "Online design course illustration, educational content, ToB visualization training, modern learning interface, professional design, orange and purple theme, clean educational design, course banner, high quality",
        "width": 1600,
        "height": 900
    },
}

def generate_with_lovart(filename: str, config: Dict) -> bool:
    """使用 Lovart API 生成图片"""
    if not LOVART_API_KEY:
        print("错误: 请设置 LOVART_API_KEY 环境变量")
        print("  例如: export LOVART_API_KEY='your-api-key'")
        return False
    
    try:
        print(f"正在生成: {filename}...")
        print(f"提示词: {config['prompt'][:100]}...")
        
        # Lovart API 调用（根据实际API文档调整）
        # 方式1: 如果Lovart使用类似OpenAI的接口
        headers = {
            "Authorization": f"Bearer {LOVART_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # 根据Lovart API的实际格式调整payload
        payload = {
            "prompt": config['prompt'],
            "width": config['width'],
            "height": config['height'],
            "num_images": 1,
            # 根据实际API参数添加其他配置
            # "model": "lovart-v1",  # 如果有模型选择
            # "quality": "hd",  # 如果有质量选项
        }
        
        # 方式1: 直接生成（如果API支持）
        response = requests.post(
            f"{LOVART_API_BASE}/images/generations",
            headers=headers,
            json=payload,
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # 根据实际API响应格式调整
            # 如果返回的是图片URL
            if 'data' in data and len(data['data']) > 0:
                image_url = data['data'][0].get('url') or data['data'][0].get('image_url')
            elif 'url' in data:
                image_url = data['url']
            elif 'image_url' in data:
                image_url = data['image_url']
            else:
                print(f"✗ API响应格式未知: {data}")
                return False
            
            # 下载图片
            img_response = requests.get(image_url, timeout=60)
            if img_response.status_code == 200:
                output_path = IMAGES_DIR / filename
                with open(output_path, 'wb') as f:
                    f.write(img_response.content)
                print(f"✓ 已保存: {filename}")
                return True
            else:
                print(f"✗ 下载失败: {filename} (HTTP {img_response.status_code})")
                return False
                
        # 方式2: 异步生成（如果API需要先提交任务，再轮询结果）
        elif response.status_code == 202:
            task_id = response.json().get('task_id') or response.json().get('id')
            print(f"  任务已提交，任务ID: {task_id}")
            
            # 轮询任务状态
            max_attempts = 60
            for attempt in range(max_attempts):
                time.sleep(2)  # 等待2秒
                status_response = requests.get(
                    f"{LOVART_API_BASE}/tasks/{task_id}",
                    headers=headers,
                    timeout=30
                )
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    status = status_data.get('status', 'pending')
                    
                    if status == 'completed':
                        image_url = status_data.get('result', {}).get('url') or status_data.get('image_url')
                        # 下载图片
                        img_response = requests.get(image_url, timeout=60)
                        if img_response.status_code == 200:
                            output_path = IMAGES_DIR / filename
                            with open(output_path, 'wb') as f:
                                f.write(img_response.content)
                            print(f"✓ 已保存: {filename}")
                            return True
                    elif status == 'failed':
                        print(f"✗ 任务失败: {filename}")
                        return False
                    # 继续等待
                else:
                    print(f"✗ 查询状态失败: {filename} (HTTP {status_response.status_code})")
                    return False
            
            print(f"✗ 超时: {filename}")
            return False
            
        else:
            print(f"✗ API调用失败: {filename} (HTTP {response.status_code})")
            print(f"  响应: {response.text[:200]}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"✗ 网络错误 {filename}: {e}")
        return False
    except Exception as e:
        print(f"✗ 生成失败 {filename}: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 60)
    print("使用 Lovart API 生成图片")
    print("=" * 60)
    
    if not LOVART_API_KEY:
        print("\n⚠️  未设置 LOVART_API_KEY 环境变量")
        print("\n请设置您的 Lovart API 密钥：")
        print("  export LOVART_API_KEY='your-api-key'")
        print("\n如果API地址不是默认值，也可以设置：")
        print("  export LOVART_API_BASE='https://your-api-endpoint.com/v1'")
        print("\n当前API地址:", LOVART_API_BASE)
        return
    
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
    print(f"API地址: {LOVART_API_BASE}")
    print()
    
    generated = 0
    for filename, config in to_generate.items():
        if generate_with_lovart(filename, config):
            generated += 1
        print()  # 空行分隔
        time.sleep(1)  # 避免请求过快
    
    print("=" * 60)
    print(f"完成！成功生成了 {generated}/{len(to_generate)} 张图片")
    
    if generated < len(to_generate):
        print("\n提示：如果部分图片生成失败，请检查：")
        print("1. API密钥是否正确")
        print("2. API地址是否正确（当前:", LOVART_API_BASE, ")")
        print("3. API请求格式是否匹配（可能需要根据实际API文档调整脚本）")

if __name__ == "__main__":
    main()
